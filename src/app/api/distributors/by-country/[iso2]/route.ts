import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ iso2: string }> }
) {
  const { iso2 } = await params

  // Get distributor IDs that cover this country
  const { data: coverageData, error: coverageError } = await supabase
    .from('distributor_country_coverage')
    .select('distributor_id')
    .eq('country_iso2', iso2.toUpperCase())

  if (coverageError) {
    console.error('Error fetching coverage:', coverageError)
    return NextResponse.json({ error: 'Failed to fetch distributors' }, { status: 500 })
  }

  if (!coverageData || coverageData.length === 0) {
    return NextResponse.json([])
  }

  const distributorIds = coverageData.map((c) => c.distributor_id)

  // Fetch the distributors (only published)
  const { data, error } = await supabase
    .from('distributors')
    .select(`
      *,
      countries:distributor_country_coverage(
        country:countries(*)
      )
    `)
    .in('id', distributorIds)
    .eq('status', 'published')
    .order('priority_rank', { ascending: true })
    .order('name', { ascending: true })

  if (error) {
    console.error('Error fetching distributors:', error)
    return NextResponse.json({ error: 'Failed to fetch distributors' }, { status: 500 })
  }

  // Transform the response
  const distributors = (data as any[])?.map((d) => ({
    ...d,
    countries: d.countries?.map((c: any) => c.country).filter(Boolean) || [],
  }))

  return NextResponse.json(distributors)
}
