'use client'

import { useMemo, useState } from 'react'
import type { DistributorWithCoverage, DistributorFilters as FilterType } from '@/types'
import { DistributorCard } from './DistributorCard'
import { DistributorFilters } from './DistributorFilters'
import { Modal } from '@/components/ui/Modal'
import { DistributorPopup } from '@/components/map/DistributorPopup'
import { Button } from '@/components/ui/Button'
import { Filter, Grid, List, Globe } from 'lucide-react'

interface DistributorListProps {
  distributors: DistributorWithCoverage[]
  onDistributorSelect?: (distributor: DistributorWithCoverage) => void
}

export function DistributorList({
  distributors,
  onDistributorSelect,
}: DistributorListProps) {
  const [showFilters, setShowFilters] = useState(false)
  const [selectedDistributor, setSelectedDistributor] = useState<DistributorWithCoverage | null>(
    null
  )
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [filters, setFilters] = useState<FilterType>({
    search: '',
    region: null,
    products: [],
    languages: [],
    serviceTypes: [],
    countryIso2: null,
  })

  // Filter distributors
  const filteredDistributors = useMemo(() => {
    return distributors.filter((d) => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        const nameMatch = d.name.toLowerCase().includes(searchLower)
        const countryMatch = d.countries?.some(
          (c) =>
            c.name.toLowerCase().includes(searchLower) ||
            c.iso2.toLowerCase() === searchLower
        )
        if (!nameMatch && !countryMatch) return false
      }

      // Region filter
      if (filters.region) {
        if (!d.regions_served?.includes(filters.region)) return false
      }

      // Products filter
      if (filters.products.length > 0) {
        const hasAnyProduct = filters.products.some((p) =>
          d.products_supported?.includes(p)
        )
        if (!hasAnyProduct) return false
      }

      // Service types filter
      if (filters.serviceTypes.length > 0) {
        const hasAnyService = filters.serviceTypes.some((s) =>
          d.service_types?.includes(s)
        )
        if (!hasAnyService) return false
      }

      // Languages filter
      if (filters.languages.length > 0) {
        const hasAnyLanguage = filters.languages.some((l) =>
          d.languages_supported?.includes(l)
        )
        if (!hasAnyLanguage) return false
      }

      return true
    })
  }, [distributors, filters])

  const activeFilterCount = [
    filters.search,
    filters.region,
    ...filters.products,
    ...filters.languages,
    ...filters.serviceTypes,
  ].filter(Boolean).length

  const handleDistributorClick = (distributor: DistributorWithCoverage) => {
    setSelectedDistributor(distributor)
    onDistributorSelect?.(distributor)
  }

  return (
    <section className="py-12 lg:py-16 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
            Find an Authorized Distributor
          </h2>
          <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
            TurboMed Orthotics are available through our network of authorized distributors
            in 30+ countries worldwide. Find your local distributor below.
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <Button
              variant={showFilters ? 'primary' : 'secondary'}
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="w-4 h-4" />
              Filters
              {activeFilterCount > 0 && (
                <span className="ml-1 px-1.5 py-0.5 bg-white/20 rounded text-xs">
                  {activeFilterCount}
                </span>
              )}
            </Button>
            <span className="text-sm text-gray-500">
              {filteredDistributors.length} distributor
              {filteredDistributors.length !== 1 ? 's' : ''}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'grid' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters sidebar */}
          {showFilters && (
            <aside className="w-full lg:w-72 flex-shrink-0">
              <div className="bg-white rounded-xl p-6 shadow-card sticky top-24">
                <h3 className="font-semibold text-gray-900 mb-4">Filter Distributors</h3>
                <DistributorFilters filters={filters} onChange={setFilters} />
              </div>
            </aside>
          )}

          {/* Distributor grid/list */}
          <div className="flex-1">
            {filteredDistributors.length > 0 ? (
              <div
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 md:grid-cols-2 gap-4'
                    : 'space-y-4'
                }
              >
                {filteredDistributors.map((distributor) => (
                  <DistributorCard
                    key={distributor.id}
                    distributor={distributor}
                    onClick={() => handleDistributorClick(distributor)}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl p-12 text-center">
                <Globe className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No distributors found
                </h3>
                <p className="text-gray-500 mb-6">
                  Try adjusting your filters or search terms
                </p>
                <Button variant="secondary" onClick={() => setFilters({
                  search: '',
                  region: null,
                  products: [],
                  languages: [],
                  serviceTypes: [],
                  countryIso2: null,
                })}>
                  Clear filters
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Become a distributor CTA */}
        <div className="mt-12 bg-turbo-navy rounded-2xl p-8 lg:p-12 text-center text-white">
          <h3 className="text-2xl lg:text-3xl font-bold mb-3">
            Interested in Becoming a Distributor?
          </h3>
          <p className="text-gray-300 mb-6 max-w-xl mx-auto">
            Join our global network of authorized TurboMed distributors and help patients
            walk with confidence.
          </p>
          <a
            href="https://turbomedusa.com/contact"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary inline-flex bg-white hover:bg-gray-100"
          >
            Contact Us
          </a>
        </div>
      </div>

      {/* Distributor detail modal */}
      <Modal
        isOpen={!!selectedDistributor}
        onClose={() => setSelectedDistributor(null)}
        size="sm"
      >
        {selectedDistributor && <DistributorPopup distributor={selectedDistributor} />}
      </Modal>
    </section>
  )
}
