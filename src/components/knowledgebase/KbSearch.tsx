'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/Input'

interface KbSearchProps {
  onSearch: (query: string) => void
  placeholder?: string
}

export function KbSearch({ onSearch, placeholder }: KbSearchProps) {
  const [query, setQuery] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(query)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)
    onSearch(value)
  }

  return (
    <form onSubmit={handleSubmit} className="relative max-w-xl mx-auto">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
      <Input
        value={query}
        onChange={handleChange}
        placeholder={placeholder || 'Search articles, FAQs, and product docs...'}
        className="pl-12 py-3 text-base rounded-xl border-gray-300 focus:border-turbo-blue"
      />
    </form>
  )
}
