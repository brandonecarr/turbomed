'use client'

import { usePublicFaqs, usePublicKbCategories } from '@/hooks/useKnowledgebase'
import { FaqAccordion } from '@/components/knowledgebase/FaqAccordion'
import { HelpCircle, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function FaqPage() {
  const { data: faqs, isLoading: loadingFaqs } = usePublicFaqs()
  const { data: categories } = usePublicKbCategories()

  // Group FAQs by category
  const uncategorized = faqs?.filter((f) => !f.category_id) || []
  const grouped =
    categories
      ?.map((cat) => ({
        category: cat,
        faqs: faqs?.filter((f) => f.category_id === cat.id) || [],
      }))
      .filter((g) => g.faqs.length > 0) || []

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link
        href="/knowledgebase"
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-turbo-blue mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Knowledgebase
      </Link>

      <div className="text-center mb-12">
        <HelpCircle className="w-12 h-12 mx-auto mb-4 text-turbo-blue" />
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h1>
        <p className="text-lg text-gray-600">
          Find answers to common questions about TurboMed products and services
        </p>
      </div>

      {loadingFaqs ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-turbo-blue" />
        </div>
      ) : faqs?.length === 0 ? (
        <div className="text-center py-12">
          <HelpCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No FAQs yet</h3>
          <p className="text-gray-500">Check back soon for answers to common questions</p>
        </div>
      ) : (
        <div className="space-y-10">
          {grouped.map(({ category, faqs: catFaqs }) => (
            <div key={category.id}>
              <h2 className="text-xl font-bold text-gray-900 mb-4">{category.name}</h2>
              <FaqAccordion faqs={catFaqs} />
            </div>
          ))}
          {uncategorized.length > 0 && (
            <div>
              {grouped.length > 0 && (
                <h2 className="text-xl font-bold text-gray-900 mb-4">General</h2>
              )}
              <FaqAccordion faqs={uncategorized} />
            </div>
          )}
        </div>
      )}
    </div>
  )
}
