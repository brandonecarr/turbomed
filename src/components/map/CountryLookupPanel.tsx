'use client'

import { useState, useMemo, useEffect } from 'react'
import { Search, X, ChevronDown, Loader2 } from 'lucide-react'
import type { Country, DistributorWithCoverage } from '@/types'
import { cn } from '@/lib/utils'

interface CountryLookupPanelProps {
  countries: Country[]
  distributors: DistributorWithCoverage[]
  selectedCountry: string | null
  onCountrySelect: (iso2: string | null) => void
  onDistributorSelect: (distributor: DistributorWithCoverage) => void
  isLoading?: boolean
  isMobile?: boolean
}

export function CountryLookupPanel({
  countries,
  distributors,
  selectedCountry,
  onCountrySelect,
  onDistributorSelect,
  isLoading,
  isMobile,
}: CountryLookupPanelProps) {
  const [search, setSearch] = useState('')
  const [isExpanded, setIsExpanded] = useState(!isMobile)

  // Filter countries based on search (including synonyms)
  const filteredCountries = useMemo(() => {
    if (!search) return []

    const searchLower = search.toLowerCase()
    return countries
      .filter((c) => {
        const nameMatch = c.name.toLowerCase().includes(searchLower)
        const iso2Match = c.iso2.toLowerCase() === searchLower
        const synonymMatch = c.synonyms?.some((s) =>
          s.toLowerCase().includes(searchLower)
        )
        return nameMatch || iso2Match || synonymMatch
      })
      .slice(0, 10)
  }, [countries, search])

  // Get distributors for selected country
  const countryDistributors = useMemo(() => {
    if (!selectedCountry) return []
    return distributors
      .filter((d) => d.countries?.some((c) => c.iso2 === selectedCountry))
      .sort((a, b) => a.priority_rank - b.priority_rank)
  }, [distributors, selectedCountry])

  const selectedCountryName = countries.find((c) => c.iso2 === selectedCountry)?.name

  // Handle country selection
  const handleSelectCountry = (iso2: string) => {
    onCountrySelect(iso2)
    setSearch('')
  }

  // Clear selection
  const handleClear = () => {
    onCountrySelect(null)
    setSearch('')
  }

  // Mobile bottom sheet toggle
  if (isMobile) {
    return (
      <div
        className={cn(
          'fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl z-40 transition-transform duration-300',
          isExpanded ? 'translate-y-0' : 'translate-y-[calc(100%-80px)]'
        )}
        style={{ maxHeight: '70vh' }}
      >
        {/* Handle */}
        <button
          className="w-full py-3 flex justify-center"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
        </button>

        <div className="px-4 pb-6 overflow-y-auto" style={{ maxHeight: 'calc(70vh - 60px)' }}>
          <CountrySearchContent
            search={search}
            setSearch={setSearch}
            filteredCountries={filteredCountries}
            selectedCountry={selectedCountry}
            selectedCountryName={selectedCountryName}
            countryDistributors={countryDistributors}
            handleSelectCountry={handleSelectCountry}
            handleClear={handleClear}
            onDistributorSelect={onDistributorSelect}
            isLoading={isLoading}
          />
        </div>
      </div>
    )
  }

  // Desktop floating panel
  return (
    <div className="absolute top-4 left-4 z-40 w-80 bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="p-4">
        <CountrySearchContent
          search={search}
          setSearch={setSearch}
          filteredCountries={filteredCountries}
          selectedCountry={selectedCountry}
          selectedCountryName={selectedCountryName}
          countryDistributors={countryDistributors}
          handleSelectCountry={handleSelectCountry}
          handleClear={handleClear}
          onDistributorSelect={onDistributorSelect}
          isLoading={isLoading}
        />
      </div>
    </div>
  )
}

// Shared content component
function CountrySearchContent({
  search,
  setSearch,
  filteredCountries,
  selectedCountry,
  selectedCountryName,
  countryDistributors,
  handleSelectCountry,
  handleClear,
  onDistributorSelect,
  isLoading,
}: {
  search: string
  setSearch: (value: string) => void
  filteredCountries: Country[]
  selectedCountry: string | null
  selectedCountryName: string | undefined
  countryDistributors: DistributorWithCoverage[]
  handleSelectCountry: (iso2: string) => void
  handleClear: () => void
  onDistributorSelect: (distributor: DistributorWithCoverage) => void
  isLoading?: boolean
}) {
  return (
    <>
      {/* Search input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search by country..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-turbo-blue focus:border-turbo-blue"
        />
        {(search || selectedCountry) && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 rounded-full"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        )}
      </div>

      {/* Search results dropdown */}
      {search && filteredCountries.length > 0 && !selectedCountry && (
        <div className="mt-2 max-h-48 overflow-y-auto border border-gray-100 rounded-lg">
          {filteredCountries.map((country) => (
            <button
              key={country.iso2}
              onClick={() => handleSelectCountry(country.iso2)}
              className="w-full px-3 py-2.5 text-left hover:bg-gray-50 flex items-center justify-between text-sm"
            >
              <span>{country.name}</span>
              <span className="text-gray-400 text-xs">{country.iso2}</span>
            </button>
          ))}
        </div>
      )}

      {/* No results */}
      {search && filteredCountries.length === 0 && !selectedCountry && (
        <div className="mt-4 text-center py-4">
          <p className="text-gray-500 text-sm">No countries found for &quot;{search}&quot;</p>
        </div>
      )}

      {/* Selected country results */}
      {selectedCountry && (
        <div className="mt-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900">
              Distributors in {selectedCountryName}
            </h3>
            <span className="text-sm text-gray-500">{countryDistributors.length} found</span>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-turbo-navy" />
            </div>
          ) : countryDistributors.length > 0 ? (
            <div className="space-y-2">
              {countryDistributors.map((distributor) => (
                <button
                  key={distributor.id}
                  onClick={() => onDistributorSelect(distributor)}
                  className="w-full p-3 bg-gray-50 hover:bg-turbo-blue-pale rounded-lg text-left transition-colors"
                >
                  <p className="font-medium text-gray-900 text-sm">
                    {distributor.name}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {distributor.city && `${distributor.city}, `}
                    {distributor.countries?.length || 0} countries
                  </p>
                </button>
              ))}
            </div>
          ) : (
            <div className="bg-yellow-50 rounded-lg p-4 text-center">
              <p className="text-yellow-800 text-sm mb-3">
                No distributor listed yet for {selectedCountryName}.
              </p>
              <a
                href="https://turbomedusa.com/contact"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary text-sm inline-flex"
              >
                Contact TurboMed
              </a>
            </div>
          )}
        </div>
      )}

      {/* Initial state hint */}
      {!search && !selectedCountry && (
        <p className="mt-3 text-sm text-gray-500 text-center">
          Enter your country to find authorized distributors
        </p>
      )}
    </>
  )
}
