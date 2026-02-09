'use client'

import { Suspense, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { usePublicArticles, usePublicKbCategories } from '@/hooks/useKnowledgebase'
import { ArticleCard } from '@/components/knowledgebase/ArticleCard'
import { CategoryGrid } from '@/components/knowledgebase/CategoryGrid'
import { KbSearch } from '@/components/knowledgebase/KbSearch'
import { BookOpen, FileText, HelpCircle, Loader2 } from 'lucide-react'
import Link from 'next/link'

function KnowledgebaseContent() {
  const searchParams = useSearchParams()
  const categoryFilter = searchParams.get('category') || undefined

  const [search, setSearch] = useState('')

  const { data: categories, isLoading: loadingCategories } = usePublicKbCategories()
  const { data: articles, isLoading: loadingArticles } = usePublicArticles({
    search: search || undefined,
    category: categoryFilter,
  })

  const activeCategory = categories?.find((c) => c.slug === categoryFilter)

  return (
    <div>
      {/* Hero section */}
      <div className="bg-turbo-navy text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-80" />
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">Knowledgebase</h1>
          <p className="text-lg text-gray-300 mb-8">
            Find articles, product documentation, and answers to frequently asked questions
          </p>
          <KbSearch onSearch={setSearch} />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Quick links */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/knowledgebase"
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-turbo-blue-pale text-turbo-blue hover:bg-turbo-blue hover:text-white transition-colors"
          >
            <FileText className="w-4 h-4" />
            All Articles
          </Link>
          <Link
            href="/knowledgebase/faq"
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-turbo-blue-pale hover:text-turbo-blue transition-colors"
          >
            <HelpCircle className="w-4 h-4" />
            FAQs
          </Link>
        </div>

        {/* Category filter */}
        {activeCategory && (
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">{activeCategory.name}</h2>
              <Link href="/knowledgebase" className="text-sm text-turbo-blue hover:underline">
                Clear filter
              </Link>
            </div>
            {activeCategory.description && (
              <p className="text-gray-600 mt-1">{activeCategory.description}</p>
            )}
          </div>
        )}

        {/* Categories (show when no search and no category filter) */}
        {!search && !categoryFilter && !loadingCategories && categories && categories.length > 0 && (
          <div className="mb-12">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Browse by Category</h2>
            <CategoryGrid categories={categories} />
          </div>
        )}

        {/* Search results header */}
        {search && (
          <div className="mb-6">
            <h2 className="text-lg font-medium text-gray-900">
              Search results for &quot;{search}&quot;
            </h2>
          </div>
        )}

        {/* Articles */}
        <div className="mb-8">
          {!search && !categoryFilter && (
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              {categoryFilter ? 'Articles' : 'Latest Articles'}
            </h2>
          )}

          {loadingArticles ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-turbo-blue" />
            </div>
          ) : articles?.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No articles found</h3>
              <p className="text-gray-500">
                {search
                  ? 'Try adjusting your search query'
                  : 'Check back soon for new content'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles?.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function KnowledgebasePage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-8 h-8 animate-spin text-turbo-blue" />
        </div>
      }
    >
      <KnowledgebaseContent />
    </Suspense>
  )
}
