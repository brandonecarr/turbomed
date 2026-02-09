'use client'

import type { ClinicWithLocations, ClinicLocation } from '@/types'
import { Building2, Mail, Phone, MapPin, ExternalLink, ChevronRight } from 'lucide-react'
import { useMemo } from 'react'

interface ClinicPopupProps {
  clinic: ClinicWithLocations
  locationId?: string
}

export function ClinicPopup({ clinic, locationId }: ClinicPopupProps) {
  const locationsCount = clinic.locations?.length || 0

  // Find the specific location that was clicked
  const selectedLocation: ClinicLocation | undefined = useMemo(() => {
    if (locationId && clinic.locations?.length) {
      return clinic.locations.find((loc) => loc.id === locationId)
    }
    // Fallback to primary location or first location
    return clinic.locations?.find((loc) => loc.is_primary) || clinic.locations?.[0]
  }, [locationId, clinic.locations])

  // Get address info from the selected location or fall back to clinic fields
  const locationLabel = selectedLocation?.label
  const displayCity = selectedLocation?.city || clinic.city
  const displayStateRegion = selectedLocation?.state_region || clinic.state_region
  const displayCountry = selectedLocation?.country || clinic.country
  const displayAddress = selectedLocation?.address || clinic.address_line1

  return (
    <div className="w-80">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-lg bg-turbo-blue-pale flex items-center justify-center flex-shrink-0">
            <Building2 className="w-6 h-6 text-turbo-navy" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-gray-900">{clinic.name}</h3>
            {locationLabel && (
              <p className="text-xs text-turbo-blue font-medium">{locationLabel}</p>
            )}
            {locationsCount > 1 && (
              <p className="text-sm text-gray-500">
                {locationsCount} locations
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Contact info */}
      <div className="p-4 space-y-2.5">
        {clinic.website_url && (
          <a
            href={clinic.website_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-turbo-blue transition-colors"
          >
            <ExternalLink className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">{new URL(clinic.website_url).hostname}</span>
          </a>
        )}
        {clinic.email && (
          <a
            href={`mailto:${clinic.email}`}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-turbo-blue transition-colors"
          >
            <Mail className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">{clinic.email}</span>
          </a>
        )}
        {clinic.phone && (
          <a
            href={`tel:${clinic.phone}`}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-turbo-blue transition-colors"
          >
            <Phone className="w-4 h-4 flex-shrink-0" />
            <span>{clinic.phone}</span>
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
        {clinic.email && (
          <a
            href={`mailto:${clinic.email}?subject=Inquiry from TurboMed Clinic Finder`}
            className="btn-primary w-full text-center text-sm"
          >
            Contact Clinic
            <ChevronRight className="w-4 h-4" />
          </a>
        )}
        {!clinic.email && clinic.website_url && (
          <a
            href={clinic.website_url}
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
