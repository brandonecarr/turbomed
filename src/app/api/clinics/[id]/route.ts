import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

// GET: Fetch single approved clinic (public)
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from('clinics')
    .select(`
      *,
      locations:clinic_locations(*)
    `)
    .eq('id', id)
    .eq('status', 'approved')
    .single()

  if (error || !data) {
    return NextResponse.json({ error: 'Clinic not found' }, { status: 404 })
  }

  return NextResponse.json({
    ...data,
    locations: data.locations || [],
  })
}
