'use client'

import { useState, useEffect } from 'react'
import { usePublicDistributors } from '@/hooks/useDistributors'
import { useCountries } from '@/hooks/useCountries'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { DistributorMap } from '@/components/map/DistributorMap'
import { CountryLookupPanel } from '@/components/map/CountryLookupPanel'
import { DistributorList } from '@/components/distributor/DistributorList'
import type { DistributorWithCoverage } from '@/types'
import { Loader2 } from 'lucide-react'

export default function FindADistributorPage() {
  const { data: distributors, isLoading: distributorsLoading } = usePublicDistributors()
  const { data: countries, isLoading: countriesLoading } = useCountries()
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null)
  const [selectedDistributorId, setSelectedDistributorId] = useState<string | null>(null)
  const [isMobile, setIsMobile] = useState(false)

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const handleCountrySelect = (iso2: string | null) => {
    setSelectedCountry(iso2)
    setSelectedDistributorId(null)
  }

  const handleDistributorSelect = (distributor: DistributorWithCoverage | null) => {
    setSelectedDistributorId(distributor?.id || null)
  }

  const isLoading = distributorsLoading || countriesLoading

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
                <p className="text-gray-600">Loading distributor map...</p>
              </div>
            </div>
          ) : (
            <>
              <DistributorMap
                distributors={distributors || []}
                selectedDistributorId={selectedDistributorId}
                onDistributorSelect={handleDistributorSelect}
              />
              <CountryLookupPanel
                countries={countries || []}
                distributors={distributors || []}
                selectedCountry={selectedCountry}
                onCountrySelect={handleCountrySelect}
                onDistributorSelect={(d) => {
                  setSelectedDistributorId(d.id)
                }}
                isMobile={isMobile}
              />
            </>
          )}
        </section>

        {/* Distributor list section */}
        <DistributorList
          distributors={distributors || []}
          onDistributorSelect={(d) => setSelectedDistributorId(d.id)}
        />
      </main>

      <Footer />
    </div>
  )
}
