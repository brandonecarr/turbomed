'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAdminClinics, useDeleteClinic } from '@/hooks/useClinics'
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
  Building2,
  MapPin,
  Mail,
  Phone,
  Clock,
  CheckCircle,
  XCircle,
  ExternalLink,
} from 'lucide-react'
import type { ClinicStatus } from '@/types'

export default function ClinicsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const statusFilter = (searchParams.get('status') as ClinicStatus | null) || undefined

  const [search, setSearch] = useState('')
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; id: string; name: string }>({
    isOpen: false,
    id: '',
    name: '',
  })

  const { data: clinics, isLoading } = useAdminClinics({
    status: statusFilter,
    search: search || undefined,
  })

  const deleteClinic = useDeleteClinic()

  const handleDelete = () => {
    deleteClinic.mutate(deleteModal.id, {
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
    router.push(`/admin/clinics?${params.toString()}`)
  }

  const statusBadgeConfig = {
    pending: { variant: 'warning' as const, icon: Clock, label: 'Pending' },
    approved: { variant: 'success' as const, icon: CheckCircle, label: 'Approved' },
    rejected: { variant: 'error' as const, icon: XCircle, label: 'Rejected' },
  }

  const pendingCount = clinics?.filter((c) => c.status === 'pending').length || 0

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Clinics</h1>
          <p className="text-gray-600 mt-1">Manage clinic submissions and listings</p>
        </div>
        <Link href="/admin/clinics/new">
          <Button>
            <Plus className="w-4 h-4" />
            Add Clinic
          </Button>
        </Link>
      </div>

      {/* Pending alert */}
      {pendingCount > 0 && !statusFilter && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-yellow-600" />
            <span className="text-yellow-800">
              <strong>{pendingCount}</strong> clinic{pendingCount !== 1 ? 's' : ''} pending review
            </span>
          </div>
          <Button variant="ghost" size="sm" onClick={() => handleStatusFilter('pending')}>
            View Pending
          </Button>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search clinics..."
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
            variant={statusFilter === 'pending' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => handleStatusFilter('pending')}
            className="relative"
          >
            Pending
            {pendingCount > 0 && (
              <span className="ml-1.5 bg-yellow-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                {pendingCount}
              </span>
            )}
          </Button>
          <Button
            variant={statusFilter === 'approved' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => handleStatusFilter('approved')}
          >
            Approved
          </Button>
          <Button
            variant={statusFilter === 'rejected' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => handleStatusFilter('rejected')}
          >
            Rejected
          </Button>
        </div>
      </div>

      {/* Clinics list */}
      {isLoading ? (
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 skeleton rounded-xl" />
          ))}
        </div>
      ) : clinics?.length === 0 ? (
        <Card className="text-center py-12">
          <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No clinics found</h3>
          <p className="text-gray-500 mb-6">
            {search
              ? 'Try adjusting your search query'
              : statusFilter
                ? `No ${statusFilter} clinics`
                : 'No clinic submissions yet'}
          </p>
          {!search && !statusFilter && (
            <Link href="/admin/clinics/new">
              <Button>
                <Plus className="w-4 h-4" />
                Add Clinic
              </Button>
            </Link>
          )}
        </Card>
      ) : (
        <div className="grid gap-4">
          {clinics?.map((clinic) => {
            const statusConfig = statusBadgeConfig[clinic.status]
            const StatusIcon = statusConfig.icon
            const locationCount = clinic.locations?.length || 0

            return (
              <Card key={clinic.id} className="p-4 hover:shadow-card-hover transition-shadow">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-gray-900 truncate">{clinic.name}</h3>
                      <Badge variant={statusConfig.variant}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {statusConfig.label}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Mail className="w-4 h-4" />
                        {clinic.email}
                      </span>
                      {clinic.phone && (
                        <span className="flex items-center gap-1">
                          <Phone className="w-4 h-4" />
                          {clinic.phone}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {locationCount} location{locationCount !== 1 ? 's' : ''}
                      </span>
                      {clinic.website_url && (
                        <a
                          href={clinic.website_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-turbo-blue hover:underline"
                        >
                          <ExternalLink className="w-4 h-4" />
                          Website
                        </a>
                      )}
                    </div>
                    {clinic.status === 'pending' && (
                      <p className="text-xs text-gray-400 mt-2">
                        Submitted {new Date(clinic.submitted_at).toLocaleDateString()}
                      </p>
                    )}
                    {clinic.status === 'rejected' && clinic.rejection_reason && (
                      <p className="text-xs text-red-500 mt-2">
                        Rejected: {clinic.rejection_reason}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Link href={`/admin/clinics/${clinic.id}`}>
                      <Button variant="ghost" size="sm" title="Edit">
                        <Edit2 className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        setDeleteModal({ isOpen: true, id: clinic.id, name: clinic.name })
                      }
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )}

      {/* Delete confirmation modal */}
      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, id: '', name: '' })}
        title="Delete Clinic"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete <strong>{deleteModal.name}</strong>? This action cannot
            be undone.
          </p>
          <div className="flex justify-end gap-3">
            <Button
              variant="ghost"
              onClick={() => setDeleteModal({ isOpen: false, id: '', name: '' })}
            >
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete} isLoading={deleteClinic.isPending}>
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
