import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions, canEdit } from '@/lib/auth'
import { createServerClient } from '@/lib/supabase'
import { kbFaqSchema } from '@/lib/validators'
import { logAuditEvent } from '@/lib/audit'

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createServerClient()
  const searchParams = request.nextUrl.searchParams
  const status = searchParams.get('status')
  const categoryId = searchParams.get('category_id')

  let query = supabase
    .from('kb_faqs')
    .select('*, category:kb_categories(*)')
    .order('sort_order')
    .order('created_at', { ascending: false })

  if (status) query = query.eq('status', status)
  if (categoryId) query = query.eq('category_id', categoryId)

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: 'Failed to fetch FAQs' }, { status: 500 })
  }

  return NextResponse.json(data)
}

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
    const body = await request.json()
    const validated = kbFaqSchema.parse(body)

    const { data: faq, error: createError } = await supabase
      .from('kb_faqs')
      .insert({
        question: validated.question,
        answer: validated.answer,
        category_id: validated.category_id || null,
        status: validated.status,
        sort_order: validated.sort_order,
      })
      .select('*, category:kb_categories(*)')
      .single()

    if (createError) {
      return NextResponse.json({ error: 'Failed to create FAQ' }, { status: 500 })
    }

    await logAuditEvent(session.user.id, 'create', 'kb_faq', faq.id, {
      question: faq.question,
    })

    return NextResponse.json(faq, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request data' }, { status: 400 })
  }
}
