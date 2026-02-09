import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { createServerClient } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createServerClient()
  const searchParams = request.nextUrl.searchParams
  const search = searchParams.get('search')
  const hasCoverage = searchParams.get('hasCoverage')

  // Get all countries with their distributor coverage
  let query = supabase
    .from('countries')
    .select(`
      *,
      distributors:distributor_country_coverage(
        distributor:distributors(id, name, status)
      )
    `)
    .order('name')

  if (search) {
    query = query.or(`name.ilike.%${search}%,iso2.ilike.%${search}%`)
  }

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: 'Failed to fetch countries' }, { status: 500 })
  }

  // Transform response
  let countries = (data as any[])?.map((c) => ({
    ...c,
    distributors: c.distributors?.map((d: any) => d.distributor).filter(Boolean) || [],
  }))

  // Filter by coverage if requested
  if (hasCoverage === 'true') {
    countries = countries?.filter((c) => c.distributors.length > 0)
  } else if (hasCoverage === 'false') {
    countries = countries?.filter((c) => c.distributors.length === 0)
  }

  return NextResponse.json(countries)
}
