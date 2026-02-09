import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  const supabase = createServerClient()
  const searchParams = request.nextUrl.searchParams
  const contentType = searchParams.get('content_type')
  const categorySlug = searchParams.get('category')
  const search = searchParams.get('search')
  const tag = searchParams.get('tag')

  let query = supabase
    .from('kb_articles')
    .select('id, title, slug, content_type, excerpt, featured_image_url, tags, published_at, category:kb_categories(id, name, slug, icon)')
    .eq('status', 'published')
    .order('sort_order')
    .order('published_at', { ascending: false })

  if (contentType) query = query.eq('content_type', contentType)
  if (tag) query = query.contains('tags', [tag])

  if (categorySlug) {
    const { data: cat } = await supabase
      .from('kb_categories')
      .select('id')
      .eq('slug', categorySlug)
      .single()
    if (cat) {
      query = query.eq('category_id', cat.id)
    }
  }

  if (search) {
    query = query.or(`title.ilike.%${search}%,excerpt.ilike.%${search}%`)
  }

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: 'Failed to fetch articles' }, { status: 500 })
  }

  return NextResponse.json(data)
}
