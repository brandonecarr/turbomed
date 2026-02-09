'use client'

import type { ClinicWithLocations } from '@/types'
import { Building2, Mail, Phone, MapPin, ExternalLink, ChevronRight } from 'lucide-react'

interface ClinicCardProps {
  clinic: ClinicWithLocations
  onClick?: () => void
}

export function ClinicCard({ clinic, onClick }: ClinicCardProps) {
  const locationsCount = clinic.locations?.length || 0
  const primaryLocation = clinic.locations?.find((l) => l.is_primary) || clinic.locations?.[0]

  // Get display address from primary location or clinic
  const displayCity = primaryLocation?.city || clinic.city
  const displayState = primaryLocation?.state_region || clinic.state_region
  const displayCountry = primaryLocation?.country || clinic.country

  return (
    <div
      className="card p-5 cursor-pointer hover:shadow-card-hover transition-shadow"
      onClick={onClick}
    >
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className="w-14 h-14 rounded-lg bg-turbo-blue-pale flex items-center justify-center flex-shrink-0">
          <Building2 className="w-7 h-7 text-turbo-navy" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate">{clinic.name}</h3>

          {/* Location */}
          {(displayCity || displayState || displayCountry) && (
            <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              {[displayCity, displayState, displayCountry]
                .filter(Boolean)
                .join(', ')}
            </p>
          )}

          {/* Locations count */}
          {locationsCount > 1 && (
            <p className="text-xs text-turbo-blue mt-1">
              {locationsCount} locations
            </p>
          )}

          {/* Quick contact links */}
          <div className="flex flex-wrap items-center gap-4 mt-3 text-sm">
            {clinic.website_url && (
              <a
                href={clinic.website_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-turbo-blue hover:underline"
                onClick={(e) => e.stopPropagation()}
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Website
              </a>
            )}
            {clinic.email && (
              <a
                href={`mailto:${clinic.email}`}
                className="flex items-center gap-1 text-turbo-blue hover:underline"
                onClick={(e) => e.stopPropagation()}
              >
                <Mail className="w-3.5 h-3.5" />
                Email
              </a>
            )}
            {clinic.phone && (
              <a
                href={`tel:${clinic.phone}`}
                className="flex items-center gap-1 text-turbo-blue hover:underline"
                onClick={(e) => e.stopPropagation()}
              >
                <Phone className="w-3.5 h-3.5" />
                Call
              </a>
            )}
          </div>
        </div>

        {/* Arrow indicator */}
        <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
      </div>
    </div>
  )
}
