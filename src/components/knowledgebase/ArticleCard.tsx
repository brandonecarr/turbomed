import Link from 'next/link'
import { Badge } from '@/components/ui/Badge'
import { FileText, Calendar } from 'lucide-react'
import type { KbArticle } from '@/types'

interface ArticleCardProps {
  article: KbArticle
}

export function ArticleCard({ article }: ArticleCardProps) {
  const href =
    article.content_type === 'product_doc'
      ? `/knowledgebase/products/${article.slug}`
      : `/knowledgebase/articles/${article.slug}`

  return (
    <Link href={href} className="block group">
      <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg hover:border-turbo-blue-light transition-all">
        {article.featured_image_url && (
          <div className="mb-4 rounded-lg overflow-hidden aspect-video bg-gray-100">
            <img
              src={article.featured_image_url}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="flex items-center gap-2 mb-3">
          {article.category && (
            <Badge variant="default">{article.category.name}</Badge>
          )}
          {article.content_type === 'product_doc' && (
            <Badge variant="info">Product Doc</Badge>
          )}
        </div>
        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-turbo-blue transition-colors mb-2">
          {article.title}
        </h3>
        {article.excerpt && (
          <p className="text-gray-600 text-sm line-clamp-2 mb-3">{article.excerpt}</p>
        )}
        <div className="flex items-center gap-4 text-xs text-gray-400">
          {article.published_at && (
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {new Date(article.published_at).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
