import type { DistributorWithCoverage } from '@/types'
import { Globe, Mail, Phone, MapPin, ExternalLink, ChevronRight } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import Image from 'next/image'

interface DistributorCardProps {
  distributor: DistributorWithCoverage
  onClick?: () => void
}

export function DistributorCard({ distributor, onClick }: DistributorCardProps) {
  const countriesCount = distributor.countries?.length || 0
  const displayCountries = distributor.countries?.slice(0, 5) || []

  return (
    <div
      className="card p-5 cursor-pointer hover:shadow-card-hover transition-shadow"
      onClick={onClick}
    >
      <div className="flex items-start gap-4">
        {/* Logo */}
        {distributor.logo_url ? (
          <div className="w-14 h-14 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
            <Image
              src={distributor.logo_url}
              alt={`${distributor.name} logo`}
              width={56}
              height={56}
              className="w-full h-full object-contain"
            />
          </div>
        ) : (
          <div className="w-14 h-14 rounded-lg bg-turbo-blue-pale flex items-center justify-center flex-shrink-0">
            <Globe className="w-7 h-7 text-turbo-navy" />
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate">{distributor.name}</h3>

          {/* Location */}
          {(distributor.city || distributor.country_hq) && (
            <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              {[distributor.city, distributor.state_region, distributor.country_hq]
                .filter(Boolean)
                .join(', ')}
            </p>
          )}

          {/* Countries */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {displayCountries.map((country) => (
              <Badge key={country.iso2} variant="default">
                {country.name}
              </Badge>
            ))}
            {countriesCount > 5 && (
              <Badge variant="info">+{countriesCount - 5} more</Badge>
            )}
          </div>

          {/* Quick contact links */}
          <div className="flex flex-wrap items-center gap-4 mt-3 text-sm">
            {distributor.website_url && (
              <a
                href={distributor.website_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-turbo-blue hover:underline"
                onClick={(e) => e.stopPropagation()}
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Website
              </a>
            )}
            {distributor.email && (
              <a
                href={`mailto:${distributor.email}`}
                className="flex items-center gap-1 text-turbo-blue hover:underline"
                onClick={(e) => e.stopPropagation()}
              >
                <Mail className="w-3.5 h-3.5" />
                Email
              </a>
            )}
            {distributor.phone && (
              <a
                href={`tel:${distributor.phone}`}
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
