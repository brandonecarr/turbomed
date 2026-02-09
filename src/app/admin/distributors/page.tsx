'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAdminDistributors, useTogglePublishDistributor, useDeleteDistributor } from '@/hooks/useDistributors'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { Modal } from '@/components/ui/Modal'
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Globe,
  MapPin,
  MoreVertical,
  ExternalLink,
} from 'lucide-react'

export default function DistributorsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const statusFilter = searchParams.get('status') || ''

  const [search, setSearch] = useState('')
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; id: string; name: string }>({
    isOpen: false,
    id: '',
    name: '',
  })

  const { data: distributors, isLoading } = useAdminDistributors({
    status: statusFilter || undefined,
    search: search || undefined,
  })

  const togglePublish = useTogglePublishDistributor()
  const deleteDistributor = useDeleteDistributor()

  const handleTogglePublish = (id: string, currentStatus: string) => {
    togglePublish.mutate({
      id,
      publish: currentStatus !== 'published',
    })
  }

  const handleDelete = () => {
    deleteDistributor.mutate(deleteModal.id, {
      onSuccess: () => setDeleteModal({ isOpen: false, id: '', name: '' }),
    })
  }

  const handleStatusFilter = (status: string) => {
    const params = new URLSearchParams(searchParams)
    if (status) {
      params.set('status', status)
    } else {
      params.delete('status')
    }
    router.push(`/admin/distributors?${params.toString()}`)
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Distributors</h1>
          <p className="text-gray-600 mt-1">Manage your distributor network</p>
        </div>
        <Link href="/admin/distributors/new">
          <Button>
            <Plus className="w-4 h-4" />
            Add Distributor
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search distributors..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant={!statusFilter ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => handleStatusFilter('')}
          >
            All
          </Button>
          <Button
            variant={statusFilter === 'published' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => handleStatusFilter('published')}
          >
            Published
          </Button>
          <Button
            variant={statusFilter === 'unpublished' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => handleStatusFilter('unpublished')}
          >
            Unpublished
          </Button>
        </div>
      </div>

      {/* Distributors list */}
      {isLoading ? (
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 skeleton rounded-xl" />
          ))}
        </div>
      ) : distributors?.length === 0 ? (
        <Card className="text-center py-12">
          <Globe className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No distributors found</h3>
          <p className="text-gray-500 mb-6">
            {search
              ? 'Try adjusting your search query'
              : 'Get started by adding your first distributor'}
          </p>
          {!search && (
            <Link href="/admin/distributors/new">
              <Button>
                <Plus className="w-4 h-4" />
                Add Distributor
              </Button>
            </Link>
          )}
        </Card>
      ) : (
        <div className="grid gap-4">
          {distributors?.map((distributor) => (
            <Card key={distributor.id} className="p-4 hover:shadow-card-hover transition-shadow">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {distributor.name}
                    </h3>
                    <Badge
                      variant={distributor.status === 'published' ? 'success' : 'warning'}
                    >
                      {distributor.status}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Globe className="w-4 h-4" />
                      {distributor.countries?.length || 0} countries
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {distributor.location_lat.toFixed(2)}, {distributor.location_lng.toFixed(2)}
                    </span>
                    {distributor.website_url && (
                      <a
                        href={distributor.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-turbo-blue hover:underline"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Website
                      </a>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleTogglePublish(distributor.id, distributor.status)}
                    title={distributor.status === 'published' ? 'Unpublish' : 'Publish'}
                  >
                    {distributor.status === 'published' ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </Button>
                  <Link href={`/admin/distributors/${distributor.id}`}>
                    <Button variant="ghost" size="sm" title="Edit">
                      <Edit2 className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      setDeleteModal({ isOpen: true, id: distributor.id, name: distributor.name })
                    }
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Delete confirmation modal */}
      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, id: '', name: '' })}
        title="Delete Distributor"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete <strong>{deleteModal.name}</strong>? This action
            cannot be undone.
          </p>
          <div className="flex justify-end gap-3">
            <Button
              variant="ghost"
              onClick={() => setDeleteModal({ isOpen: false, id: '', name: '' })}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
              isLoading={deleteDistributor.isPending}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
