import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

export async function GET(
  _request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from('kb_articles')
    .select('*, category:kb_categories(id, name, slug, icon)')
    .eq('slug', params.slug)
    .eq('status', 'published')
    .single()

  if (error || !data) {
    return NextResponse.json({ error: 'Article not found' }, { status: 404 })
  }

  return NextResponse.json(data)
}
