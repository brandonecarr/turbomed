import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions, canEdit } from '@/lib/auth'
import { createServerClient } from '@/lib/supabase'
import { countrySchema } from '@/lib/validators'
import { logAuditEvent } from '@/lib/audit'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ iso2: string }> }
) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!canEdit(session.user.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { iso2 } = await params
  const supabase = createServerClient()

  try {
    const body = await request.json()

    // Get existing country
    const { data: existing, error: fetchError } = await supabase
      .from('countries')
      .select('*')
      .eq('iso2', iso2.toUpperCase())
      .single()

    if (fetchError || !existing) {
      return NextResponse.json({ error: 'Country not found' }, { status: 404 })
    }

    // Validate (partial update)
    const updateData: Record<string, unknown> = {}
    if (body.name) updateData.name = body.name
    if (body.region !== undefined) updateData.region = body.region
    if (body.synonyms !== undefined) updateData.synonyms = body.synonyms

    // Update country
    const { data, error } = await supabase
      .from('countries')
      .update(updateData as any)
      .eq('iso2', iso2.toUpperCase())
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: 'Failed to update country' }, { status: 500 })
    }

    // Log audit event
    await logAuditEvent(session.user.id, 'update', 'country', iso2, {
      before: existing,
      after: data,
    })

    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: 'Invalid request data' }, { status: 400 })
  }
}
