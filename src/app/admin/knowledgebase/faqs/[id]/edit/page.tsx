'use client'

import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { FaqForm } from '@/components/admin/FaqForm'
import { useAdminFaq, useUpdateFaq } from '@/hooks/useKnowledgebase'
import { Button } from '@/components/ui/Button'
import { ArrowLeft } from 'lucide-react'
import type { KbFaqInput } from '@/lib/validators'

export default function EditFaqPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const { data: faq, isLoading } = useAdminFaq(id)
  const updateFaq = useUpdateFaq()

  const handleSubmit = (data: KbFaqInput) => {
    updateFaq.mutate(
      { id, data },
      { onSuccess: () => router.push('/admin/knowledgebase?tab=faqs') }
    )
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 skeleton rounded" />
        <div className="h-96 skeleton rounded-xl" />
      </div>
    )
  }

  if (!faq) {
    return (
      <div className="text-center py-12">
        <h2 className="text-lg font-medium text-gray-900">FAQ not found</h2>
        <Link href="/admin/knowledgebase?tab=faqs">
          <Button variant="ghost" className="mt-4">Back to Knowledgebase</Button>
        </Link>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <Link href="/admin/knowledgebase?tab=faqs" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-4">
          <ArrowLeft className="w-4 h-4" />
          Back to Knowledgebase
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Edit FAQ</h1>
        <p className="text-gray-600 mt-1 truncate max-w-lg">{faq.question}</p>
      </div>

      <FaqForm faq={faq} onSubmit={handleSubmit} isLoading={updateFaq.isPending} />

      {updateFaq.isError && (
        <p className="text-red-500 text-sm mt-4">{updateFaq.error.message}</p>
      )}
    </div>
  )
}
