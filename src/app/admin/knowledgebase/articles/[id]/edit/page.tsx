'use client'

import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { ArticleForm } from '@/components/admin/ArticleForm'
import { useAdminArticle, useUpdateArticle } from '@/hooks/useKnowledgebase'
import { Button } from '@/components/ui/Button'
import { ArrowLeft } from 'lucide-react'
import type { KbArticleInput } from '@/lib/validators'

export default function EditArticlePage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const { data: article, isLoading } = useAdminArticle(id)
  const updateArticle = useUpdateArticle()

  const handleSubmit = (data: KbArticleInput) => {
    updateArticle.mutate(
      { id, data },
      { onSuccess: () => router.push('/admin/knowledgebase') }
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

  if (!article) {
    return (
      <div className="text-center py-12">
        <h2 className="text-lg font-medium text-gray-900">Article not found</h2>
        <Link href="/admin/knowledgebase">
          <Button variant="ghost" className="mt-4">Back to Knowledgebase</Button>
        </Link>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <Link href="/admin/knowledgebase" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-4">
          <ArrowLeft className="w-4 h-4" />
          Back to Knowledgebase
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Edit Article</h1>
        <p className="text-gray-600 mt-1">{article.title}</p>
      </div>

      <ArticleForm
        article={article}
        onSubmit={handleSubmit}
        isLoading={updateArticle.isPending}
      />

      {updateArticle.isError && (
        <p className="text-red-500 text-sm mt-4">{updateArticle.error.message}</p>
      )}
    </div>
  )
}
