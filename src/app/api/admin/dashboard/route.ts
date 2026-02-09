import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { createServerClient } from '@/lib/supabase'

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createServerClient()

  // Get distributor stats
  const { data: distributors, error: distributorsError } = await supabase
    .from('distributors')
    .select('id, status')

  if (distributorsError) {
    return NextResponse.json({ error: 'Failed to fetch distributors' }, { status: 500 })
  }

  // Get country stats
  const { count: totalCountries, error: countriesError } = await supabase
    .from('countries')
    .select('*', { count: 'exact', head: true })

  if (countriesError) {
    return NextResponse.json({ error: 'Failed to fetch countries' }, { status: 500 })
  }

  // Get covered countries count
  const { data: coveredCountries, error: coverageError } = await supabase
    .from('distributor_country_coverage')
    .select('country_iso2')

  if (coverageError) {
    return NextResponse.json({ error: 'Failed to fetch coverage' }, { status: 500 })
  }

  const uniqueCountriesCovered = new Set((coveredCountries as any[])?.map((c) => c.country_iso2)).size

  // Get clinic stats
  const { data: clinics, error: clinicsError } = await supabase
    .from('clinics')
    .select('id, status')

  if (clinicsError) {
    return NextResponse.json({ error: 'Failed to fetch clinics' }, { status: 500 })
  }

  const stats = {
    totalDistributors: (distributors as any[])?.length || 0,
    publishedDistributors: (distributors as any[])?.filter((d) => d.status === 'published').length || 0,
    unpublishedDistributors: (distributors as any[])?.filter((d) => d.status === 'unpublished').length || 0,
    totalCountriesCovered: uniqueCountriesCovered,
    totalCountries: totalCountries || 0,
    // Clinic stats
    totalClinics: (clinics as any[])?.length || 0,
    approvedClinics: (clinics as any[])?.filter((c) => c.status === 'approved').length || 0,
    pendingClinics: (clinics as any[])?.filter((c) => c.status === 'pending').length || 0,
    rejectedClinics: (clinics as any[])?.filter((c) => c.status === 'rejected').length || 0,
  }

  return NextResponse.json(stats)
}
