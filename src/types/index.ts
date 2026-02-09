export type DistributorStatus = 'published' | 'unpublished'

export type Region =
  | 'North America'
  | 'South America'
  | 'Europe'
  | 'Middle East'
  | 'Africa'
  | 'Asia'
  | 'Oceania'

export type ProductLine =
  | 'Classic+'
  | 'Frontier'
  | 'Summit'
  | 'Pediatric'
  | 'AT-X'
  | 'Parts/Options'

export type ServiceType =
  | 'Clinic/Orthotic'
  | 'Retail'
  | 'Online Store'
  | 'Insurance Help'
  | 'Rehab/Hospital'

export type AdminRole = 'admin' | 'editor' | 'viewer'

export interface Distributor {
  id: string
  name: string
  slug: string
  status: DistributorStatus
  description: string | null
  logo_url: string | null
  website_url: string | null
  email: string | null
  phone: string | null
  address_line1: string | null
  address_line2: string | null
  city: string | null
  state_region: string | null
  postal_code: string | null
  country_hq: string | null
  location_lat: number
  location_lng: number
  regions_served: Region[]
  languages_supported: string[]
  products_supported: ProductLine[]
  service_types: ServiceType[]
  priority_rank: number
  created_at: string
  updated_at: string
  countries?: Country[]
  locations?: DistributorLocation[]
}

export interface Country {
  iso2: string
  name: string
  region: Region | null
  synonyms: string[]
}

export interface DistributorCountryCoverage {
  distributor_id: string
  country_iso2: string
}

export interface AdminUser {
  id: string
  email: string
  name: string | null
  role: AdminRole
  created_at: string
  updated_at: string
}

export interface AuditLogEntry {
  id: string
  user_id: string | null
  action: string
  entity_type: string
  entity_id: string | null
  changes: Record<string, unknown> | null
  created_at: string
  user?: AdminUser
}

export interface DistributorLocation {
  id: string
  distributor_id: string
  label: string | null
  address: string | null
  city: string | null
  state_region: string | null
  country: string | null
  location_lat: number
  location_lng: number
  is_primary: boolean
  created_at: string
  updated_at: string
}

export interface DistributorLocationInput {
  id?: string
  label: string
  address: string
  city: string
  state_region: string
  country: string
  location_lat: number
  location_lng: number
  is_primary: boolean
}

// Form types
export interface DistributorFormData {
  name: string
  status: DistributorStatus
  description: string
  logo_url: string
  website_url: string
  email: string
  phone: string
  address_line1: string
  address_line2: string
  city: string
  state_region: string
  postal_code: string
  country_hq: string
  location_lat: number
  location_lng: number
  regions_served: Region[]
  languages_supported: string[]
  products_supported: ProductLine[]
  service_types: ServiceType[]
  priority_rank: number
  country_coverage: string[]
  locations: DistributorLocationInput[]
}

// API response types
export interface DistributorWithCoverage extends Distributor {
  countries: Country[]
  locations: DistributorLocation[]
}

export interface CountryWithDistributors extends Country {
  distributors: Distributor[]
}

// Map types
export interface MapPoint {
  type: 'Feature'
  properties: {
    cluster: false
    distributorId: string
    locationId?: string
    name: string
    locationLabel?: string
    status: DistributorStatus
    isPrimary?: boolean
  }
  geometry: {
    type: 'Point'
    coordinates: [number, number]
  }
}

export interface ClusterPoint {
  type: 'Feature'
  properties: {
    cluster: true
    cluster_id: number
    point_count: number
    point_count_abbreviated: string
  }
  geometry: {
    type: 'Point'
    coordinates: [number, number]
  }
}

export type GeoJSONPoint = MapPoint | ClusterPoint

// Filter types
export interface DistributorFilters {
  search: string
  region: Region | null
  products: ProductLine[]
  languages: string[]
  serviceTypes: ServiceType[]
  countryIso2: string | null
}

export const REGIONS: Region[] = [
  'North America',
  'South America',
  'Europe',
  'Middle East',
  'Africa',
  'Asia',
  'Oceania',
]

export const PRODUCT_LINES: ProductLine[] = [
  'Classic+',
  'Frontier',
  'Summit',
  'Pediatric',
  'AT-X',
  'Parts/Options',
]

