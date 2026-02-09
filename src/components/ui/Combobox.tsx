'use client'

import { useState, useRef, useEffect, useMemo } from 'react'
import { cn } from '@/lib/utils'
import { ChevronDown, Check, Search } from 'lucide-react'

interface ComboboxProps {
  options: { value: string; label: string; searchTerms?: string[] }[]
  value: string
  onChange: (value: string) => void
  label?: string
  placeholder?: string
  error?: string
  className?: string
}

export function Combobox({
  options,
  value,
  onChange,
  label,
  placeholder = 'Select an option...',
  error,
  className,
}: ComboboxProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setSearch('')
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const filteredOptions = useMemo(() => {
    if (!search) return options
    const searchLower = search.toLowerCase()
    return options.filter((option) => {
      const labelMatch = option.label.toLowerCase().includes(searchLower)
      const searchTermsMatch = option.searchTerms?.some(
        (term) => term.toLowerCase().includes(searchLower)
      )
      return labelMatch || searchTermsMatch
    })
  }, [options, search])

  const selectedLabel = options.find((o) => o.value === value)?.label || ''

  const handleSelect = (optionValue: string) => {
    onChange(optionValue)
    setIsOpen(false)
    setSearch('')
  }

  const handleInputClick = () => {
    setIsOpen(true)
    inputRef.current?.focus()
  }

  return (
    <div className={cn('w-full relative', className)} ref={containerRef}>
      {label && <label className="label">{label}</label>}
      <div
        className={cn(
          'relative border rounded-lg bg-white transition-colors',
          isOpen ? 'border-turbo-blue ring-2 ring-turbo-blue' : 'border-gray-300',
          error && 'border-red-500'
        )}
        onClick={handleInputClick}
      >
        <div className="flex items-center">
          <Search className="w-4 h-4 text-gray-400 ml-3" />
          <input
            ref={inputRef}
            type="text"
            value={isOpen ? search : selectedLabel}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={placeholder}
            className="w-full px-3 py-2.5 bg-transparent focus:outline-none text-sm"
          />
          <ChevronDown
            className={cn(
              'w-5 h-5 text-gray-400 mr-3 transition-transform flex-shrink-0',
              isOpen && 'rotate-180'
            )}
          />
        </div>
      </div>

      {isOpen && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => (
              <div
                key={option.value}
                className={cn(
                  'flex items-center justify-between px-3 py-2.5 cursor-pointer hover:bg-gray-50',
                  value === option.value && 'bg-turbo-blue-pale'
                )}
                onClick={() => handleSelect(option.value)}
              >
                <span className="text-sm">{option.label}</span>
                {value === option.value && (
                  <Check className="w-4 h-4 text-turbo-blue" />
                )}
              </div>
            ))
          ) : (
            <div className="px-3 py-4 text-sm text-gray-500 text-center">
              No results found for &ldquo;{search}&rdquo;
            </div>
          )}
        </div>
      )}
      {error && <p className="mt-1.5 text-sm text-red-600">{error}</p>}
    </div>
  )
}
