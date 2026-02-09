import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions, canEdit, isAdmin } from '@/lib/auth'
import { createServerClient } from '@/lib/supabase'
import { distributorSchema } from '@/lib/validators'
import { logAuditEvent } from '@/lib/audit'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from('distributors')
    .select(`
      *,
      countries:distributor_country_coverage(
        country:countries(*)
      ),
      locations:distributor_locations(*)
    `)
    .eq('id', id)
    .single()

  if (error || !data) {
    return NextResponse.json({ error: 'Distributor not found' }, { status: 404 })
  }

  // Transform the response
  const distributor = {
    ...(data as any),
    countries: (data as any).countries?.map((c: any) => c.country).filter(Boolean) || [],
    locations: (data as any).locations || [],
  }

  return NextResponse.json(distributor)
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!canEdit(session.user.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { id } = await params
  const supabase = createServerClient()

  try {
    const body = await request.json()
    const { country_coverage, locations, ...distributorData } = body

    // Debug logging
    console.log('Received locations:', JSON.stringify(locations, null, 2))

    // Get existing distributor
    const { data: existing, error: fetchError } = await supabase
      .from('distributors')
      .select('*')
      .eq('id', id)
      .single()

    if (fetchError || !existing) {
      return NextResponse.json({ error: 'Distributor not found' }, { status: 404 })
    }

    // Validate
    const validated = distributorSchema.parse({
      ...distributorData,
      country_coverage: country_coverage || [],
      locations: locations || [],
    })

    // Update distributor
    const { data: distributor, error: updateError } = await supabase
      .from('distributors')
      .update({
        name: validated.name,
        status: validated.status,
        description: validated.description || null,
        logo_url: validated.logo_url || null,
        website_url: validated.website_url || null,
        email: validated.email || null,
        phone: validated.phone || null,
        address_line1: validated.address_line1 || null,
        address_line2: validated.address_line2 || null,
        city: validated.city || null,
        state_region: validated.state_region || null,
        postal_code: validated.postal_code || null,
        country_hq: validated.country_hq || null,
        location_lat: validated.location_lat,
        location_lng: validated.location_lng,
        regions_served: validated.regions_served,
        languages_supported: validated.languages_supported,
        products_supported: validated.products_supported,
        service_types: validated.service_types,
        priority_rank: validated.priority_rank,
      } as any)
      .eq('id', id)
      .select()
      .single()

    if (updateError) {
      console.error('Update error:', updateError)
      return NextResponse.json({ error: 'Failed to update distributor' }, { status: 500 })
    }

    // Update country coverage
    // First, delete existing coverage
    await supabase
      .from('distributor_country_coverage')
      .delete()
      .eq('distributor_id', id)

    // Then, add new coverage
    if (validated.country_coverage.length > 0) {
      const coverageData = validated.country_coverage.map((iso2: string) => ({
        distributor_id: id,
        country_iso2: iso2,
      }))

      const { error: coverageError } = await supabase
        .from('distributor_country_coverage')
        .insert(coverageData)

      if (coverageError) {
        console.error('Coverage error:', coverageError)
      }
    }

    // Update locations
    // Get existing locations to determine what to update/delete/insert
    const { data: existingLocations, error: fetchLocError } = await supabase
      .from('distributor_locations')
      .select('id')
      .eq('distributor_id', id)

    if (fetchLocError) {
      console.error('Error fetching existing locations:', fetchLocError)
    }

    const existingLocationIds = new Set((existingLocations || []).map((l: { id: string }) => l.id))
    const newLocationIds = new Set(validated.locations.filter((l) => l.id).map((l) => l.id))

    console.log('Existing location IDs:', [...existingLocationIds])
    console.log('New location IDs from form:', [...newLocationIds])

    // Delete locations that are no longer in the list
    const locationsToDelete = [...existingLocationIds].filter((locId) => !newLocationIds.has(locId))
    if (locationsToDelete.length > 0) {
      await supabase
        .from('distributor_locations')
        .delete()
        .in('id', locationsToDelete)
    }

    // Update or insert locations
    console.log('Validated locations:', JSON.stringify(validated.locations, null, 2))
    for (const location of validated.locations) {
      const locationData = {
        label: location.label || null,
        address: location.address || null,
        city: location.city || null,
        state_region: location.state_region || null,
        country: location.country || null,
        location_lat: location.location_lat,
        location_lng: location.location_lng,
        is_primary: location.is_primary,
      }

      if (location.id && existingLocationIds.has(location.id)) {
        // Update existing location
        console.log(`Updating location ${location.id} with lat/lng:`, location.location_lat, location.location_lng)

        const { data: updatedLoc, error: updateLocError, count } = await supabase
          .from('distributor_locations')
          .update(locationData)
          .eq('id', location.id)
          .select()

        console.log(`Update result - count: ${count}, data:`, updatedLoc, 'error:', updateLocError)

        if (updateLocError) {
          console.error(`Failed to update location ${location.id}:`, updateLocError)
        }
      } else {
        // Insert new location
        console.log(`Inserting new location`)
        const { data: insertedLoc, error: insertLocError } = await supabase
          .from('distributor_locations')
          .insert({
            distributor_id: id,
            ...locationData,
          })
          .select()
          .single()

        if (insertLocError) {
          console.error('Failed to insert location:', insertLocError)
        } else {
          console.log('Inserted location result:', insertedLoc)
        }
      }
    }

    // Log audit event
    await logAuditEvent(session.user.id, 'update', 'distributor', id, {
      before: existing,
      after: distributor,
      countries: validated.country_coverage,
    })

    return NextResponse.json(distributor)
  } catch (error) {
    console.error('Validation error:', error)
    return NextResponse.json({ error: 'Invalid request data' }, { status: 400 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!isAdmin(session.user.role)) {
    return NextResponse.json({ error: 'Forbidden - Admin only' }, { status: 403 })
  }

  const { id } = await params
  const supabase = createServerClient()

  // Get distributor before deleting for audit log
  const { data: existing } = await supabase
    .from('distributors')
    .select('*')
    .eq('id', id)
    .single()

  // Delete distributor (coverage will cascade)
  const { error } = await supabase
    .from('distributors')
    .delete()
    .eq('id', id)

  if (error) {
    return NextResponse.json({ error: 'Failed to delete distributor' }, { status: 500 })
  }

  // Log audit event
  if (existing) {
    await logAuditEvent(session.user.id, 'delete', 'distributor', id, {
      deleted: existing,
    })
  }

  return NextResponse.json({ success: true })
}
