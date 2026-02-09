import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions, canEdit } from '@/lib/auth'
import { createServerClient } from '@/lib/supabase'
import { logAuditEvent } from '@/lib/audit'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!canEdit(session.user.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { id } = await params
  const supabase = createServerClient()

  try {
    const { publish } = await request.json()
    const newStatus = publish ? 'published' : 'unpublished'

    // Get current status for audit log
    const { data: existing } = await supabase
      .from('distributors')
      .select('status, name')
      .eq('id', id)
      .single()

    if (!existing) {
      return NextResponse.json({ error: 'Distributor not found' }, { status: 404 })
    }

    // Update status
    const { data, error } = await supabase
      .from('distributors')
      .update({ status: newStatus } as any)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: 'Failed to update status' }, { status: 500 })
    }

    // Log audit event
    await logAuditEvent(
      session.user.id,
      publish ? 'publish' : 'unpublish',
      'distributor',
      id,
      {
        name: existing.name,
        previousStatus: existing.status,
        newStatus,
      }
    )

    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
