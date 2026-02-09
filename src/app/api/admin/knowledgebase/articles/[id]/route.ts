import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions, canEdit } from '@/lib/auth'
import { createServerClient } from '@/lib/supabase'
import { kbArticleSchema } from '@/lib/validators'
import { slugify } from '@/lib/utils'
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
    .from('kb_articles')
    .select('*, category:kb_categories(*)')
    .eq('id', params.id)
    .single()

  if (error) {
    return NextResponse.json({ error: 'Article not found' }, { status: 404 })
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
    const validated = kbArticleSchema.parse(body)

    // Get current article to check status change
    const { data: current } = await supabase
      .from('kb_articles')
      .select('status')
      .eq('id', params.id)
      .single()

    const baseSlug = slugify(validated.title)
    let slug = baseSlug
    let counter = 1
    while (true) {
      const { data: existing } = await supabase
        .from('kb_articles')
        .select('id')
        .eq('slug', slug)
        .neq('id', params.id)
        .single()
      if (!existing) break
      slug = `${baseSlug}-${counter}`
      counter++
    }

    const publishedAt =
      validated.status === 'published' && current?.status !== 'published'
        ? new Date().toISOString()
        : undefined

    const { data: article, error: updateError } = await supabase
      .from('kb_articles')
      .update({
        title: validated.title,
        slug,
        category_id: validated.category_id || null,
        content_type: validated.content_type,
        content: validated.content,
        excerpt: validated.excerpt || null,
        featured_image_url: validated.featured_image_url || null,
        status: validated.status,
        tags: validated.tags,
        meta_title: validated.meta_title || null,
        meta_description: validated.meta_description || null,
        sort_order: validated.sort_order,
        ...(publishedAt && { published_at: publishedAt }),
      })
      .eq('id', params.id)
      .select('*, category:kb_categories(*)')
      .single()

    if (updateError) {
      return NextResponse.json({ error: 'Failed to update article' }, { status: 500 })
    }

    await logAuditEvent(session.user.id, 'update', 'kb_article', params.id, {
      title: article.title,
    })

    return NextResponse.json(article)
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

  const { data: article } = await supabase
    .from('kb_articles')
    .select('title')
    .eq('id', params.id)
    .single()

  const { error } = await supabase
    .from('kb_articles')
    .delete()
    .eq('id', params.id)

  if (error) {
    return NextResponse.json({ error: 'Failed to delete article' }, { status: 500 })
  }

  await logAuditEvent(session.user.id, 'delete', 'kb_article', params.id, {
    title: article?.title,
  })

  return NextResponse.json({ success: true })
}
