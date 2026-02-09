'use client'

import { useParams } from 'next/navigation'
import { useAdminClinic } from '@/hooks/useClinics'
import { ClinicForm } from '@/components/admin/ClinicForm'
import { Loader2 } from 'lucide-react'

export default function EditClinicPage() {
  const params = useParams()
  const id = params.id as string
  const { data: clinic, isLoading, error } = useAdminClinic(id)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-turbo-navy" />
      </div>
    )
  }

  if (error || !clinic) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Clinic not found</h2>
        <p className="text-gray-600">
          The clinic you&apos;re looking for doesn&apos;t exist or has been deleted.
        </p>
      </div>
    )
  }

  return <ClinicForm clinic={clinic} mode="edit" />
}
