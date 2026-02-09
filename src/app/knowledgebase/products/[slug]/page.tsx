'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { usePublicArticle } from '@/hooks/useKnowledgebase'
import { ArticleContent } from '@/components/knowledgebase/ArticleContent'
import { Badge } from '@/components/ui/Badge'
import { ArrowLeft, Calendar, Package, Loader2 } from 'lucide-react'

export default function ProductDocPage() {
  const params = useParams()
  const slug = params.slug as string
  const { data: article, isLoading, error } = usePublicArticle(slug)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-8 h-8 animate-spin text-turbo-blue" />
      </div>
    )
  }

  if (error || !article) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Documentation Not Found</h1>
        <p className="text-gray-600 mb-6">The documentation you&apos;re looking for doesn&apos;t exist or has been removed.</p>
        <Link href="/knowledgebase" className="text-turbo-blue hover:underline">
          Back to Knowledgebase
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link
        href="/knowledgebase"
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-turbo-blue mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Knowledgebase
      </Link>

      <article>
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Badge variant="info">
              <Package className="w-3.5 h-3.5 inline-block mr-1 -mt-0.5" />
              Product Documentation
            </Badge>
            {article.category && <Badge variant="default">{article.category.name}</Badge>}
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">{article.title}</h1>
          {article.excerpt && (
            <p className="text-lg text-gray-600 mb-4">{article.excerpt}</p>
          )}
          <div className="flex items-center gap-4 text-sm text-gray-400">
            {article.published_at && (
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                Last updated: {new Date(article.published_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            )}
          </div>
        </div>

        {article.featured_image_url && (
          <div className="mb-8 rounded-xl overflow-hidden">
            <img
              src={article.featured_image_url}
              alt={article.title}
              className="w-full"
            />
          </div>
        )}

        <ArticleContent html={article.content} />
      </article>
    </div>
  )
}
