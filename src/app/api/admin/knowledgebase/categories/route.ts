import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions, canEdit } from '@/lib/auth'
import { createServerClient } from '@/lib/supabase'
import { kbCategorySchema } from '@/lib/validators'
import { slugify } from '@/lib/utils'
import { logAuditEvent } from '@/lib/audit'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('kb_categories')
    .select('*')
    .order('sort_order')
    .order('name')

  if (error) {
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 })
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
    const validated = kbCategorySchema.parse(body)

    const baseSlug = slugify(validated.name)
    let slug = baseSlug
    let counter = 1
    while (true) {
      const { data: existing } = await supabase
        .from('kb_categories')
        .select('id')
        .eq('slug', slug)
        .single()
      if (!existing) break
      slug = `${baseSlug}-${counter}`
      counter++
    }

    const { data: category, error: createError } = await supabase
      .from('kb_categories')
      .insert({
        name: validated.name,
        slug,
        description: validated.description || null,
        icon: validated.icon || null,
        sort_order: validated.sort_order,
      })
      .select()
      .single()

    if (createError) {
      return NextResponse.json({ error: 'Failed to create category' }, { status: 500 })
    }

    await logAuditEvent(session.user.id, 'create', 'kb_category', category.id, {
      name: category.name,
    })

    return NextResponse.json(category, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request data' }, { status: 400 })
  }
}
