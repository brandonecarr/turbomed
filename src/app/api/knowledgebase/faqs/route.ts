import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  const supabase = createServerClient()
  const categorySlug = request.nextUrl.searchParams.get('category')

  let query = supabase
    .from('kb_faqs')
    .select('*, category:kb_categories(id, name, slug, icon)')
    .eq('status', 'published')
    .order('sort_order')
    .order('created_at', { ascending: false })

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

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: 'Failed to fetch FAQs' }, { status: 500 })
  }

  return NextResponse.json(data)
}
