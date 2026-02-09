import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions, canEdit } from '@/lib/auth'
import { createServerClient } from '@/lib/supabase'
import { kbCategorySchema } from '@/lib/validators'
import { slugify } from '@/lib/utils'
import { logAuditEvent } from '@/lib/audit'

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
    const validated = kbCategorySchema.parse(body)

    const baseSlug = slugify(validated.name)
    let slug = baseSlug
    let counter = 1
    while (true) {
      const { data: existing } = await supabase
        .from('kb_categories')
        .select('id')
        .eq('slug', slug)
        .neq('id', params.id)
        .single()
      if (!existing) break
      slug = `${baseSlug}-${counter}`
      counter++
    }

    const { data: category, error: updateError } = await supabase
      .from('kb_categories')
      .update({
        name: validated.name,
        slug,
        description: validated.description || null,
        icon: validated.icon || null,
        sort_order: validated.sort_order,
      })
      .eq('id', params.id)
      .select()
      .single()

    if (updateError) {
      return NextResponse.json({ error: 'Failed to update category' }, { status: 500 })
    }

    await logAuditEvent(session.user.id, 'update', 'kb_category', params.id, {
      name: category.name,
    })

    return NextResponse.json(category)
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

  const { data: category } = await supabase
    .from('kb_categories')
    .select('name')
    .eq('id', params.id)
    .single()

  const { error } = await supabase
    .from('kb_categories')
    .delete()
    .eq('id', params.id)

  if (error) {
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 })
  }

  await logAuditEvent(session.user.id, 'delete', 'kb_category', params.id, {
    name: category?.name,
  })

  return NextResponse.json({ success: true })
}
