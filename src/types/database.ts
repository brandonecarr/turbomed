export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      distributors: {
        Row: {
          id: string
          name: string
          slug: string
          status: 'published' | 'unpublished'
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
          regions_served: string[]
          languages_supported: string[]
          products_supported: string[]
          service_types: string[]
          priority_rank: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          status?: 'published' | 'unpublished'
          description?: string | null
          logo_url?: string | null
          website_url?: string | null
          email?: string | null
          phone?: string | null
          address_line1?: string | null
          address_line2?: string | null
          city?: string | null
          state_region?: string | null
          postal_code?: string | null
          country_hq?: string | null
          location_lat: number
          location_lng: number
          regions_served?: string[]
          languages_supported?: string[]
          products_supported?: string[]
          service_types?: string[]
          priority_rank?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          status?: 'published' | 'unpublished'
          description?: string | null
          logo_url?: string | null
          website_url?: string | null
          email?: string | null
          phone?: string | null
          address_line1?: string | null
          address_line2?: string | null
          city?: string | null
          state_region?: string | null
          postal_code?: string | null
          country_hq?: string | null
          location_lat?: number
          location_lng?: number
          regions_served?: string[]
          languages_supported?: string[]
          products_supported?: string[]
          service_types?: string[]
          priority_rank?: number
          created_at?: string
          updated_at?: string
        }
      }
      countries: {
        Row: {
          iso2: string
          name: string
          region: string | null
          synonyms: string[]
        }
        Insert: {
          iso2: string
          name: string
          region?: string | null
          synonyms?: string[]
        }
        Update: {
          iso2?: string
          name?: string
          region?: string | null
          synonyms?: string[]
        }
      }
      distributor_country_coverage: {
        Row: {
          distributor_id: string
          country_iso2: string
        }
        Insert: {
          distributor_id: string
          country_iso2: string
        }
        Update: {
          distributor_id?: string
          country_iso2?: string
        }
      }
      admin_users: {
        Row: {
          id: string
          email: string
          password_hash: string
          name: string | null
          role: 'admin' | 'editor' | 'viewer'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          password_hash: string
          name?: string | null
          role?: 'admin' | 'editor' | 'viewer'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          password_hash?: string
          name?: string | null
          role?: 'admin' | 'editor' | 'viewer'
          created_at?: string
          updated_at?: string
        }
      }
      audit_log: {
        Row: {
          id: string
          user_id: string | null
          action: string
          entity_type: string
          entity_id: string | null
          changes: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          action: string
          entity_type: string
          entity_id?: string | null
          changes?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          action?: string
          entity_type?: string
          entity_id?: string | null
          changes?: Json | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
