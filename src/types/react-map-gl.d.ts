declare module 'react-map-gl/mapbox' {
  import * as React from 'react'
  import type { Map as MapboxMap, LngLatBoundsLike, LngLatLike, MapboxOptions } from 'mapbox-gl'

  export interface ViewState {
    latitude: number
    longitude: number
    zoom: number
    bearing?: number
    pitch?: number
    padding?: { top: number; bottom: number; left: number; right: number }
  }

  export interface MapProps extends Partial<ViewState> {
    mapboxAccessToken?: string
    mapStyle?: string | object
    style?: React.CSSProperties
    children?: React.ReactNode
    onMove?: (evt: { viewState: ViewState }) => void
    onClick?: (evt: any) => void
    onLoad?: (evt: any) => void
    ref?: React.Ref<any>
    minZoom?: number
    maxZoom?: number
    initialViewState?: Partial<ViewState>
    [key: string]: any
  }

  export interface MarkerProps {
    latitude: number
    longitude: number
    anchor?: 'center' | 'left' | 'right' | 'top' | 'bottom' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
    children?: React.ReactNode
    onClick?: (evt: any) => void
    [key: string]: any
  }

  export interface PopupProps {
    latitude: number
    longitude: number
    anchor?: 'center' | 'left' | 'right' | 'top' | 'bottom' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
    offset?: number | [number, number] | { [key: string]: [number, number] }
    children?: React.ReactNode
    onClose?: () => void
    closeButton?: boolean
    closeOnClick?: boolean
    className?: string
    [key: string]: any
  }

  export interface NavigationControlProps {
    position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
    showCompass?: boolean
    showZoom?: boolean
    visualizePitch?: boolean
  }

  export interface GeolocateControlProps {
    position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
    trackUserLocation?: boolean
    showUserHeading?: boolean
    showUserLocation?: boolean
  }

  declare const Map: React.FC<MapProps>
  declare const Marker: React.FC<MarkerProps>
  declare const Popup: React.FC<PopupProps>
  declare const NavigationControl: React.FC<NavigationControlProps>
  declare const GeolocateControl: React.FC<GeolocateControlProps>

  export default Map
  export { Map, Marker, Popup, NavigationControl, GeolocateControl }
}
