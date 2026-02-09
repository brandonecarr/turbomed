import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

// Disable caching to always get fresh data
export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  // Fetch only published distributors for public API
  // First try with locations, fall back to without if table doesn't exist
  let data: any[] | null = null
  let error: any = null

  // Use service role client to bypass RLS (data is filtered by status anyway)
  const supabase = createServerClient()

  // Try to fetch with locations
  const result = await supabase
    .from('distributors')
    .select(`
      *,
      countries:distributor_country_coverage(
        country:countries(*)
      ),
      locations:distributor_locations(*)
    `)
    .eq('status', 'published')
    .order('priority_rank', { ascending: true })
    .order('name', { ascending: true })

  data = result.data
  error = result.error

  // If locations table doesn't exist, try without it
  if (error && error.message?.includes('distributor_locations')) {
    console.log('distributor_locations table not found, fetching without locations')
    const fallbackResult = await supabase
      .from('distributors')
      .select(`
        *,
        countries:distributor_country_coverage(
          country:countries(*)
        )
      `)
      .eq('status', 'published')
      .order('priority_rank', { ascending: true })
      .order('name', { ascending: true })

    data = fallbackResult.data
    error = fallbackResult.error
  }

  if (error) {
    console.error('Error fetching distributors:', error)
    return NextResponse.json({ error: 'Failed to fetch distributors' }, { status: 500 })
  }

  // Transform the response to flatten countries
  const distributors = (data as any[])?.map((d) => ({
    ...d,
    countries: d.countries?.map((c: any) => c.country).filter(Boolean) || [],
    locations: d.locations || [],
  }))

  return NextResponse.json(distributors)
}
