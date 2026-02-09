/**
 * Admin User Seed Script for TurboMed Distributors
 *
 * Run with: npm run seed:admin
 *
 * Make sure to set SUPABASE_SERVICE_ROLE_KEY and NEXT_PUBLIC_SUPABASE_URL
 * in your environment or .env.local file
 */

import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })
import { createClient } from '@supabase/supabase-js'
import bcrypt from 'bcryptjs'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Default admin credentials - CHANGE THESE IN PRODUCTION
const DEFAULT_ADMIN = {
  email: 'admin@turbomedusa.com',
  password: 'TurboMed2024!', // Change this immediately after first login
  name: 'TurboMed Admin',
  role: 'admin' as const,
}

async function seedAdmin() {
  console.log('Creating admin user...')

  // Check if admin already exists
  const { data: existing } = await supabase
    .from('admin_users')
    .select('id')
    .eq('email', DEFAULT_ADMIN.email)
    .single()

  if (existing) {
    console.log('Admin user already exists, skipping...')
    return
  }

  // Hash password
  const passwordHash = await bcrypt.hash(DEFAULT_ADMIN.password, 12)

  // Create admin user
  const { data, error } = await supabase.from('admin_users').insert({
    email: DEFAULT_ADMIN.email,
    password_hash: passwordHash,
    name: DEFAULT_ADMIN.name,
    role: DEFAULT_ADMIN.role,
  })

  if (error) {
    console.error('Failed to create admin user:', error)
    throw error
  }

  console.log('Admin user created successfully!')
  console.log('---')
  console.log(`Email: ${DEFAULT_ADMIN.email}`)
  console.log(`Password: ${DEFAULT_ADMIN.password}`)
  console.log('---')
  console.log('IMPORTANT: Change this password immediately after first login!')
}

seedAdmin()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Seed failed:', error)
    process.exit(1)
  })
