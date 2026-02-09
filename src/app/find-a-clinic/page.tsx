'use client'

import { useState, useEffect, useCallback } from 'react'
import { usePublicClinics } from '@/hooks/useClinics'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ClinicMap } from '@/components/clinic/ClinicMap'
import { ClinicList } from '@/components/clinic/ClinicList'
import type { ClinicWithLocations } from '@/types'
import { Loader2, Search } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

// Calculate distance between two coordinates in miles using Haversine formula
function getDistanceMiles(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 3959 // Earth's radius in miles
  const dLat = (lat2 - lat1) * (Math.PI / 180)
  const dLng = (lng2 - lng1) * (Math.PI / 180)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

// Check if a string looks like a zip code (5 digits or 5+4 format)
function looksLikeZipCode(str: string): boolean {
  return /^\d{5}(-\d{4})?$/.test(str.trim())
}

export default function FindAClinicPage() {
  const { data: clinics, isLoading } = usePublicClinics()
  const [selectedClinicId, setSelectedClinicId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [searchLocation, setSearchLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [isMobile, setIsMobile] = useState(false)

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Geocode a search query (zip code or address)
  const geocodeSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchLocation(null)
      return
    }

    // Only geocode if it looks like a zip code or address (has numbers or commas)
    const isZip = looksLikeZipCode(query)
    const hasNumbers = /\d/.test(query)
    const hasComma = query.includes(',')

    if (!isZip && !hasNumbers && !hasComma) {
      // Likely just a name search, don't geocode
      setSearchLocation(null)
      return
    }

    setIsSearching(true)
    try {
      // Build geocoding URL - for zip codes, search without type restriction for better results
      const url = isZip
        ? `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}&country=US&limit=1`
        : `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}&types=address,place,postcode&country=US&limit=1`

      const response = await fetch(url)
      const data = await response.json()

      if (data.features && data.features.length > 0) {
        const [lng, lat] = data.features[0].center
        setSearchLocation({ lat, lng })
      } else {
        setSearchLocation(null)
      }
    } catch (error) {
      console.error('Geocoding failed:', error)
      setSearchLocation(null)
    } finally {
      setIsSearching(false)
    }
  }, [])

  const handleClinicSelect = (clinic: ClinicWithLocations | null) => {
    setSelectedClinicId(clinic?.id || null)
  }

  // Handle search - geocode on Enter or button click
  const handleSearch = () => {
    geocodeSearch(searchQuery)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSearch()
    }
  }

  // Clear search location when query is cleared
  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    if (!value.trim()) {
      setSearchLocation(null)
    }
  }

  // Filter clinics based on search
  const filteredClinics = clinics?.filter((clinic) => {
    const query = searchQuery.toLowerCase().trim()

    // If we have a geocoded location, filter by distance (100 miles)
    if (searchLocation) {
      // First check the clinic_locations table
      if (clinic.locations && clinic.locations.length > 0) {
        const matchingLocation = clinic.locations.some((loc) => {
          if (!loc.location_lat || !loc.location_lng) return false
          const distance = getDistanceMiles(
            searchLocation.lat,
            searchLocation.lng,
            Number(loc.location_lat),
            Number(loc.location_lng)
          )
          return distance <= 100
        })
        if (matchingLocation) return true
      }

      // Fallback: check legacy location fields on clinic record
      if (clinic.location_lat && clinic.location_lng) {
        const distance = getDistanceMiles(
          searchLocation.lat,
          searchLocation.lng,
          Number(clinic.location_lat),
          Number(clinic.location_lng)
        )
        if (distance <= 100) return true
      }

      return false
    }

    // If no geocoded location, do text-based filtering
    if (!query) return true

    return (
      clinic.name.toLowerCase().includes(query) ||
      (clinic.locations?.some(
        (loc) =>
          loc.city?.toLowerCase().includes(query) ||
          loc.state_region?.toLowerCase().includes(query) ||
          loc.country?.toLowerCase().includes(query) ||
          loc.postal_code?.toLowerCase().includes(query)
      ) ?? false)
    )
  })

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Map section - full width, above the fold */}
        <section className="relative h-[60vh] lg:h-[70vh] min-h-[500px]">
          {isLoading ? (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin text-turbo-navy mx-auto mb-4" />
                <p className="text-gray-600">Loading clinic map...</p>
              </div>
            </div>
          ) : (
            <>
              <ClinicMap
                clinics={filteredClinics || []}
                selectedClinicId={selectedClinicId}
                onClinicSelect={handleClinicSelect}
                flyToLocation={searchLocation}
              />

              {/* Search panel overlay */}
              <div className="absolute top-4 left-4 z-10 w-80 max-w-[calc(100%-2rem)]">
                <div className="bg-white rounded-xl shadow-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Find a Clinic</h3>

                  {/* Search input with button */}
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        type="text"
                        placeholder="Search by name, city, or zip code..."
                        value={searchQuery}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="pl-9"
                      />
                    </div>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={handleSearch}
                      isLoading={isSearching}
                      disabled={!searchQuery.trim()}
                    >
                      Go
                    </Button>
                  </div>

                  {/* Results count and search context */}
                  <div className="mt-3">
                    {searchLocation ? (
                      <p className="text-sm text-gray-500">
                        {filteredClinics?.length || 0} clinic{filteredClinics?.length !== 1 ? 's' : ''} within 100 miles
                      </p>
                    ) : filteredClinics ? (
                      <p className="text-sm text-gray-500">
                        {filteredClinics.length} clinic{filteredClinics.length !== 1 ? 's' : ''} found
                      </p>
                    ) : null}
                  </div>
                </div>
              </div>
            </>
          )}
        </section>

        {/* Clinic list section */}
        <ClinicList
          clinics={filteredClinics || []}
          onClinicSelect={(c) => setSelectedClinicId(c.id)}
        />
      </main>

      <Footer />
    </div>
  )
}
