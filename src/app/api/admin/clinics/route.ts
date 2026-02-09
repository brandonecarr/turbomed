import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions, canEdit } from '@/lib/auth'
import { createServerClient } from '@/lib/supabase'
import { clinicSchema } from '@/lib/validators'
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
    .from('clinics')
    .select(`
      *,
      locations:clinic_locations(*)
    `)
    .order('submitted_at', { ascending: false })

  if (status) {
    query = query.eq('status', status)
  }

  if (search) {
    query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%`)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching clinics:', error)
    return NextResponse.json({ error: 'Failed to fetch clinics' }, { status: 500 })
  }

  // Transform the response
  const clinics = data?.map((c) => ({
    ...c,
    locations: c.locations || [],
  }))

  return NextResponse.json(clinics)
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
    const { locations, ...clinicData } = body

    // Validate
    const validated = clinicSchema.parse({
      ...clinicData,
      locations: locations || [],
    })

    // Generate slug
    const baseSlug = slugify(validated.name)
    let slug = baseSlug
    let counter = 1

    // Check for slug uniqueness
    while (true) {
      const { data: existing } = await supabase
        .from('clinics')
        .select('id')
        .eq('slug', slug)
        .single()

      if (!existing) break
      slug = `${baseSlug}-${counter}`
      counter++
    }

    // Create clinic
    const { data: clinic, error: createError } = await supabase
      .from('clinics')
      .insert({
        name: validated.name,
        slug,
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
      .select()
      .single()

    if (createError) {
      console.error('Create error:', createError)
      return NextResponse.json({ error: 'Failed to create clinic' }, { status: 500 })
    }

    // Add locations
    if (validated.locations.length > 0) {
      const locationsData = validated.locations.map((loc) => ({
        clinic_id: clinic.id,
        label: loc.label || null,
        address: loc.address || null,
        city: loc.city || null,
        state_region: loc.state_region || null,
        country: loc.country || null,
        postal_code: loc.postal_code || null,
        location_lat: loc.location_lat,
        location_lng: loc.location_lng,
        is_primary: loc.is_primary,
      }))

      const { error: locationsError } = await supabase
        .from('clinic_locations')
        .insert(locationsData)

      if (locationsError) {
        console.error('Locations error:', locationsError)
      }
    }

    // Log audit event
    await logAuditEvent(session.user.id, 'create', 'clinic', clinic.id, {
      name: clinic.name,
      status: clinic.status,
    })

    return NextResponse.json(clinic, { status: 201 })
  } catch (error: any) {
    console.error('Validation error:', error)
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: 'Validation failed', details: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Invalid request data' }, { status: 400 })
  }
}
