import { z } from 'zod'

export const distributorLocationSchema = z.object({
  id: z.string().uuid().optional(),
  label: z.string().max(255).default(''),
  address: z.string().max(500).default(''),
  city: z.string().max(100).default(''),
  state_region: z.string().max(100).default(''),
  country: z.string().max(100).default(''),
  location_lat: z.coerce.number().min(-90).max(90).default(0),
  location_lng: z.coerce.number().min(-180).max(180).default(0),
  is_primary: z.coerce.boolean().default(false),
})

export const distributorSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255),
  status: z.enum(['published', 'unpublished']).default('unpublished'),
  description: z.string().max(5000).optional().nullable(),
  logo_url: z.string().url().optional().nullable().or(z.literal('')),
  website_url: z.string().url().optional().nullable().or(z.literal('')),
  email: z.string().email().optional().nullable().or(z.literal('')),
  phone: z.string().max(50).optional().nullable(),
  address_line1: z.string().max(255).optional().nullable(),
  address_line2: z.string().max(255).optional().nullable(),
  city: z.string().max(100).optional().nullable(),
  state_region: z.string().max(100).optional().nullable(),
  postal_code: z.string().max(20).optional().nullable(),
  country_hq: z.string().length(2).optional().nullable().or(z.literal('')),
  location_lat: z.coerce.number().min(-90).max(90),
  location_lng: z.coerce.number().min(-180).max(180),
  regions_served: z.array(z.string()).default([]),
  languages_supported: z.array(z.string()).default([]),
  products_supported: z.array(z.string()).default([]),
  service_types: z.array(z.string()).default([]),
  priority_rank: z.number().int().min(0).max(1000).default(100),
  country_coverage: z.array(z.string()).default([]),
  locations: z.array(distributorLocationSchema).default([]),
})

export const countrySchema = z.object({
  iso2: z.string().length(2),
  name: z.string().min(1).max(100),
  region: z.string().optional().nullable(),
  synonyms: z.array(z.string()).default([]),
})

export const adminUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(1).max(255).optional(),
  role: z.enum(['admin', 'editor', 'viewer']).default('viewer'),
})

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

export const csvDistributorRowSchema = z.object({
  name: z.string().min(1),
  status: z.enum(['published', 'unpublished']).optional(),
  description: z.string().optional(),
  website_url: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  address_line1: z.string().optional(),
  address_line2: z.string().optional(),
  city: z.string().optional(),
  state_region: z.string().optional(),
  postal_code: z.string().optional(),
  country_hq: z.string().optional(),
  location_lat: z.coerce.number(),
  location_lng: z.coerce.number(),
  regions_served: z.string().optional(), // Comma-separated
  languages_supported: z.string().optional(), // Comma-separated
  products_supported: z.string().optional(), // Comma-separated
  service_types: z.string().optional(), // Comma-separated
  priority_rank: z.coerce.number().optional(),
  countries: z.string().optional(), // Comma-separated ISO2 codes
})

export type DistributorLocationInput = z.infer<typeof distributorLocationSchema>
export type DistributorInput = z.infer<typeof distributorSchema>
export type CountryInput = z.infer<typeof countrySchema>
export type AdminUserInput = z.infer<typeof adminUserSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type CSVDistributorRow = z.infer<typeof csvDistributorRowSchema>

// ==================== CLINIC VALIDATORS ====================

export const clinicLocationSchema = z.object({
  id: z.string().uuid().optional(),
  label: z.string().max(255).default(''),
  address: z.string().max(500).default(''),
  city: z.string().max(100).default(''),
  state_region: z.string().max(100).default(''),
  country: z.string().max(100).default(''),
  postal_code: z.string().max(20).default(''),
  location_lat: z.coerce.number().min(-90).max(90).default(0),
  location_lng: z.coerce.number().min(-180).max(180).default(0),
  is_primary: z.coerce.boolean().default(false),
})

// Public signup form schema (minimal required fields)
export const clinicSignupSchema = z.object({
  name: z.string().min(1, 'Clinic name is required').max(255),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(1, 'Phone number is required').max(50),
  website_url: z.string().url().optional().nullable().or(z.literal('')),
  locations: z.array(clinicLocationSchema).min(1, 'At least one location is required'),
})

// Admin edit schema (full access)
export const clinicSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255),
  status: z.enum(['pending', 'approved', 'rejected']).default('pending'),
  email: z.string().email('Valid email is required'),
  phone: z.string().max(50).optional().nullable(),
  website_url: z.string().url().optional().nullable().or(z.literal('')),
  address_line1: z.string().max(255).optional().nullable(),
  city: z.string().max(100).optional().nullable(),
  state_region: z.string().max(100).optional().nullable(),
  postal_code: z.string().max(20).optional().nullable(),
  country: z.string().max(100).optional().nullable(),
  location_lat: z.coerce.number().min(-90).max(90).optional().nullable(),
  location_lng: z.coerce.number().min(-180).max(180).optional().nullable(),
  rejection_reason: z.string().max(1000).optional().nullable(),
  locations: z.array(clinicLocationSchema).default([]),
})

// Review action schema
export const clinicReviewSchema = z.object({
  action: z.enum(['approve', 'reject']),
  rejection_reason: z.string().max(1000).optional().nullable(),
})

export type ClinicLocationInput = z.infer<typeof clinicLocationSchema>
export type ClinicSignupInput = z.infer<typeof clinicSignupSchema>
export type ClinicInput = z.infer<typeof clinicSchema>
export type ClinicReviewInput = z.infer<typeof clinicReviewSchema>

// ==================== KNOWLEDGEBASE VALIDATORS ====================

export const kbCategorySchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  description: z.string().max(500).optional().nullable(),
  icon: z.string().max(50).optional().nullable(),
  sort_order: z.coerce.number().int().min(0).default(0),
})

export const kbArticleSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255),
  content_type: z.enum(['article', 'product_doc']).default('article'),
  category_id: z.string().uuid().optional().nullable().or(z.literal('')),
  content: z.string().min(1, 'Content is required'),
  excerpt: z.string().max(500).optional().nullable(),
  featured_image_url: z.string().url().optional().nullable().or(z.literal('')),
  status: z.enum(['draft', 'published']).default('draft'),
  tags: z.array(z.string()).default([]),
  meta_title: z.string().max(255).optional().nullable(),
  meta_description: z.string().max(500).optional().nullable(),
  sort_order: z.coerce.number().int().min(0).default(0),
})

export const kbFaqSchema = z.object({
  question: z.string().min(1, 'Question is required'),
  answer: z.string().min(1, 'Answer is required'),
  category_id: z.string().uuid().optional().nullable().or(z.literal('')),
  status: z.enum(['draft', 'published']).default('draft'),
  sort_order: z.coerce.number().int().min(0).default(0),
})

export type KbCategoryInput = z.infer<typeof kbCategorySchema>
export type KbArticleInput = z.infer<typeof kbArticleSchema>
export type KbFaqInput = z.infer<typeof kbFaqSchema>
