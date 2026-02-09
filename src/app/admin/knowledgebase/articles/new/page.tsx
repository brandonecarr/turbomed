'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArticleForm } from '@/components/admin/ArticleForm'
import { useCreateArticle } from '@/hooks/useKnowledgebase'
import { Button } from '@/components/ui/Button'
import { ArrowLeft } from 'lucide-react'
import type { KbArticleInput } from '@/lib/validators'

export default function NewArticlePage() {
  const router = useRouter()
  const createArticle = useCreateArticle()

  const handleSubmit = (data: KbArticleInput) => {
    createArticle.mutate(data, {
      onSuccess: () => router.push('/admin/knowledgebase'),
    })
  }

  return (
    <div>
      <div className="mb-8">
        <Link href="/admin/knowledgebase" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-4">
          <ArrowLeft className="w-4 h-4" />
          Back to Knowledgebase
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">New Article</h1>
        <p className="text-gray-600 mt-1">Create a new knowledgebase article or product documentation</p>
      </div>

      <ArticleForm onSubmit={handleSubmit} isLoading={createArticle.isPending} />

      {createArticle.isError && (
        <p className="text-red-500 text-sm mt-4">{createArticle.error.message}</p>
      )}
    </div>
  )
}
