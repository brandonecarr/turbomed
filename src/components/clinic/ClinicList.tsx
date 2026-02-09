'use client'

import { useMemo, useState } from 'react'
import type { ClinicWithLocations, ClinicFilters as FilterType } from '@/types'
import { ClinicCard } from './ClinicCard'
import { Modal } from '@/components/ui/Modal'
import { ClinicPopup } from './ClinicPopup'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Filter, Grid, List, Building2, Search, X } from 'lucide-react'

interface ClinicListProps {
  clinics: ClinicWithLocations[]
  onClinicSelect?: (clinic: ClinicWithLocations) => void
}

export function ClinicList({ clinics, onClinicSelect }: ClinicListProps) {
  const [showFilters, setShowFilters] = useState(false)
  const [selectedClinic, setSelectedClinic] = useState<ClinicWithLocations | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [filters, setFilters] = useState<FilterType>({
    search: '',
    city: null,
    state: null,
    country: null,
  })

  // Get unique values for filter options
  const filterOptions = useMemo(() => {
    const cities = new Set<string>()
    const states = new Set<string>()
    const countries = new Set<string>()

    clinics.forEach((clinic) => {
      clinic.locations?.forEach((loc) => {
        if (loc.city) cities.add(loc.city)
        if (loc.state_region) states.add(loc.state_region)
        if (loc.country) countries.add(loc.country)
      })
      if (clinic.city) cities.add(clinic.city)
      if (clinic.state_region) states.add(clinic.state_region)
      if (clinic.country) countries.add(clinic.country)
    })

    return {
      cities: Array.from(cities).sort(),
      states: Array.from(states).sort(),
      countries: Array.from(countries).sort(),
    }
  }, [clinics])

  // Filter clinics
  const filteredClinics = useMemo(() => {
    return clinics.filter((clinic) => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        const nameMatch = clinic.name.toLowerCase().includes(searchLower)
        const emailMatch = clinic.email?.toLowerCase().includes(searchLower)
        const locationMatch = clinic.locations?.some(
          (loc) =>
            loc.city?.toLowerCase().includes(searchLower) ||
            loc.state_region?.toLowerCase().includes(searchLower) ||
            loc.country?.toLowerCase().includes(searchLower)
        )
        if (!nameMatch && !emailMatch && !locationMatch) return false
      }

      // City filter
      if (filters.city) {
        const hasCity =
          clinic.city === filters.city ||
          clinic.locations?.some((loc) => loc.city === filters.city)
        if (!hasCity) return false
      }

      // State filter
      if (filters.state) {
        const hasState =
          clinic.state_region === filters.state ||
          clinic.locations?.some((loc) => loc.state_region === filters.state)
        if (!hasState) return false
      }

      // Country filter
      if (filters.country) {
        const hasCountry =
          clinic.country === filters.country ||
          clinic.locations?.some((loc) => loc.country === filters.country)
        if (!hasCountry) return false
      }

      return true
    })
  }, [clinics, filters])

  const activeFilterCount = [
    filters.search,
    filters.city,
    filters.state,
    filters.country,
  ].filter(Boolean).length

  const handleClinicClick = (clinic: ClinicWithLocations) => {
    setSelectedClinic(clinic)
    onClinicSelect?.(clinic)
  }

  const clearFilters = () => {
    setFilters({
      search: '',
      city: null,
      state: null,
      country: null,
    })
  }

  return (
    <section className="py-12 lg:py-16 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
            Find a TurboMed Clinic
          </h2>
          <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
            Locate clinics that carry TurboMed Orthotics products. These clinics can help you
            find the right orthotic solution for your needs.
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
              {filteredClinics.length} clinic
              {filteredClinics.length !== 1 ? 's' : ''}
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
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">Filter Clinics</h3>
                  {activeFilterCount > 0 && (
                    <button
                      onClick={clearFilters}
                      className="text-sm text-turbo-blue hover:underline"
                    >
                      Clear all
                    </button>
                  )}
                </div>

                <div className="space-y-4">
                  {/* Search */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Search
                    </label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        type="text"
                        placeholder="Search clinics..."
                        value={filters.search}
                        onChange={(e) =>
                          setFilters((f) => ({ ...f, search: e.target.value }))
                        }
                        className="pl-9"
                      />
                    </div>
                  </div>

                  {/* Country */}
                  {filterOptions.countries.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Country
                      </label>
                      <select
                        value={filters.country || ''}
                        onChange={(e) =>
                          setFilters((f) => ({ ...f, country: e.target.value || null }))
                        }
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-turbo-blue focus:ring-1 focus:ring-turbo-blue"
                      >
                        <option value="">All countries</option>
                        {filterOptions.countries.map((country) => (
                          <option key={country} value={country}>
                            {country}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* State */}
                  {filterOptions.states.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        State/Region
                      </label>
                      <select
                        value={filters.state || ''}
                        onChange={(e) =>
                          setFilters((f) => ({ ...f, state: e.target.value || null }))
                        }
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-turbo-blue focus:ring-1 focus:ring-turbo-blue"
                      >
                        <option value="">All states/regions</option>
                        {filterOptions.states.map((state) => (
                          <option key={state} value={state}>
                            {state}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* City */}
                  {filterOptions.cities.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        City
                      </label>
                      <select
                        value={filters.city || ''}
                        onChange={(e) =>
                          setFilters((f) => ({ ...f, city: e.target.value || null }))
                        }
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-turbo-blue focus:ring-1 focus:ring-turbo-blue"
                      >
                        <option value="">All cities</option>
                        {filterOptions.cities.map((city) => (
                          <option key={city} value={city}>
                            {city}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              </div>
            </aside>
          )}

          {/* Clinic grid/list */}
          <div className="flex-1">
            {filteredClinics.length > 0 ? (
              <div
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 md:grid-cols-2 gap-4'
                    : 'space-y-4'
                }
              >
                {filteredClinics.map((clinic) => (
                  <ClinicCard
                    key={clinic.id}
                    clinic={clinic}
                    onClick={() => handleClinicClick(clinic)}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl p-12 text-center">
                <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No clinics found
                </h3>
                <p className="text-gray-500 mb-6">
                  Try adjusting your filters or search terms
                </p>
                <Button variant="secondary" onClick={clearFilters}>
                  Clear filters
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Become a clinic CTA */}
        <div className="mt-12 bg-turbo-navy rounded-2xl p-8 lg:p-12 text-center text-white">
          <h3 className="text-2xl lg:text-3xl font-bold mb-3">
            Are You a Clinic Using TurboMed Products?
          </h3>
          <p className="text-gray-300 mb-6 max-w-xl mx-auto">
            Register your clinic to be listed in our directory and help patients find you.
          </p>
          <a
            href="/become-a-clinic"
            className="btn-secondary inline-flex bg-white hover:bg-gray-100"
          >
            Register Your Clinic
          </a>
        </div>
      </div>

      {/* Clinic detail modal */}
      <Modal
        isOpen={!!selectedClinic}
        onClose={() => setSelectedClinic(null)}
        size="sm"
      >
        {selectedClinic && <ClinicPopup clinic={selectedClinic} />}
      </Modal>
    </section>
  )
}
