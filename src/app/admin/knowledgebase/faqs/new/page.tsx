'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FaqForm } from '@/components/admin/FaqForm'
import { useCreateFaq } from '@/hooks/useKnowledgebase'
import { ArrowLeft } from 'lucide-react'
import type { KbFaqInput } from '@/lib/validators'

export default function NewFaqPage() {
  const router = useRouter()
  const createFaq = useCreateFaq()

  const handleSubmit = (data: KbFaqInput) => {
    createFaq.mutate(data, {
      onSuccess: () => router.push('/admin/knowledgebase?tab=faqs'),
    })
  }

  return (
    <div>
      <div className="mb-8">
        <Link href="/admin/knowledgebase?tab=faqs" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-4">
          <ArrowLeft className="w-4 h-4" />
          Back to Knowledgebase
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">New FAQ</h1>
        <p className="text-gray-600 mt-1">Create a new frequently asked question</p>
      </div>

      <FaqForm onSubmit={handleSubmit} isLoading={createFaq.isPending} />

      {createFaq.isError && (
        <p className="text-red-500 text-sm mt-4">{createFaq.error.message}</p>
      )}
    </div>
  )
}
