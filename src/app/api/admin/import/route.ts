import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions, canEdit } from '@/lib/auth'
import { createServerClient } from '@/lib/supabase'
import { csvDistributorRowSchema } from '@/lib/validators'
import { slugify } from '@/lib/utils'
import { logAuditEvent } from '@/lib/audit'
import Papa from 'papaparse'

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
    const formData = await request.formData()
    const file = formData.get('file') as File
    const mode = formData.get('mode') as string || 'preview' // 'preview' or 'import'

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const csvText = await file.text()

    // Parse CSV
    const parseResult = Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.trim().toLowerCase().replace(/\s+/g, '_'),
    })

    if (parseResult.errors.length > 0) {
      return NextResponse.json(
        { error: 'CSV parsing errors', details: parseResult.errors },
        { status: 400 }
      )
    }

    const rows = parseResult.data as Record<string, string>[]
    const results: {
      row: number
      name: string
      status: 'valid' | 'invalid' | 'imported' | 'updated' | 'error'
      errors?: string[]
      data?: any
    }[] = []

    // Get existing countries for validation
    const { data: countries } = await supabase.from('countries').select('iso2')
    const validCountryCodes = new Set(countries?.map((c) => c.iso2) || [])

    // Process each row
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i]
      const rowNum = i + 2 // Account for header row and 0-index

      try {
        // Parse and validate
        const parsed = {
          name: row.name,
          status: row.status || 'unpublished',
          description: row.description || '',
          website_url: row.website_url || row.website || '',
          email: row.email || '',
          phone: row.phone || '',
          address_line1: row.address_line1 || row.address || '',
          address_line2: row.address_line2 || '',
          city: row.city || '',
          state_region: row.state_region || row.state || '',
          postal_code: row.postal_code || row.zip || '',
          country_hq: row.country_hq || row.country || '',
          location_lat: parseFloat(row.location_lat || row.lat || row.latitude || '0'),
          location_lng: parseFloat(row.location_lng || row.lng || row.longitude || '0'),
          regions_served: row.regions_served || '',
          languages_supported: row.languages_supported || row.languages || '',
          products_supported: row.products_supported || row.products || '',
          service_types: row.service_types || row.services || '',
          priority_rank: parseInt(row.priority_rank || '100', 10),
          countries: row.countries || row.countries_serviced || '',
        }

        // Validate using schema
        const validated = csvDistributorRowSchema.parse(parsed)

        // Parse array fields
        const parseArrayField = (value: string | undefined): string[] => {
          if (!value) return []
          return value.split(',').map((s) => s.trim()).filter(Boolean)
        }

        const countryCodes = parseArrayField(validated.countries).map((c) => c.toUpperCase())

        // Validate country codes
        const invalidCountries = countryCodes.filter((c) => !validCountryCodes.has(c))
        if (invalidCountries.length > 0) {
          results.push({
            row: rowNum,
            name: validated.name,
            status: 'invalid',
            errors: [`Invalid country codes: ${invalidCountries.join(', ')}`],
          })
          continue
        }

        const processedData = {
          name: validated.name,
          status: validated.status,
          description: validated.description || null,
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
          regions_served: parseArrayField(validated.regions_served),
          languages_supported: parseArrayField(validated.languages_supported),
          products_supported: parseArrayField(validated.products_supported),
          service_types: parseArrayField(validated.service_types),
          priority_rank: validated.priority_rank || 100,
          country_coverage: countryCodes,
        }

        if (mode === 'preview') {
          results.push({
            row: rowNum,
            name: validated.name,
            status: 'valid',
            data: processedData,
          })
        } else {
          // Import mode - actually insert/update the data
          const slug = slugify(validated.name) + '-' + Date.now()

          // Insert distributor
          const { data: distributor, error: insertError } = await supabase
            .from('distributors')
            .insert({
              name: processedData.name,
              slug,
              status: processedData.status as any,
              description: processedData.description,
              website_url: processedData.website_url,
              email: processedData.email,
              phone: processedData.phone,
              address_line1: processedData.address_line1,
              address_line2: processedData.address_line2,
              city: processedData.city,
              state_region: processedData.state_region,
              postal_code: processedData.postal_code,
              country_hq: processedData.country_hq,
              location_lat: processedData.location_lat,
              location_lng: processedData.location_lng,
              regions_served: processedData.regions_served,
              languages_supported: processedData.languages_supported,
              products_supported: processedData.products_supported,
              service_types: processedData.service_types,
              priority_rank: processedData.priority_rank,
            } as any)
            .select()
            .single()

          if (insertError) {
            results.push({
              row: rowNum,
              name: validated.name,
              status: 'error',
              errors: [insertError.message],
            })
            continue
          }

          // Add country coverage
          if (processedData.country_coverage.length > 0) {
            await supabase.from('distributor_country_coverage').insert(
              processedData.country_coverage.map((iso2) => ({
                distributor_id: (distributor as any).id,
                country_iso2: iso2,
              })) as any
            )
          }

          results.push({
            row: rowNum,
            name: validated.name,
            status: 'imported',
            data: { id: (distributor as any).id },
          })
        }
      } catch (error: any) {
        results.push({
          row: rowNum,
          name: row.name || `Row ${rowNum}`,
          status: 'invalid',
          errors: [error.message || 'Validation failed'],
        })
      }
    }

    // Log audit event if importing
    if (mode === 'import') {
      const importedCount = results.filter((r) => r.status === 'imported').length
      await logAuditEvent(session.user.id, 'import', 'distributor', null, {
        totalRows: rows.length,
        imported: importedCount,
        errors: results.filter((r) => r.status !== 'imported').length,
      })
    }

    return NextResponse.json({
      mode,
      totalRows: rows.length,
      valid: results.filter((r) => r.status === 'valid' || r.status === 'imported').length,
      invalid: results.filter((r) => r.status === 'invalid' || r.status === 'error').length,
      results,
    })
  } catch (error) {
    console.error('Import error:', error)
    return NextResponse.json({ error: 'Import failed' }, { status: 500 })
  }
}
