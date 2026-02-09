import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions, canEdit, isAdmin } from '@/lib/auth'
import { createServerClient } from '@/lib/supabase'
import { clinicSchema } from '@/lib/validators'
import { logAuditEvent } from '@/lib/audit'

// GET: Fetch single clinic (admin)
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
    .from('clinics')
    .select(`
      *,
      locations:clinic_locations(*)
    `)
    .eq('id', id)
    .single()

  if (error || !data) {
    return NextResponse.json({ error: 'Clinic not found' }, { status: 404 })
  }

  return NextResponse.json({
    ...data,
    locations: data.locations || [],
  })
}

// PUT: Update clinic (admin)
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
    const { locations, ...clinicData } = body

    // Validate
    const validated = clinicSchema.parse({
      ...clinicData,
      locations: locations || [],
    })

    // Get existing clinic for audit
    const { data: existingClinic } = await supabase
      .from('clinics')
      .select('*')
      .eq('id', id)
      .single()

    if (!existingClinic) {
      return NextResponse.json({ error: 'Clinic not found' }, { status: 404 })
    }

    // Update clinic
    const { data: clinic, error: updateError } = await supabase
      .from('clinics')
      .update({
        name: validated.name,
        status: validated.status,
        email: validated.email,
        phone: validated.phone || null,
        website_url: validated.website_url || null,
        address_line1: validated.address_line1 || null,
        city: validated.city || null,
        state_region: validated.state_region || null,
        postal_code: validated.postal_code || null,
        country: validated.country || null,
        location_lat: validated.location_lat || null,
        location_lng: validated.location_lng || null,
        rejection_reason: validated.rejection_reason || null,
      })
      .eq('id', id)
      .select()
      .single()

    if (updateError) {
      console.error('Update error:', updateError)
      return NextResponse.json({ error: 'Failed to update clinic' }, { status: 500 })
    }

    // Handle locations update
    if (validated.locations) {
      // Get existing locations
      const { data: existingLocations } = await supabase
        .from('clinic_locations')
        .select('id')
        .eq('clinic_id', id)

      const existingIds = new Set(existingLocations?.map((l) => l.id) || [])
      const newIds = new Set(validated.locations.filter((l) => l.id).map((l) => l.id))

      // Delete locations that are no longer in the list
      const toDelete = Array.from(existingIds).filter((locId) => !newIds.has(locId))
      if (toDelete.length > 0) {
        await supabase
          .from('clinic_locations')
          .delete()
          .in('id', toDelete)
      }

      // Upsert locations
      for (const loc of validated.locations) {
        if (loc.id && existingIds.has(loc.id)) {
          // Update existing location
          await supabase
            .from('clinic_locations')
            .update({
              label: loc.label || null,
              address: loc.address || null,
              city: loc.city || null,
              state_region: loc.state_region || null,
              country: loc.country || null,
              postal_code: loc.postal_code || null,
              location_lat: loc.location_lat,
              location_lng: loc.location_lng,
              is_primary: loc.is_primary,
            })
            .eq('id', loc.id)
        } else {
          // Insert new location
          await supabase
            .from('clinic_locations')
            .insert({
              clinic_id: id,
              label: loc.label || null,
              address: loc.address || null,
              city: loc.city || null,
              state_region: loc.state_region || null,
              country: loc.country || null,
              postal_code: loc.postal_code || null,
              location_lat: loc.location_lat,
              location_lng: loc.location_lng,
              is_primary: loc.is_primary,
            })
        }
      }
    }

    // Log audit event
    await logAuditEvent(session.user.id, 'update', 'clinic', id, {
      before: existingClinic,
      after: clinic,
    })

    // Fetch updated clinic with locations
    const { data: updatedClinic } = await supabase
      .from('clinics')
      .select(`
        *,
        locations:clinic_locations(*)
      `)
      .eq('id', id)
      .single()

    return NextResponse.json({
      ...updatedClinic,
      locations: updatedClinic?.locations || [],
    })
  } catch (error: any) {
    console.error('Validation error:', error)
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: 'Validation failed', details: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Invalid request data' }, { status: 400 })
  }
}

// DELETE: Delete clinic (admin only)
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

  // Get clinic for audit
  const { data: clinic } = await supabase
    .from('clinics')
    .select('*')
    .eq('id', id)
    .single()

  if (!clinic) {
    return NextResponse.json({ error: 'Clinic not found' }, { status: 404 })
  }

  // Delete clinic (cascade will delete locations)
  const { error: deleteError } = await supabase
    .from('clinics')
    .delete()
    .eq('id', id)

  if (deleteError) {
    console.error('Delete error:', deleteError)
    return NextResponse.json({ error: 'Failed to delete clinic' }, { status: 500 })
  }

  // Log audit event
  await logAuditEvent(session.user.id, 'delete', 'clinic', id, {
    deleted: clinic,
  })

  return NextResponse.json({ success: true })
}
