'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { KbFaq } from '@/types'

interface FaqAccordionProps {
  faqs: KbFaq[]
}

function FaqItem({ faq }: { faq: KbFaq }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="border-b border-gray-200 last:border-0">
      <button
        className="w-full flex items-center justify-between py-5 px-1 text-left hover:text-turbo-blue transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-medium text-gray-900 pr-4">{faq.question}</span>
        <ChevronDown
          className={cn(
            'w-5 h-5 text-gray-400 flex-shrink-0 transition-transform',
            isOpen && 'rotate-180'
          )}
        />
      </button>
      {isOpen && (
        <div
          className="pb-5 px-1 prose prose-sm max-w-none text-gray-600"
          dangerouslySetInnerHTML={{ __html: faq.answer }}
        />
      )}
    </div>
  )
}

export function FaqAccordion({ faqs }: FaqAccordionProps) {
  if (faqs.length === 0) return null

  return (
    <div className="bg-white rounded-xl border border-gray-200 px-6">
      {faqs.map((faq) => (
        <FaqItem key={faq.id} faq={faq} />
      ))}
    </div>
  )
}
