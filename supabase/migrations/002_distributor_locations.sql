-- TurboMed Distributors - Multiple Locations Migration
-- Run this migration in Supabase SQL Editor

-- Distributor locations table (for distributors with multiple locations)
CREATE TABLE IF NOT EXISTS distributor_locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  distributor_id UUID NOT NULL REFERENCES distributors(id) ON DELETE CASCADE,
  label VARCHAR(255),
  address TEXT,
  city VARCHAR(100),
  state_region VARCHAR(100),
  country VARCHAR(100),
  location_lat DECIMAL(10, 8) NOT NULL,
  location_lng DECIMAL(11, 8) NOT NULL,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_locations_distributor ON distributor_locations(distributor_id);
CREATE INDEX IF NOT EXISTS idx_locations_coords ON distributor_locations(location_lat, location_lng);
CREATE INDEX IF NOT EXISTS idx_locations_primary ON distributor_locations(distributor_id, is_primary);

-- Trigger for updated_at
DROP TRIGGER IF EXISTS update_distributor_locations_updated_at ON distributor_locations;
CREATE TRIGGER update_distributor_locations_updated_at
  BEFORE UPDATE ON distributor_locations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE distributor_locations ENABLE ROW LEVEL SECURITY;

-- Public read access for locations of published distributors
CREATE POLICY "Public can read locations for published distributors"
  ON distributor_locations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM distributors
      WHERE distributors.id = distributor_locations.distributor_id
      AND distributors.status = 'published'
    )
  );

-- Service role full access
CREATE POLICY "Service role full access locations"
  ON distributor_locations FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Function to ensure only one primary location per distributor
CREATE OR REPLACE FUNCTION ensure_single_primary_location()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_primary = true THEN
    UPDATE distributor_locations
    SET is_primary = false
    WHERE distributor_id = NEW.distributor_id
    AND id != NEW.id
    AND is_primary = true;
  END IF;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to ensure single primary location
DROP TRIGGER IF EXISTS ensure_single_primary ON distributor_locations;
CREATE TRIGGER ensure_single_primary
  AFTER INSERT OR UPDATE OF is_primary ON distributor_locations
  FOR EACH ROW
  WHEN (NEW.is_primary = true)
  EXECUTE FUNCTION ensure_single_primary_location();

-- Migrate existing distributor location data to the new table
-- This creates a primary location for each existing distributor
INSERT INTO distributor_locations (distributor_id, label, address, city, state_region, location_lat, location_lng, is_primary)
SELECT
  id,
  'Headquarters' as label,
  address_line1 as address,
  city,
  state_region,
  location_lat,
  location_lng,
  true as is_primary
FROM distributors
WHERE NOT EXISTS (
  SELECT 1 FROM distributor_locations WHERE distributor_locations.distributor_id = distributors.id
);
