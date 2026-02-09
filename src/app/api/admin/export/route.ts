import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { createServerClient } from '@/lib/supabase'
import { logAuditEvent } from '@/lib/audit'
import Papa from 'papaparse'

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createServerClient()

  // Fetch all distributors with coverage
  const { data: distributors, error } = await supabase
    .from('distributors')
    .select(`
      *,
      countries:distributor_country_coverage(
        country:countries(iso2, name)
      )
    `)
    .order('name')

  if (error) {
    return NextResponse.json({ error: 'Failed to fetch distributors' }, { status: 500 })
  }

  // Transform data for CSV export
  const csvData = (distributors as any[]).map((d) => ({
    name: d.name,
    status: d.status,
    description: d.description || '',
    website_url: d.website_url || '',
    email: d.email || '',
    phone: d.phone || '',
    address_line1: d.address_line1 || '',
    address_line2: d.address_line2 || '',
    city: d.city || '',
    state_region: d.state_region || '',
    postal_code: d.postal_code || '',
    country_hq: d.country_hq || '',
    location_lat: d.location_lat,
    location_lng: d.location_lng,
    regions_served: d.regions_served?.join(', ') || '',
    languages_supported: d.languages_supported?.join(', ') || '',
    products_supported: d.products_supported?.join(', ') || '',
    service_types: d.service_types?.join(', ') || '',
    priority_rank: d.priority_rank,
    countries: d.countries
      ?.map((c: any) => c.country?.iso2)
      .filter(Boolean)
      .join(', ') || '',
  }))

  // Generate CSV
  const csv = Papa.unparse(csvData)

  // Log audit event
  await logAuditEvent(session.user.id, 'export', 'distributor', null, {
    count: distributors.length,
  })

  // Return as downloadable file
  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="distributors-${new Date().toISOString().split('T')[0]}.csv"`,
    },
  })
}
