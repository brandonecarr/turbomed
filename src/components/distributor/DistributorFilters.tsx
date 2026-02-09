'use client'

import { X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { REGIONS, PRODUCT_LINES, SERVICE_TYPES, COMMON_LANGUAGES } from '@/types'
import type { DistributorFilters as FilterType, Region, ProductLine, ServiceType } from '@/types'

interface DistributorFiltersProps {
  filters: FilterType
  onChange: (filters: FilterType) => void
}

export function DistributorFilters({ filters, onChange }: DistributorFiltersProps) {
  const updateFilter = <K extends keyof FilterType>(key: K, value: FilterType[K]) => {
    onChange({ ...filters, [key]: value })
  }

  const toggleArrayFilter = <T extends string>(
    key: 'products' | 'languages' | 'serviceTypes',
    value: T
  ) => {
    const current = filters[key] as T[]
    if (current.includes(value)) {
      updateFilter(key, current.filter((v) => v !== value) as any)
    } else {
      updateFilter(key, [...current, value] as any)
    }
  }

  const clearFilters = () => {
    onChange({
      search: '',
      region: null,
      products: [],
      languages: [],
      serviceTypes: [],
      countryIso2: null,
    })
  }

  const hasActiveFilters =
    filters.search ||
    filters.region ||
    filters.products.length > 0 ||
    filters.languages.length > 0 ||
    filters.serviceTypes.length > 0

  return (
    <div className="space-y-6">
      {/* Search */}
      <div>
        <label className="label">Search</label>
        <Input
          placeholder="Search distributors..."
          value={filters.search}
          onChange={(e) => updateFilter('search', e.target.value)}
        />
      </div>

      {/* Region */}
      <div>
        <label className="label">Region</label>
        <div className="flex flex-wrap gap-2">
          {REGIONS.map((region) => (
            <button
              key={region}
              onClick={() => updateFilter('region', filters.region === region ? null : region)}
              className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                filters.region === region
                  ? 'bg-turbo-navy text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {region}
            </button>
          ))}
        </div>
      </div>

      {/* Products */}
      <div>
        <label className="label">Products Supported</label>
        <div className="flex flex-wrap gap-2">
          {PRODUCT_LINES.map((product) => (
            <button
              key={product}
              onClick={() => toggleArrayFilter('products', product)}
              className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                filters.products.includes(product)
                  ? 'bg-turbo-navy text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {product}
            </button>
          ))}
        </div>
      </div>

      {/* Service Types */}
      <div>
        <label className="label">Service Types</label>
        <div className="flex flex-wrap gap-2">
          {SERVICE_TYPES.map((service) => (
            <button
              key={service}
              onClick={() => toggleArrayFilter('serviceTypes', service)}
              className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                filters.serviceTypes.includes(service)
                  ? 'bg-turbo-navy text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {service}
            </button>
          ))}
        </div>
      </div>

      {/* Languages */}
      <div>
        <label className="label">Languages</label>
        <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
          {COMMON_LANGUAGES.slice(0, 10).map((language) => (
            <button
              key={language}
              onClick={() => toggleArrayFilter('languages', language)}
              className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                filters.languages.includes(language)
                  ? 'bg-turbo-navy text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {language}
            </button>
          ))}
        </div>
      </div>

      {/* Clear filters */}
      {hasActiveFilters && (
        <Button variant="ghost" onClick={clearFilters} className="w-full">
          <X className="w-4 h-4" />
          Clear all filters
        </Button>
      )}
    </div>
  )
}
