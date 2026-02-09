'use client'

import { useCallback, useState } from 'react'
import Map, { Marker, NavigationControl, GeolocateControl } from 'react-map-gl/mapbox'
import { MapPin, Search } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import 'mapbox-gl/dist/mapbox-gl.css'

interface MapPickerProps {
  latitude: number
  longitude: number
  onChange: (lat: number, lng: number) => void
}

export function MapPicker({ latitude, longitude, onChange }: MapPickerProps) {
  const [viewState, setViewState] = useState({
    latitude: latitude || 40,
    longitude: longitude || -100,
    zoom: latitude ? 10 : 2,
  })
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)

  const handleMapClick = useCallback(
    (event: any) => {
      const { lngLat } = event
      onChange(lngLat.lat, lngLat.lng)
    },
    [onChange]
  )

  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    setIsSearching(true)
    try {
      // Use Mapbox Geocoding API
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          searchQuery
        )}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}&limit=1`
      )
      const data = await response.json()

      if (data.features && data.features.length > 0) {
        const [lng, lat] = data.features[0].center
        onChange(lat, lng)
        setViewState({
          latitude: lat,
          longitude: lng,
          zoom: 12,
        })
      }
    } catch (error) {
      console.error('Geocoding failed:', error)
    } finally {
      setIsSearching(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSearch()
    }
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="flex gap-2">
        <div className="flex-1">
          <Input
            placeholder="Search for an address or place..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
          />
        </div>
        <Button
          type="button"
          variant="secondary"
          onClick={handleSearch}
          isLoading={isSearching}
        >
          <Search className="w-4 h-4" />
        </Button>
      </div>

      {/* Map */}
      <div className="h-[400px] rounded-lg overflow-hidden border border-gray-200">
        <Map
          {...viewState}
          onMove={(evt) => setViewState(evt.viewState)}
          onClick={handleMapClick}
          mapStyle="mapbox://styles/mapbox/streets-v12"
          mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
          style={{ width: '100%', height: '100%' }}
        >
          <NavigationControl position="top-right" />
          <GeolocateControl position="top-right" />

          {latitude && longitude && (
            <Marker
              latitude={latitude}
              longitude={longitude}
              anchor="bottom"
            >
              <div className="map-marker">
                <MapPin className="w-4 h-4" />
              </div>
            </Marker>
          )}
        </Map>
      </div>

      {/* Coordinates display */}
      <div className="flex gap-4">
        <div className="flex-1">
          <label className="label">Latitude</label>
          <Input
            type="number"
            step="any"
            value={latitude || ''}
            onChange={(e) => onChange(parseFloat(e.target.value) || 0, longitude)}
            placeholder="e.g., 40.7128"
          />
        </div>
        <div className="flex-1">
          <label className="label">Longitude</label>
          <Input
            type="number"
            step="any"
            value={longitude || ''}
            onChange={(e) => onChange(latitude, parseFloat(e.target.value) || 0)}
            placeholder="e.g., -74.0060"
          />
        </div>
      </div>

      <p className="text-sm text-gray-500">
        Click on the map to set the distributor&apos;s pin location, or search for an address.
      </p>
    </div>
  )
}
