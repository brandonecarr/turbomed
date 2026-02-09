import { createServerClient } from './supabase'

export type AuditAction =
  | 'create'
  | 'update'
  | 'delete'
  | 'publish'
  | 'unpublish'
  | 'import'
  | 'export'
  | 'approve'
  | 'reject'

export type EntityType = 'distributor' | 'country' | 'admin_user' | 'clinic' | 'kb_article' | 'kb_faq' | 'kb_category'

export async function logAuditEvent(
  userId: string | null,
  action: AuditAction,
  entityType: EntityType,
  entityId: string | null,
  changes?: Record<string, unknown>
) {
  const supabase = createServerClient()

  const { error } = await supabase.from('audit_log').insert({
    user_id: userId,
    action,
    entity_type: entityType,
    entity_id: entityId,
    changes: changes || null,
  })

  if (error) {
    console.error('Failed to log audit event:', error)
  }
}
