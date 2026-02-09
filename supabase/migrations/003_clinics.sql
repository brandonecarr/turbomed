-- TurboMed Distributors - Clinics Migration
-- Run this migration in Supabase SQL Editor

-- Clinics table
CREATE TABLE IF NOT EXISTS clinics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  website_url TEXT,
  -- Primary/HQ address (legacy support)
  address_line1 VARCHAR(255),
  city VARCHAR(100),
  state_region VARCHAR(100),
  postal_code VARCHAR(20),
  country VARCHAR(100),
  location_lat DECIMAL(10, 8),
  location_lng DECIMAL(11, 8),
  -- Submission tracking
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID REFERENCES admin_users(id),
  rejection_reason TEXT,
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Clinic locations table (multiple locations per clinic)
CREATE TABLE IF NOT EXISTS clinic_locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  label VARCHAR(255),
  address TEXT,
  city VARCHAR(100),
  state_region VARCHAR(100),
  country VARCHAR(100),
  postal_code VARCHAR(20),
  location_lat DECIMAL(10, 8) NOT NULL,
  location_lng DECIMAL(11, 8) NOT NULL,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_clinics_status ON clinics(status);
CREATE INDEX IF NOT EXISTS idx_clinics_location ON clinics(location_lat, location_lng);
CREATE INDEX IF NOT EXISTS idx_clinics_slug ON clinics(slug);
CREATE INDEX IF NOT EXISTS idx_clinic_locations_clinic ON clinic_locations(clinic_id);
CREATE INDEX IF NOT EXISTS idx_clinic_locations_coords ON clinic_locations(location_lat, location_lng);
CREATE INDEX IF NOT EXISTS idx_clinic_locations_primary ON clinic_locations(clinic_id, is_primary);

-- Trigger for updated_at on clinics
DROP TRIGGER IF EXISTS update_clinics_updated_at ON clinics;
CREATE TRIGGER update_clinics_updated_at
  BEFORE UPDATE ON clinics
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger for updated_at on clinic_locations
DROP TRIGGER IF EXISTS update_clinic_locations_updated_at ON clinic_locations;
CREATE TRIGGER update_clinic_locations_updated_at
  BEFORE UPDATE ON clinic_locations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE clinics ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinic_locations ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (for idempotent migrations)
DROP POLICY IF EXISTS "Public can read approved clinics" ON clinics;
DROP POLICY IF EXISTS "Public can submit clinics" ON clinics;
DROP POLICY IF EXISTS "Public can read locations for approved clinics" ON clinic_locations;
DROP POLICY IF EXISTS "Public can insert clinic locations" ON clinic_locations;
DROP POLICY IF EXISTS "Service role full access clinics" ON clinics;
DROP POLICY IF EXISTS "Service role full access clinic_locations" ON clinic_locations;

-- Public can read approved clinics only
CREATE POLICY "Public can read approved clinics"
  ON clinics FOR SELECT
  USING (status = 'approved');

-- Public can insert new clinic submissions (for signup form)
CREATE POLICY "Public can submit clinics"
  ON clinics FOR INSERT
  WITH CHECK (status = 'pending');

-- Public can read locations for approved clinics
CREATE POLICY "Public can read locations for approved clinics"
  ON clinic_locations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM clinics
      WHERE clinics.id = clinic_locations.clinic_id
      AND clinics.status = 'approved'
    )
  );

-- Public can insert locations for their pending clinic submission
CREATE POLICY "Public can insert clinic locations"
  ON clinic_locations FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM clinics
      WHERE clinics.id = clinic_locations.clinic_id
      AND clinics.status = 'pending'
    )
  );

-- Service role full access
CREATE POLICY "Service role full access clinics"
  ON clinics FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role full access clinic_locations"
  ON clinic_locations FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Function to ensure only one primary location per clinic (reuse existing function)
-- The ensure_single_primary_location function should already exist from distributor_locations migration
-- If not, create it:
CREATE OR REPLACE FUNCTION ensure_single_primary_clinic_location()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_primary = true THEN
    UPDATE clinic_locations
    SET is_primary = false
    WHERE clinic_id = NEW.clinic_id
    AND id != NEW.id
    AND is_primary = true;
  END IF;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to ensure single primary location
DROP TRIGGER IF EXISTS ensure_single_primary_clinic ON clinic_locations;
CREATE TRIGGER ensure_single_primary_clinic
  AFTER INSERT OR UPDATE OF is_primary ON clinic_locations
  FOR EACH ROW
  WHEN (NEW.is_primary = true)
  EXECUTE FUNCTION ensure_single_primary_clinic_location();
