import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { clinicSignupSchema } from '@/lib/validators'

// Disable caching to always get fresh data
export const dynamic = 'force-dynamic'
export const revalidate = 0

// GET: Fetch all approved clinics (public)
export async function GET() {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from('clinics')
    .select(`
      *,
      locations:clinic_locations(*)
    `)
    .eq('status', 'approved')
    .order('name', { ascending: true })

  if (error) {
    console.error('Error fetching clinics:', error)
    return NextResponse.json({ error: 'Failed to fetch clinics' }, { status: 500 })
  }

  // Transform response
  const clinics = data?.map((c) => ({
    ...c,
    locations: c.locations || [],
  }))

  return NextResponse.json(clinics)
}

// POST: Submit new clinic (public signup)
export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate with signup schema
    const validatedData = clinicSignupSchema.parse(body)

    // Generate slug from name
    const baseSlug = validatedData.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')

    // Use server client for public submissions (service role bypasses RLS)
    // This is safe because we validate the data and always set status to 'pending'
    const supabase = createServerClient()

    // Check for existing slug and make unique
    const { data: existingSlugs } = await supabase
      .from('clinics')
      .select('slug')
      .ilike('slug', `${baseSlug}%`)

    let slug = baseSlug
    if (existingSlugs && existingSlugs.length > 0) {
      const existingSet = new Set(existingSlugs.map((s) => s.slug))
      let counter = 1
      while (existingSet.has(slug)) {
        slug = `${baseSlug}-${counter}`
        counter++
      }
    }

    // Create clinic with pending status
    const { data: clinic, error: clinicError } = await supabase
      .from('clinics')
      .insert({
        name: validatedData.name,
        slug,
        status: 'pending',
        email: validatedData.email,
        phone: validatedData.phone,
        website_url: validatedData.website_url || null,
      })
      .select()
      .single()

    if (clinicError) {
      console.error('Error creating clinic:', clinicError)
      return NextResponse.json({ error: 'Failed to submit clinic' }, { status: 500 })
    }

    // Insert locations
    if (validatedData.locations && validatedData.locations.length > 0) {
      const locationsToInsert = validatedData.locations.map((loc) => ({
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
        .insert(locationsToInsert)

      if (locationsError) {
        console.error('Error creating clinic locations:', locationsError)
        // Don't fail the whole request, clinic was created
      }
    }

    return NextResponse.json({
      message: 'Clinic submitted successfully. Your submission is pending review.',
      clinic: { id: clinic.id, name: clinic.name },
    }, { status: 201 })

  } catch (error: any) {
    console.error('Error submitting clinic:', error)
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: 'Validation failed', details: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Failed to submit clinic' }, { status: 500 })
  }
}
