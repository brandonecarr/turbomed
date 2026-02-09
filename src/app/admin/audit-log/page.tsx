'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import { ScrollText, User, Clock, ChevronLeft, ChevronRight } from 'lucide-react'
import type { AuditLogEntry } from '@/types'

interface AuditLogResponse {
  entries: (AuditLogEntry & { user: { id: string; email: string; name: string | null } | null })[]
  total: number
  limit: number
  offset: number
}

async function fetchAuditLog(params: {
  limit: number
  offset: number
  entityType?: string
  action?: string
}): Promise<AuditLogResponse> {
  const searchParams = new URLSearchParams()
  searchParams.set('limit', params.limit.toString())
  searchParams.set('offset', params.offset.toString())
  if (params.entityType) searchParams.set('entityType', params.entityType)
  if (params.action) searchParams.set('action', params.action)

  const response = await fetch(`/api/admin/audit-log?${searchParams}`)
  if (!response.ok) throw new Error('Failed to fetch audit log')
  return response.json()
}

const actionColors: Record<string, 'success' | 'warning' | 'danger' | 'info' | 'default'> = {
  create: 'success',
  update: 'info',
  delete: 'danger',
  publish: 'success',
  unpublish: 'warning',
  import: 'info',
  export: 'default',
}

export default function AuditLogPage() {
  const [page, setPage] = useState(0)
  const [entityFilter, setEntityFilter] = useState('')
  const [actionFilter, setActionFilter] = useState('')
  const limit = 25

  const { data, isLoading } = useQuery({
    queryKey: ['audit-log', page, entityFilter, actionFilter],
    queryFn: () =>
      fetchAuditLog({
        limit,
        offset: page * limit,
        entityType: entityFilter || undefined,
        action: actionFilter || undefined,
      }),
  })

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(date)
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Audit Log</h1>
        <p className="text-gray-600 mt-1">
          Track all admin actions and changes
        </p>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <div className="w-48">
          <Select
            options={[
              { value: '', label: 'All entities' },
              { value: 'distributor', label: 'Distributors' },
              { value: 'country', label: 'Countries' },
              { value: 'admin_user', label: 'Admin users' },
            ]}
            value={entityFilter}
            onChange={(e) => {
              setEntityFilter(e.target.value)
              setPage(0)
            }}
          />
        </div>
        <div className="w-48">
          <Select
            options={[
              { value: '', label: 'All actions' },
              { value: 'create', label: 'Create' },
              { value: 'update', label: 'Update' },
              { value: 'delete', label: 'Delete' },
              { value: 'publish', label: 'Publish' },
              { value: 'unpublish', label: 'Unpublish' },
              { value: 'import', label: 'Import' },
              { value: 'export', label: 'Export' },
            ]}
            value={actionFilter}
            onChange={(e) => {
              setActionFilter(e.target.value)
              setPage(0)
            }}
          />
        </div>
      </div>

      {/* Log entries */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="divide-y">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="p-4">
                  <div className="h-5 w-48 skeleton rounded mb-2" />
                  <div className="h-4 w-32 skeleton rounded" />
                </div>
              ))}
            </div>
          ) : data?.entries.length === 0 ? (
            <div className="p-12 text-center">
              <ScrollText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No audit log entries
              </h3>
              <p className="text-gray-500">
                Actions will appear here once you start making changes
              </p>
            </div>
          ) : (
            <div className="divide-y">
              {data?.entries.map((entry) => (
                <div key={entry.id} className="p-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                        <User className="w-4 h-4 text-gray-500" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          <span className="text-gray-600">
                            {entry.user?.name || entry.user?.email || 'System'}
                          </span>{' '}
                          <Badge variant={actionColors[entry.action] || 'default'}>
                            {entry.action}
                          </Badge>{' '}
                          <span className="text-gray-600">{entry.entity_type}</span>
                        </p>
                        {entry.changes && (
                          <div className="mt-2 text-sm text-gray-500">
                            {(entry.changes as any).name && (
                              <span>
                                &quot;{String((entry.changes as any).name)}&quot;
                              </span>
                            )}
                            {(entry.changes as any).imported && (
                              <span>
                                {String((entry.changes as any).imported)} records imported
                              </span>
                            )}
                            {(entry.changes as any).count && (
                              <span>
                                {String((entry.changes as any).count)} records exported
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-400">
                      <Clock className="w-4 h-4" />
                      {formatDate(entry.created_at)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {data && data.entries.length > 0 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-gray-500">
            Showing {page * limit + 1} to {Math.min((page + 1) * limit, data.total || 0)} of{' '}
            {data.total || 0} entries
          </p>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setPage((p) => p + 1)}
              disabled={(page + 1) * limit >= (data.total || 0)}
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
