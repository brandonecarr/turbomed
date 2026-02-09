import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions, canEdit } from '@/lib/auth'
import { createServerClient } from '@/lib/supabase'
import { kbArticleSchema } from '@/lib/validators'
import { slugify } from '@/lib/utils'
import { logAuditEvent } from '@/lib/audit'

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createServerClient()
  const searchParams = request.nextUrl.searchParams
  const status = searchParams.get('status')
  const contentType = searchParams.get('content_type')
  const categoryId = searchParams.get('category_id')
  const search = searchParams.get('search')

  let query = supabase
    .from('kb_articles')
    .select('*, category:kb_categories(*)')
    .order('sort_order')
    .order('created_at', { ascending: false })

  if (status) query = query.eq('status', status)
  if (contentType) query = query.eq('content_type', contentType)
  if (categoryId) query = query.eq('category_id', categoryId)
  if (search) query = query.ilike('title', `%${search}%`)

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: 'Failed to fetch articles' }, { status: 500 })
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
    const validated = kbArticleSchema.parse(body)

    const baseSlug = slugify(validated.title)
    let slug = baseSlug
    let counter = 1
    while (true) {
      const { data: existing } = await supabase
        .from('kb_articles')
        .select('id')
        .eq('slug', slug)
        .single()
      if (!existing) break
      slug = `${baseSlug}-${counter}`
      counter++
    }

    const { data: article, error: createError } = await supabase
      .from('kb_articles')
      .insert({
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
        author_id: session.user.id,
        published_at: validated.status === 'published' ? new Date().toISOString() : null,
      })
      .select('*, category:kb_categories(*)')
      .single()

    if (createError) {
      console.error('Create error:', createError)
      return NextResponse.json({ error: 'Failed to create article' }, { status: 500 })
    }

    await logAuditEvent(session.user.id, 'create', 'kb_article', article.id, {
      title: article.title,
      content_type: article.content_type,
    })

    return NextResponse.json(article, { status: 201 })
  } catch (error) {
    console.error('Validation error:', error)
    return NextResponse.json({ error: 'Invalid request data' }, { status: 400 })
  }
}