export const SERVICE_TYPES: ServiceType[] = [
  'Clinic/Orthotic',
  'Retail',
  'Online Store',
  'Insurance Help',
  'Rehab/Hospital',
]

export const COMMON_LANGUAGES = [
  'English',
  'Spanish',
  'French',
  'German',
  'Portuguese',
  'Italian',
  'Dutch',
  'Polish',
  'Russian',
  'Chinese',
  'Japanese',
  'Korean',
  'Arabic',
  'Hindi',
  'Turkish',
  'Hebrew',
  'Swedish',
  'Norwegian',
  'Danish',
  'Finnish',
]

// ==================== CLINIC TYPES ====================

export type ClinicStatus = 'pending' | 'approved' | 'rejected'

export interface Clinic {
  id: string
  name: string
  slug: string
  status: ClinicStatus
  email: string
  phone: string | null
  website_url: string | null
  address_line1: string | null
  city: string | null
  state_region: string | null
  postal_code: string | null
  country: string | null
  location_lat: number | null
  location_lng: number | null
  submitted_at: string
  reviewed_at: string | null
  reviewed_by: string | null
  rejection_reason: string | null
  created_at: string
  updated_at: string
  locations?: ClinicLocation[]
}

export interface ClinicLocation {
  id: string
  clinic_id: string
  label: string | null
  address: string | null
  city: string | null
  state_region: string | null
  country: string | null
  postal_code: string | null
  location_lat: number
  location_lng: number
  is_primary: boolean
  created_at: string
  updated_at: string
}

export interface ClinicLocationInput {
  id?: string
  label: string
  address: string
  city: string
  state_region: string
  country: string
  postal_code: string
  location_lat: number
  location_lng: number
  is_primary: boolean
}

export interface ClinicWithLocations extends Clinic {
  locations: ClinicLocation[]
}

// For public signup form (minimal required fields)
export interface ClinicSignupData {
  name: string
  email: string
  phone: string
  website_url?: string
  locations: ClinicLocationInput[]
}

// Form types for admin
export interface ClinicFormData {
  name: string
  status: ClinicStatus
  email: string
  phone: string
  website_url: string
  address_line1: string
  city: string
  state_region: string
  postal_code: string
  country: string
  location_lat: number | null
  location_lng: number | null
  rejection_reason: string
  locations: ClinicLocationInput[]
}

// Clinic map point type
export interface ClinicMapPoint {
  type: 'Feature'
  properties: {
    cluster: false
    clinicId: string
    locationId?: string
    name: string
    locationLabel?: string
    status: ClinicStatus
    isPrimary?: boolean
  }
  geometry: {
    type: 'Point'
    coordinates: [number, number]
  }
}

export type ClinicGeoJSONPoint = ClinicMapPoint | ClusterPoint

// Filter types for clinics
export interface ClinicFilters {
  search: string
  city: string | null
  state: string | null
  country: string | null
}

// ==================== KNOWLEDGEBASE TYPES ====================

export type KbArticleStatus = 'draft' | 'published'
export type KbContentType = 'article' | 'product_doc'

export interface KbCategory {
  id: string
  name: string
  slug: string
  description: string | null
  icon: string | null
  sort_order: number
  created_at: string
  updated_at: string
}

export interface KbArticle {
  id: string
  title: string
  slug: string
  category_id: string | null
  content_type: KbContentType
  content: string
  excerpt: string | null
  featured_image_url: string | null
  status: KbArticleStatus
  tags: string[]
  meta_title: string | null
  meta_description: string | null
  sort_order: number
  author_id: string | null
  published_at: string | null
  created_at: string
  updated_at: string
  category?: KbCategory
}

export interface KbFaq {
  id: string
  question: string
  answer: string
  category_id: string | null
  status: KbArticleStatus
  sort_order: number
  created_at: string
  updated_at: string
  category?: KbCategory
}

export interface KbArticleFormData {
  title: string
  content_type: KbContentType
  category_id: string
  content: string
  excerpt: string
  featured_image_url: string
  status: KbArticleStatus
  tags: string[]
  meta_title: string
  meta_description: string
  sort_order: number
}

export interface KbFaqFormData {
  question: string
  answer: string
  category_id: string
  status: KbArticleStatus
  sort_order: number
}

export interface KbCategoryFormData {
  name: string
  description: string
  icon: string
  sort_order: number
}
