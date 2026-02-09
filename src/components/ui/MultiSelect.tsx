'use client'

import { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { X, ChevronDown, Check } from 'lucide-react'

interface MultiSelectProps {
  options: { value: string; label: string }[]
  value: string[]
  onChange: (value: string[]) => void
  label?: string
  placeholder?: string
  error?: string
  className?: string
}

export function MultiSelect({
  options,
  value,
  onChange,
  label,
  placeholder = 'Select options...',
  error,
  className,
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(search.toLowerCase())
  )

  const toggleOption = (optionValue: string) => {
    if (value.includes(optionValue)) {
      onChange(value.filter((v) => v !== optionValue))
    } else {
      onChange([...value, optionValue])
    }
  }

  const removeOption = (optionValue: string, e: React.MouseEvent) => {
    e.stopPropagation()
    onChange(value.filter((v) => v !== optionValue))
  }

  const selectedLabels = value.map(
    (v) => options.find((o) => o.value === v)?.label || v
  )

  return (
    <div className={cn('w-full', className)} ref={containerRef}>
      {label && <label className="label">{label}</label>}
      <div
        className={cn(
          'relative border rounded-lg bg-white cursor-pointer transition-colors',
          isOpen ? 'border-turbo-blue ring-2 ring-turbo-blue' : 'border-gray-300',
          error && 'border-red-500'
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex flex-wrap gap-1.5 p-2 min-h-[42px]">
          {value.length > 0 ? (
            selectedLabels.map((label, index) => (
              <span
                key={value[index]}
                className="inline-flex items-center gap-1 px-2 py-0.5 bg-turbo-blue-pale text-turbo-navy text-sm rounded-md"
              >
                {label}
                <button
                  type="button"
                  onClick={(e) => removeOption(value[index], e)}
                  className="hover:bg-turbo-blue/20 rounded p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))
          ) : (
            <span className="text-gray-400 py-0.5">{placeholder}</span>
          )}
        </div>
        <div className="absolute right-2 top-1/2 -translate-y-1/2">
          <ChevronDown
            className={cn(
              'w-5 h-5 text-gray-400 transition-transform',
              isOpen && 'rotate-180'
            )}
          />
        </div>
      </div>

      {isOpen && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-hidden">
          <div className="p-2 border-b border-gray-100">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-turbo-blue"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <div className="max-h-48 overflow-y-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <div
                  key={option.value}
                  className={cn(
                    'flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-gray-50',
                    value.includes(option.value) && 'bg-turbo-blue-pale'
                  )}
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleOption(option.value)
                  }}
                >
                  <span className="text-sm">{option.label}</span>
                  {value.includes(option.value) && (
                    <Check className="w-4 h-4 text-turbo-blue" />
                  )}
                </div>
              ))
            ) : (
              <div className="px-3 py-2 text-sm text-gray-500">No options found</div>
            )}
          </div>
        </div>
      )}
      {error && <p className="mt-1.5 text-sm text-red-600">{error}</p>}
    </div>
  )
}
