'use client'

import { useState, useCallback } from 'react'
import Map, { Marker, NavigationControl, GeolocateControl } from 'react-map-gl/mapbox'
import { MapPin, Search, Plus, Trash2, Star, GripVertical, MapPinned, AlertCircle } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import type { DistributorLocationInput, ClinicLocationInput } from '@/types'

// Union type for both distributor and clinic locations
type LocationInput = DistributorLocationInput | ClinicLocationInput
import 'mapbox-gl/dist/mapbox-gl.css'

interface LocationsManagerProps {
  locations: LocationInput[]
  onChange: (locations: LocationInput[]) => void
}

const emptyLocation: LocationInput = {
  label: '',
  address: '',
  city: '',
  state_region: '',
  country: '',
  postal_code: '',
  location_lat: 0,
  location_lng: 0,
  is_primary: false,
}

export function LocationsManager({ locations, onChange }: LocationsManagerProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(
    locations.length > 0 ? 0 : null
  )
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [isGeocoding, setIsGeocoding] = useState(false)

  // Calculate center of map based on all locations
  const getMapCenter = () => {
    if (locations.length === 0) {
      return { latitude: 40, longitude: -100, zoom: 2 }
    }
    if (selectedIndex !== null && locations[selectedIndex]) {
      const loc = locations[selectedIndex]
      if (loc.location_lat && loc.location_lng) {
        return { latitude: loc.location_lat, longitude: loc.location_lng, zoom: 10 }
      }
    }
    // Find first location with valid coords
    const validLoc = locations.find((l) => l.location_lat && l.location_lng)
    if (validLoc) {
      return { latitude: validLoc.location_lat, longitude: validLoc.location_lng, zoom: 6 }
    }
    return { latitude: 40, longitude: -100, zoom: 2 }
  }

  const [viewState, setViewState] = useState(getMapCenter())

  const handleMapClick = useCallback(
    (event: any) => {
      if (selectedIndex === null) return
      const { lngLat } = event
      const updatedLocations = [...locations]
      updatedLocations[selectedIndex] = {
        ...updatedLocations[selectedIndex],
        location_lat: lngLat.lat,
        location_lng: lngLat.lng,
      }
      onChange(updatedLocations)
    },
    [locations, onChange, selectedIndex]
  )

  const handleSearch = async () => {
    if (!searchQuery.trim() || selectedIndex === null) return

    setIsSearching(true)
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          searchQuery
        )}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}&limit=1`
      )
      const data = await response.json()

      if (data.features && data.features.length > 0) {
        const [lng, lat] = data.features[0].center
        const placeName = data.features[0].place_name || ''

        const updatedLocations = [...locations]
        updatedLocations[selectedIndex] = {
          ...updatedLocations[selectedIndex],
          location_lat: lat,
          location_lng: lng,
          address: placeName,
        }
        onChange(updatedLocations)
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

  // Geocode the current location's address fields
  const geocodeCurrentAddress = async () => {
    if (selectedIndex === null) return
    const loc = locations[selectedIndex]

    // Build address string from fields
    const addressParts = [loc.address, loc.city, loc.state_region, loc.country].filter(Boolean)
    if (addressParts.length === 0) return

    const addressString = addressParts.join(', ')
    setIsGeocoding(true)

    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          addressString
        )}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}&limit=1`
      )
      const data = await response.json()

      if (data.features && data.features.length > 0) {
        const [lng, lat] = data.features[0].center

        const updatedLocations = [...locations]
        updatedLocations[selectedIndex] = {
          ...updatedLocations[selectedIndex],
          location_lat: lat,
          location_lng: lng,
        }
        onChange(updatedLocations)
        setViewState({
          latitude: lat,
          longitude: lng,
          zoom: 12,
        })
      }
    } catch (error) {
      console.error('Geocoding failed:', error)
    } finally {
      setIsGeocoding(false)
    }
  }

  const addLocation = () => {
    const newLocation = { ...emptyLocation }
    // If this is the first location, make it primary
    if (locations.length === 0) {
      newLocation.is_primary = true
    }
    const newLocations = [...locations, newLocation]
    onChange(newLocations)
    setSelectedIndex(newLocations.length - 1)
  }

  const removeLocation = (index: number) => {
    const updatedLocations = locations.filter((_, i) => i !== index)
    // If we removed the primary location, make the first one primary
    if (locations[index]?.is_primary && updatedLocations.length > 0) {
      updatedLocations[0].is_primary = true
    }
    onChange(updatedLocations)
    if (selectedIndex === index) {
      setSelectedIndex(updatedLocations.length > 0 ? 0 : null)
    } else if (selectedIndex !== null && selectedIndex > index) {
      setSelectedIndex(selectedIndex - 1)
    }
  }

  const setPrimary = (index: number) => {
    const updatedLocations = locations.map((loc, i) => ({
      ...loc,
      is_primary: i === index,
    }))
    onChange(updatedLocations)
  }

  const updateLocation = (index: number, field: keyof LocationInput, value: any) => {
    const updatedLocations = [...locations]
    updatedLocations[index] = {
      ...updatedLocations[index],
      [field]: value,
    }
    onChange(updatedLocations)
  }

  const selectedLocation = selectedIndex !== null ? locations[selectedIndex] : null

  return (
    <div className="space-y-4">
      {/* Location list */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="label">Locations</label>
          <Button type="button" variant="secondary" size="sm" onClick={addLocation}>
            <Plus className="w-4 h-4" />
            Add Location
          </Button>
        </div>

        {locations.length === 0 ? (
          <div className="text-center py-8 border border-dashed border-gray-300 rounded-lg">
            <MapPin className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500">No locations added yet</p>
            <Button type="button" variant="secondary" size="sm" className="mt-2" onClick={addLocation}>
              Add First Location
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-2 max-h-[200px] overflow-y-auto">
            {locations.map((loc, index) => (
              <div
                key={loc.id || index}
                onClick={() => {
                  setSelectedIndex(index)
                  if (loc.location_lat && loc.location_lng) {
                    setViewState({
                      latitude: loc.location_lat,
                      longitude: loc.location_lng,
                      zoom: 10,
                    })
                  }
                }}
                className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-colors ${
                  selectedIndex === index
                    ? 'border-turbo-navy bg-turbo-navy/5'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <GripVertical className="w-4 h-4 text-gray-400" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm truncate">
                      {loc.label || `Location ${index + 1}`}
                    </span>
                    {loc.is_primary && (
                      <span className="px-2 py-0.5 text-xs bg-turbo-navy text-white rounded-full">
                        Primary
                      </span>
                    )}
                    {(!loc.location_lat || !loc.location_lng) && (
                      <span className="px-2 py-0.5 text-xs bg-amber-100 text-amber-700 rounded-full flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        No coords
                      </span>
                    )}
                  </div>
                  {(loc.city || loc.country) && (
                    <span className="text-xs text-gray-500 truncate block">
                      {[loc.city, loc.state_region, loc.country].filter(Boolean).join(', ')}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  {!loc.is_primary && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        setPrimary(index)
                      }}
                      title="Set as primary location"
                    >
                      <Star className="w-4 h-4" />
                    </Button>
                  )}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      removeLocation(index)
                    }}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Map and location details */}
      {selectedIndex !== null && selectedLocation && (
        <>
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
          <div className="h-[350px] rounded-lg overflow-hidden border border-gray-200">
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

              {locations.map((loc, index) =>
                loc.location_lat && loc.location_lng ? (
                  <Marker
                    key={loc.id || index}
                    latitude={loc.location_lat}
                    longitude={loc.location_lng}
                    anchor="bottom"
                    onClick={(e) => {
                      e.originalEvent.stopPropagation()
                      setSelectedIndex(index)
                    }}
                  >
                    <div
                      className={`map-marker ${
                        index === selectedIndex ? 'bg-turbo-navy' : 'bg-gray-500'
                      } ${loc.is_primary ? 'ring-2 ring-yellow-400' : ''}`}
                    >
                      <MapPin className="w-4 h-4" />
                    </div>
                  </Marker>
                ) : null
              )}
            </Map>
          </div>

          {/* Location details form */}
          <Card>
            <CardContent className="pt-4 space-y-4">
              {/* Warning when coordinates are missing */}
              {(!selectedLocation.location_lat || !selectedLocation.location_lng) && (
                <div className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-amber-800 font-medium">Coordinates required</p>
                    <p className="text-sm text-amber-700 mt-1">
                      This location needs coordinates to appear on the map. Fill in the address details below and click &quot;Geocode Address&quot;, or click on the map to set the pin manually.
                    </p>
                  </div>
                </div>
              )}

              <Input
                label="Location Label"
                placeholder="e.g., Headquarters, Regional Office, Warehouse"
                value={selectedLocation.label}
                onChange={(e) => updateLocation(selectedIndex, 'label', e.target.value)}
              />

              <Input
                label="Address"
                placeholder="Full address"
                value={selectedLocation.address}
                onChange={(e) => updateLocation(selectedIndex, 'address', e.target.value)}
              />

              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <Input
                  label="City"
                  placeholder="City"
                  value={selectedLocation.city}
                  onChange={(e) => updateLocation(selectedIndex, 'city', e.target.value)}
                />
                <Input
                  label="State/Region"
                  placeholder="State"
                  value={selectedLocation.state_region}
                  onChange={(e) => updateLocation(selectedIndex, 'state_region', e.target.value)}
                />
                <Input
                  label="Zip/Postal Code"
                  placeholder="12345"
                  value={'postal_code' in selectedLocation ? selectedLocation.postal_code || '' : ''}
                  onChange={(e) => updateLocation(selectedIndex, 'postal_code', e.target.value)}
                />
                <Input
                  label="Country"
                  placeholder="Country"
                  value={selectedLocation.country}
                  onChange={(e) => updateLocation(selectedIndex, 'country', e.target.value)}
                />
                <div className="flex gap-2">
                  <Input
                    label="Lat"
                    type="number"
                    step="any"
                    value={selectedLocation.location_lat || ''}
                    onChange={(e) =>
                      updateLocation(selectedIndex, 'location_lat', parseFloat(e.target.value) || 0)
                    }
                  />
                  <Input
                    label="Lng"
                    type="number"
                    step="any"
                    value={selectedLocation.location_lng || ''}
                    onChange={(e) =>
                      updateLocation(selectedIndex, 'location_lng', parseFloat(e.target.value) || 0)
                    }
                  />
                </div>
              </div>

              {/* Geocode button */}
              <Button
                type="button"
                variant="secondary"
                onClick={geocodeCurrentAddress}
                isLoading={isGeocoding}
                disabled={!selectedLocation.city && !selectedLocation.address && !selectedLocation.country}
              >
                <MapPinned className="w-4 h-4" />
                Geocode Address
              </Button>
            </CardContent>
          </Card>

          <p className="text-sm text-gray-500">
            Click on the map to set the location pin, or search for an address.
            {locations.length > 1 && ' Click on a marker to select that location.'}
          </p>
        </>
      )}
    </div>
  )
}
