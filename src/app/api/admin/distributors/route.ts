import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions, canEdit } from '@/lib/auth'
import { createServerClient } from '@/lib/supabase'
import { distributorSchema } from '@/lib/validators'
import { slugify } from '@/lib/utils'
import { logAuditEvent } from '@/lib/audit'

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createServerClient()
  const searchParams = request.nextUrl.searchParams
  const status = searchParams.get('status')
  const search = searchParams.get('search')

  let query = supabase
    .from('distributors')
    .select(`
      *,
      countries:distributor_country_coverage(
        country:countries(*)
      )
    `)
    .order('name')

  if (status) {
    query = query.eq('status', status)
  }

  if (search) {
    query = query.ilike('name', `%${search}%`)
  }

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: 'Failed to fetch distributors' }, { status: 500 })
  }

  // Transform the response to flatten countries
  const distributors = (data as any[])?.map((d) => ({
    ...d,
    countries: d.countries?.map((c: any) => c.country).filter(Boolean) || [],
  }))

  return NextResponse.json(distributors)
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!canEdit(session.user.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const supabase = createServerClient()

  try {
    const body = await request.json()
    const { country_coverage, locations, ...distributorData } = body

    // Validate
    const validated = distributorSchema.parse({
      ...distributorData,
      country_coverage: country_coverage || [],
      locations: locations || [],
    })

    // Generate slug
    const baseSlug = slugify(validated.name)
    let slug = baseSlug
    let counter = 1

    // Check for slug uniqueness
    while (true) {
      const { data: existing } = await supabase
        .from('distributors')
        .select('id')
        .eq('slug', slug)
        .single()

      if (!existing) break
      slug = `${baseSlug}-${counter}`
      counter++
    }

    // Create distributor
    const { data: distributor, error: createError } = await supabase
      .from('distributors')
      .insert({
        name: validated.name,
        slug,
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
      .select()
      .single()

    if (createError) {
      console.error('Create error:', createError)
      return NextResponse.json({ error: 'Failed to create distributor' }, { status: 500 })
    }

    // Add country coverage
    if (validated.country_coverage.length > 0) {
      const coverageData = validated.country_coverage.map((iso2: string) => ({
        distributor_id: distributor.id,
        country_iso2: iso2,
      }))

      const { error: coverageError } = await supabase
        .from('distributor_country_coverage')
        .insert(coverageData)

      if (coverageError) {
        console.error('Coverage error:', coverageError)
      }
    }

    // Add locations
    if (validated.locations.length > 0) {
      const locationsData = validated.locations.map((loc) => ({
        distributor_id: distributor.id,
        label: loc.label || null,
        address: loc.address || null,
        city: loc.city || null,
        state_region: loc.state_region || null,
        country: loc.country || null,
        location_lat: loc.location_lat,
        location_lng: loc.location_lng,
        is_primary: loc.is_primary,
      }))

      const { error: locationsError } = await supabase
        .from('distributor_locations')
        .insert(locationsData)

      if (locationsError) {
        console.error('Locations error:', locationsError)
      }
    }

    // Log audit event
    await logAuditEvent(session.user.id, 'create', 'distributor', distributor.id, {
      name: distributor.name,
      countries: validated.country_coverage,
    })

    return NextResponse.json(distributor, { status: 201 })
  } catch (error) {
    console.error('Validation error:', error)
    return NextResponse.json({ error: 'Invalid request data' }, { status: 400 })
  }
}
