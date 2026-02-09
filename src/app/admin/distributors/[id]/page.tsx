'use client'

import { useParams } from 'next/navigation'
import { useAdminDistributor } from '@/hooks/useDistributors'
import { DistributorForm } from '@/components/admin/DistributorForm'
import { Loader2 } from 'lucide-react'

export default function EditDistributorPage() {
  const params = useParams()
  const id = params.id as string
  const { data: distributor, isLoading, error } = useAdminDistributor(id)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-turbo-navy" />
      </div>
    )
  }

  if (error || !distributor) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Distributor not found
        </h2>
        <p className="text-gray-600">
          The distributor you&apos;re looking for doesn&apos;t exist or has been deleted.
        </p>
      </div>
    )
  }

  return <DistributorForm distributor={distributor} mode="edit" />
}
