import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions, canEdit } from '@/lib/auth'
import { createServerClient } from '@/lib/supabase'
import { kbFaqSchema } from '@/lib/validators'
import { logAuditEvent } from '@/lib/audit'

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('kb_faqs')
    .select('*, category:kb_categories(*)')
    .eq('id', params.id)
    .single()

  if (error) {
    return NextResponse.json({ error: 'FAQ not found' }, { status: 404 })
  }

  return NextResponse.json(data)
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  if (!canEdit(session.user.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const supabase = createServerClient()

  try {
    const body = await request.json()
    const validated = kbFaqSchema.parse(body)

    const { data: faq, error: updateError } = await supabase
      .from('kb_faqs')
      .update({
        question: validated.question,
        answer: validated.answer,
        category_id: validated.category_id || null,
        status: validated.status,
        sort_order: validated.sort_order,
      })
      .eq('id', params.id)
      .select('*, category:kb_categories(*)')
      .single()

    if (updateError) {
      return NextResponse.json({ error: 'Failed to update FAQ' }, { status: 500 })
    }

    await logAuditEvent(session.user.id, 'update', 'kb_faq', params.id, {
      question: faq.question,
    })

    return NextResponse.json(faq)
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request data' }, { status: 400 })
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  if (!canEdit(session.user.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const supabase = createServerClient()

  const { data: faq } = await supabase
    .from('kb_faqs')
    .select('question')
    .eq('id', params.id)
    .single()

  const { error } = await supabase
    .from('kb_faqs')
    .delete()
    .eq('id', params.id)

  if (error) {
    return NextResponse.json({ error: 'Failed to delete FAQ' }, { status: 500 })
  }

  await logAuditEvent(session.user.id, 'delete', 'kb_faq', params.id, {
    question: faq?.question,
  })

  return NextResponse.json({ success: true })
}
