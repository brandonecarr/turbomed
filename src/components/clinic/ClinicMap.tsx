'use client'

import { useRef, useState, useCallback, useMemo, useEffect, useLayoutEffect } from 'react'
import Map, { Marker, Popup, NavigationControl } from 'react-map-gl/mapbox'
import Supercluster from 'supercluster'
import { Building2 } from 'lucide-react'
import type { ClinicWithLocations, ClinicMapPoint, ClusterPoint, ClinicGeoJSONPoint } from '@/types'
import { ClinicPopup } from './ClinicPopup'
import 'mapbox-gl/dist/mapbox-gl.css'

interface PopupInfo {
  clinic: ClinicWithLocations
  locationId?: string
  lat: number
  lng: number
}

interface ClinicMapProps {
  clinics: ClinicWithLocations[]
  selectedClinicId?: string | null
  onClinicSelect?: (clinic: ClinicWithLocations | null) => void
  flyToLocation?: { lat: number; lng: number } | null
}

// Target view state (US centered)
const TARGET_VIEW = {
  latitude: 39,
  longitude: -98,
  zoom: 4,
}

// Starting view for spin animation (opposite side of globe)
const START_VIEW = {
  latitude: 39,
  longitude: 82, // Start on opposite side (180 degrees away from -98)
  zoom: 2,
}

