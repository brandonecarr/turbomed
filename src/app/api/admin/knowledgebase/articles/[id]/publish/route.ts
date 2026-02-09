import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions, canEdit } from '@/lib/auth'
import { createServerClient } from '@/lib/supabase'
import { logAuditEvent } from '@/lib/audit'

export async function POST(
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
    const { publish } = await request.json()
    const status = publish ? 'published' : 'draft'

    const updateData: Record<string, unknown> = { status }
    if (publish) {
      updateData.published_at = new Date().toISOString()
    }

    const { data: article, error } = await supabase
      .from('kb_articles')
      .update(updateData)
      .eq('id', params.id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: 'Failed to update status' }, { status: 500 })
    }

    await logAuditEvent(
      session.user.id,
      publish ? 'publish' : 'unpublish',
      'kb_article',
      params.id,
      { title: article.title }
    )

    return NextResponse.json(article)
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
