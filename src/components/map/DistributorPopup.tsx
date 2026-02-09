import type { DistributorWithCoverage, DistributorLocation } from '@/types'
import { Globe, Mail, Phone, MapPin, ExternalLink, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import Image from 'next/image'
import { useMemo } from 'react'

interface DistributorPopupProps {
  distributor: DistributorWithCoverage
  locationId?: string
}

export function DistributorPopup({ distributor, locationId }: DistributorPopupProps) {
  const countriesCount = distributor.countries?.length || 0
  const displayCountries = distributor.countries?.slice(0, 3) || []
  const locationsCount = distributor.locations?.length || 0

  // Find the specific location that was clicked
  const selectedLocation: DistributorLocation | undefined = useMemo(() => {
    if (locationId && distributor.locations?.length) {
      return distributor.locations.find((loc) => loc.id === locationId)
    }
    // Fallback to primary location or first location
    return distributor.locations?.find((loc) => loc.is_primary) || distributor.locations?.[0]
  }, [locationId, distributor.locations])

  // Get address info from the selected location or fall back to distributor fields
  const locationLabel = selectedLocation?.label
  const displayCity = selectedLocation?.city || distributor.city
  const displayStateRegion = selectedLocation?.state_region || distributor.state_region
  const displayCountry = selectedLocation?.country || distributor.country_hq
  const displayAddress = selectedLocation?.address || distributor.address_line1

  return (
    <div className="w-80">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-start gap-3">
          {distributor.logo_url ? (
            <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
              <Image
                src={distributor.logo_url}
                alt={`${distributor.name} logo`}
                width={48}
                height={48}
                className="w-full h-full object-contain"
              />
            </div>
          ) : (
            <div className="w-12 h-12 rounded-lg bg-turbo-blue-pale flex items-center justify-center flex-shrink-0">
              <Globe className="w-6 h-6 text-turbo-navy" />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-gray-900">{distributor.name}</h3>
            {locationLabel && (
              <p className="text-xs text-turbo-blue font-medium">{locationLabel}</p>
            )}
            {locationsCount > 1 && (
              <p className="text-sm text-gray-500">
                {locationsCount} locations
              </p>
            )}
            <p className="text-sm text-gray-500">
              Servicing {countriesCount} {countriesCount === 1 ? 'country' : 'countries'}
            </p>
          </div>
        </div>
      </div>

      {/* Countries */}
      {countriesCount > 0 && (
        <div className="px-4 py-3 border-b border-gray-100">
          <div className="flex flex-wrap gap-1.5">
            {displayCountries.map((country) => (
              <span
                key={country.iso2}
                className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded-full"
              >
                {country.name}
              </span>
            ))}
            {countriesCount > 3 && (
              <span className="px-2 py-0.5 text-turbo-blue text-xs">
                +{countriesCount - 3} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Contact info */}
      <div className="p-4 space-y-2.5">
        {distributor.website_url && (
          <a
            href={distributor.website_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-turbo-blue transition-colors"
          >
            <ExternalLink className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">{new URL(distributor.website_url).hostname}</span>
          </a>
        )}
        {distributor.email && (
          <a
            href={`mailto:${distributor.email}`}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-turbo-blue transition-colors"
          >
            <Mail className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">{distributor.email}</span>
          </a>
        )}
        {distributor.phone && (
          <a
            href={`tel:${distributor.phone}`}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-turbo-blue transition-colors"
          >
            <Phone className="w-4 h-4 flex-shrink-0" />
            <span>{distributor.phone}</span>
          </a>
        )}
        {(displayAddress || displayCity || displayStateRegion || displayCountry) && (
          <div className="flex items-start gap-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <div>
              {displayAddress && <div>{displayAddress}</div>}
              {(displayCity || displayStateRegion || displayCountry) && (
                <div>
                  {[displayCity, displayStateRegion, displayCountry]
                    .filter(Boolean)
                    .join(', ')}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="p-4 pt-0 space-y-2">
        {distributor.email && (
          <a
            href={`mailto:${distributor.email}?subject=Inquiry from TurboMed Distributor Page`}
            className="btn-primary w-full text-center text-sm"
          >
            Contact Distributor
            <ChevronRight className="w-4 h-4" />
          </a>
        )}
        {!distributor.email && distributor.website_url && (
          <a
            href={distributor.website_url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary w-full text-center text-sm"
          >
            Visit Website
            <ExternalLink className="w-4 h-4" />
          </a>
        )}
      </div>
    </div>
  )
}