export function ClinicMap({
  clinics,
  selectedClinicId,
  onClinicSelect,
  flyToLocation,
}: ClinicMapProps) {
  const mapRef = useRef<any>(null)
  // Track which clinic ID we've already handled to prevent re-flying
  const handledSelectionRef = useRef<string | null>(null)
  // Store the view state before zooming in, so we can restore it when popup closes
  const previousViewStateRef = useRef<{ latitude: number; longitude: number; zoom: number } | null>(null)
  // Track if initial spin animation has completed
  const hasSpunRef = useRef(false)
  const [viewState, setViewState] = useState(START_VIEW)
  const [popupInfo, setPopupInfo] = useState<PopupInfo | null>(null)

  // Handle map load - perform initial globe spin animation
  const handleMapLoad = useCallback(() => {
    if (hasSpunRef.current) return
    hasSpunRef.current = true

    const map = mapRef.current?.getMap()
    if (!map) return

    // Spin the globe and settle on the US
    map.flyTo({
      center: [TARGET_VIEW.longitude, TARGET_VIEW.latitude],
      zoom: TARGET_VIEW.zoom,
      duration: 4000,
      essential: true,
    })

    const onMoveEnd = () => {
      setViewState(TARGET_VIEW)
      map.off('moveend', onMoveEnd)
    }
    map.once('moveend', onMoveEnd)
  }, [])

  // Fly to a specific location when flyToLocation prop changes (e.g., zip code search)
  useEffect(() => {
    if (!flyToLocation) return

    const map = mapRef.current?.getMap()
    if (!map) return

    // Close any open popup
    setPopupInfo(null)

    // Fly to the location with zoom level 10
    map.flyTo({
      center: [flyToLocation.lng, flyToLocation.lat],
      zoom: 10,
      duration: 2000,
    })

    const onMoveEnd = () => {
      setViewState({
        latitude: flyToLocation.lat,
        longitude: flyToLocation.lng,
        zoom: 10,
      })
      map.off('moveend', onMoveEnd)
    }
    map.once('moveend', onMoveEnd)
  }, [flyToLocation])

  // Create GeoJSON points from clinics - with multiple locations support
  const points: ClinicMapPoint[] = useMemo(() => {
    const allPoints: ClinicMapPoint[] = []

    clinics.forEach((c) => {
      // If clinic has locations array with items, use those
      if (c.locations && c.locations.length > 0) {
        c.locations.forEach((loc) => {
          if (loc.location_lat && loc.location_lng) {
            allPoints.push({
              type: 'Feature',
              properties: {
                cluster: false,
                clinicId: c.id,
                locationId: loc.id,
                name: c.name,
                locationLabel: loc.label || undefined,
                status: c.status,
                isPrimary: loc.is_primary,
              },
              geometry: {
                type: 'Point',
                coordinates: [loc.location_lng, loc.location_lat],
              },
            })
          }
        })
      } else {
        // Fallback to legacy location_lat/lng fields
        if (c.location_lat && c.location_lng) {
          allPoints.push({
            type: 'Feature',
            properties: {
              cluster: false,
              clinicId: c.id,
              name: c.name,
              status: c.status,
              isPrimary: true,
            },
            geometry: {
              type: 'Point',
              coordinates: [c.location_lng, c.location_lat],
            },
          })
        }
      }
    })

    return allPoints
  }, [clinics])

  // Create supercluster instance
  const supercluster = useMemo(() => {
    const cluster = new Supercluster({
      radius: 60,
      maxZoom: 16,
    })
    cluster.load(points as any)
    return cluster
  }, [points])

  // Get clusters for current viewport
  const clusters = useMemo(() => {
    const bounds = mapRef.current?.getMap().getBounds()
    if (!bounds) return points

    const bbox: [number, number, number, number] = [
      bounds.getWest(),
      bounds.getSouth(),
      bounds.getEast(),
      bounds.getNorth(),
    ]

    return supercluster.getClusters(bbox, Math.floor(viewState.zoom)) as ClinicGeoJSONPoint[]
  }, [supercluster, viewState.zoom, points])

  // Close the popup and fly back to the previous view
  const closePopup = useCallback(() => {
    if (popupInfo) {
      setPopupInfo(null)
      onClinicSelect?.(null)
      // Fly back to the previous view state when popup closes
      if (previousViewStateRef.current) {
        const { latitude, longitude, zoom } = previousViewStateRef.current
        const map = mapRef.current?.getMap()
        if (map) {
          map.flyTo({
            center: [longitude, latitude],
            zoom,
            duration: 1500,
          })
          const onMoveEnd = () => {
            const center = map.getCenter()
            setViewState({
              latitude: center.lat,
              longitude: center.lng,
              zoom: map.getZoom(),
            })
            map.off('moveend', onMoveEnd)
          }
          map.once('moveend', onMoveEnd)
        }
        previousViewStateRef.current = null
      }
    }
  }, [popupInfo, onClinicSelect])

  // Fly to a location with animation
  // When showPopup is true, offset the center to account for the popup height
  const flyTo = useCallback((lat: number, lng: number, zoom: number, showPopup: boolean = false) => {
    const map = mapRef.current?.getMap()
    if (map) {
      map.flyTo({
        center: [lng, lat],
        zoom,
        duration: 1500,
        // Offset the center down by ~150px when showing popup so the popup is fully visible
        // The offset is [x, y] where positive y moves the center down (showing more above)
        offset: showPopup ? [0, 150] : [0, 0],
      })
      // Update viewState after animation completes to ensure clusters are recalculated
      const onMoveEnd = () => {
        const center = map.getCenter()
        setViewState({
          latitude: center.lat,
          longitude: center.lng,
          zoom: map.getZoom(),
        })
        map.off('moveend', onMoveEnd)
      }
      map.once('moveend', onMoveEnd)
    }
  }, [])

  // Handle marker click
  const handleMarkerClick = useCallback(
    (feature: ClinicGeoJSONPoint) => {
      if (feature.properties.cluster) {
        // Zoom into cluster with animation
        const clusterId = (feature as ClusterPoint).properties.cluster_id
        const zoom = supercluster.getClusterExpansionZoom(clusterId)
        flyTo(
          feature.geometry.coordinates[1],
          feature.geometry.coordinates[0],
          Math.min(zoom, 16)
        )
      } else {
        // Show popup for single clinic at the clicked location
        const point = feature as ClinicMapPoint
        const clinic = clinics.find((c) => c.id === point.properties.clinicId)
        if (clinic) {
          const [lng, lat] = point.geometry.coordinates
          // Mark this clinic as handled so the useEffect doesn't override
          handledSelectionRef.current = clinic.id
          // Save current view state before zooming in (get from map directly for accuracy)
          const map = mapRef.current?.getMap()
          if (map) {
            const center = map.getCenter()
            previousViewStateRef.current = {
              latitude: center.lat,
              longitude: center.lng,
              zoom: map.getZoom(),
            }
          }
          // Fly to the location with animation (with popup offset)
          flyTo(lat, lng, 10, true)
          setPopupInfo({
            clinic,
            locationId: point.properties.locationId,
            lat,
            lng,
          })
          onClinicSelect?.(clinic)
        }
      }
    },
    [clinics, supercluster, onClinicSelect, flyTo]
  )

  // Fly to clinic when selected externally (e.g., from list)
  // This only runs for external selections, not when clicking markers
  useEffect(() => {
    if (!selectedClinicId) {
      handledSelectionRef.current = null
      return
    }

    // If we already handled this selection (from marker click), skip
    if (handledSelectionRef.current === selectedClinicId) {
      return
    }

    const clinic = clinics.find((c) => c.id === selectedClinicId)
    if (clinic) {
      // Prefer primary location if available
      const primaryLoc = clinic.locations?.find((l) => l.is_primary)
      const firstLoc = clinic.locations?.[0]
      const loc = primaryLoc || firstLoc

      const lat = loc?.location_lat || clinic.location_lat
      const lng = loc?.location_lng || clinic.location_lng

      if (lat && lng) {
        // Save current view state before flying (for external selections)
        const map = mapRef.current?.getMap()
        if (map) {
          const center = map.getCenter()
          previousViewStateRef.current = {
            latitude: center.lat,
            longitude: center.lng,
            zoom: map.getZoom(),
          }
          // Fly to the location with animation (with popup offset)
          map.flyTo({
            center: [lng, lat],
            zoom: 10,
            duration: 1500,
            offset: [0, 150],
          })
          // Update viewState after animation completes
          const onMoveEnd = () => {
            const newCenter = map.getCenter()
            setViewState({
              latitude: newCenter.lat,
              longitude: newCenter.lng,
              zoom: map.getZoom(),
            })
            map.off('moveend', onMoveEnd)
          }
          map.once('moveend', onMoveEnd)
        }

        setPopupInfo({
          clinic,
          locationId: loc?.id,
          lat,
          lng,
        })
      }
    }
  }, [selectedClinicId, clinics])

  // Handle map click - close popup if clicking outside of markers
  const handleMapClick = useCallback((evt: any) => {
    // Check if the click was on the map itself (not on a marker or popup)
    // The originalEvent.target will be the canvas if clicking on the map
    const target = evt.originalEvent?.target
    if (target && target.tagName === 'CANVAS' && popupInfo) {
      closePopup()
    }
  }, [popupInfo, closePopup])

  return (
    <Map
      ref={mapRef}
      {...viewState}
      onMove={(evt) => setViewState(evt.viewState)}
      onLoad={handleMapLoad}
      onClick={handleMapClick}
      mapStyle="mapbox://styles/mapbox/light-v11"
      mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
      style={{ width: '100%', height: '100%' }}
      minZoom={1}
      maxZoom={18}
    >
      <NavigationControl position="top-right" />

      {clusters.map((feature, index) => {
        const [lng, lat] = feature.geometry.coordinates
        const isCluster = feature.properties.cluster

        if (isCluster) {
          const clusterFeature = feature as ClusterPoint
          const size = Math.min(
            40 + (clusterFeature.properties.point_count / clinics.length) * 30,
            70
          )

          return (
            <Marker
              key={`cluster-${clusterFeature.properties.cluster_id}`}
              latitude={lat}
              longitude={lng}
              anchor="center"
            >
              <div
                className="flex items-center justify-center text-white font-bold rounded-full bg-emerald-600 border-4 border-white shadow-lg cursor-pointer hover:scale-110 transition-transform"
                style={{ width: size, height: size }}
                onClick={() => handleMarkerClick(feature)}
              >
                {clusterFeature.properties.point_count}
              </div>
            </Marker>
          )
        }

        const point = feature as ClinicMapPoint
        const markerKey = point.properties.locationId
          ? `point-${point.properties.clinicId}-${point.properties.locationId}`
          : `point-${point.properties.clinicId}-${index}`
        return (
          <Marker
            key={markerKey}
            latitude={lat}
            longitude={lng}
            anchor="bottom"
          >
            <div
              className={`clinic-marker cursor-pointer ${point.properties.isPrimary ? 'ring-2 ring-yellow-400' : ''}`}
              onClick={() => handleMarkerClick(feature)}
              title={point.properties.locationLabel ? `${point.properties.name} - ${point.properties.locationLabel}` : point.properties.name}
            >
              <Building2 className="w-4 h-4" />
            </div>
          </Marker>
        )
      })}

      {popupInfo && (
        <Popup
          latitude={popupInfo.lat}
          longitude={popupInfo.lng}
          anchor="bottom"
          offset={30}
          onClose={closePopup}
          closeButton={true}
          closeOnClick={false}
          className="clinic-popup"
        >
          <ClinicPopup
            clinic={popupInfo.clinic}
            locationId={popupInfo.locationId}
          />
        </Popup>
      )}
    </Map>
  )
}
