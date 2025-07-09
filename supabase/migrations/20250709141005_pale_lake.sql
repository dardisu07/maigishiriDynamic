/*
  # Add Cable TV Service Tables

  1. New Tables
    - `cable_providers` - Store cable TV providers (DSTV, GOTV, STARTIME)
    - `cable_plans` - Store cable TV subscription plans with pricing

  2. Security
    - Enable RLS on both tables
    - Add policies for public read access to active records
    - Add policies for admin management

  3. Default Data
    - Insert initial cable providers and plans from NaijaDataSub
*/

-- Create cable_providers table
CREATE TABLE IF NOT EXISTS cable_providers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  external_id integer UNIQUE NOT NULL,
  name text UNIQUE NOT NULL,
  is_active boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create cable_plans table
CREATE TABLE IF NOT EXISTS cable_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  external_id integer UNIQUE NOT NULL,
  cable_provider_id uuid REFERENCES cable_providers(id) ON DELETE CASCADE,
  name text NOT NULL,
  cost_price numeric NOT NULL,
  selling_price numeric NOT NULL,
  profit_margin numeric DEFAULT 0,
  is_active boolean DEFAULT true,
  is_popular boolean DEFAULT false,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE cable_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE cable_plans ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for cable_providers
CREATE POLICY "Anyone can read active cable providers"
  ON cable_providers
  FOR SELECT
  TO authenticated, anon
  USING (is_active = true);

CREATE POLICY "Admins can manage cable providers"
  ON cable_providers
  FOR ALL
  TO authenticated
  USING (is_admin_user());

-- Create RLS policies for cable_plans
CREATE POLICY "Anyone can read active cable plans"
  ON cable_plans
  FOR SELECT
  TO authenticated, anon
  USING (is_active = true);

CREATE POLICY "Admins can manage cable plans"
  ON cable_plans
  FOR ALL
  TO authenticated
  USING (is_admin_user());

-- Create indexes
CREATE INDEX IF NOT EXISTS cable_providers_external_id_idx ON cable_providers(external_id);
CREATE INDEX IF NOT EXISTS cable_providers_name_idx ON cable_providers(name);
CREATE INDEX IF NOT EXISTS cable_providers_active_idx ON cable_providers(is_active);

CREATE INDEX IF NOT EXISTS cable_plans_external_id_idx ON cable_plans(external_id);
CREATE INDEX IF NOT EXISTS cable_plans_cable_provider_id_idx ON cable_plans(cable_provider_id);
CREATE INDEX IF NOT EXISTS cable_plans_active_idx ON cable_plans(is_active);
CREATE INDEX IF NOT EXISTS cable_plans_popular_idx ON cable_plans(is_popular);

-- Create triggers for updated_at
CREATE TRIGGER update_cable_providers_updated_at 
  BEFORE UPDATE ON cable_providers 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cable_plans_updated_at 
  BEFORE UPDATE ON cable_plans 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert initial cable providers
INSERT INTO cable_providers (external_id, name, sort_order) VALUES
  (1, 'GOTV', 1),
  (2, 'DSTV', 2),
  (3, 'STARTIME', 3)
ON CONFLICT (external_id) DO NOTHING;

-- Get provider IDs for reference in cable plans
DO $$
DECLARE
  gotv_id uuid;
  dstv_id uuid;
  startime_id uuid;
BEGIN
  SELECT id INTO gotv_id FROM cable_providers WHERE name = 'GOTV';
  SELECT id INTO dstv_id FROM cable_providers WHERE name = 'DSTV';
  SELECT id INTO startime_id FROM cable_providers WHERE name = 'STARTIME';

  -- Insert DSTV plans
  INSERT INTO cable_plans (external_id, cable_provider_id, name, cost_price, selling_price, sort_order) VALUES
    (47, dstv_id, 'DStv Padi', 3600, 3600, 1),
    (48, dstv_id, 'DStv Yanga', 5100, 5100, 2),
    (49, dstv_id, 'Dstv Confam', 9300, 9300, 3),
    (50, dstv_id, 'DStv Compact', 15700, 15700, 4),
    (51, dstv_id, 'DStv Premium', 37000, 37000, 5),
    (52, dstv_id, 'DStv Asia', 9900, 9900, 6),
    (53, dstv_id, 'DStv Compact Plus', 25000, 25000, 7),
    (54, dstv_id, 'DStv Premium-French', 45600, 45600, 8),
    (55, dstv_id, 'DStv Premium-Asia', 33000, 33000, 9),
    (56, dstv_id, 'DStv Confam + ExtraView', 11400, 11400, 10),
    (57, dstv_id, 'DStv Yanga + ExtraView', 8200, 8200, 11),
    (58, dstv_id, 'DStv Padi + ExtraView', 6950, 6950, 12),
    (59, dstv_id, 'DStv Compact + Asia', 22400, 22400, 13),
    (60, dstv_id, 'DStv Compact + Extra View', 16500, 16500, 14),
    (61, dstv_id, 'DStv Compact + French Touch', 17100, 17100, 15),
    (62, dstv_id, 'DStv Premium + Extra View', 33500, 33500, 16),
    (63, dstv_id, 'DStv Compact Plus + Asia', 29700, 29700, 17),
    (64, dstv_id, 'DStv Compact + French Touch + ExtraView', 21100, 21100, 18),
    (65, dstv_id, 'DStv Compact + Asia + ExtraView', 26400, 26400, 19),
    (66, dstv_id, 'DStv Compact Plus + French Plus', 35900, 35900, 20),
    (67, dstv_id, 'DStv Compact Plus + French Touch', 24400, 24400, 21),
    (68, dstv_id, 'DStv Compact Plus + Extra View', 23800, 23800, 22),
    (69, dstv_id, 'DStv Compact Plus + FrenchPlus + Extra View', 39900, 39900, 23),
    (70, dstv_id, 'DStv Compact + French Plus', 28600, 28600, 24),
    (71, dstv_id, 'DStv Compact Plus + Asia + ExtraView', 33700, 33700, 25),
    (72, dstv_id, 'DStv Premium + Asia + Extra View', 43400, 43400, 26),
    (73, dstv_id, 'DStv Premium + French + Extra View', 40700, 40700, 27),
    (74, dstv_id, 'DStv French Plus Add-on', 16100, 16100, 28),
    (75, dstv_id, 'DStv Asian Add-on', 9900, 9900, 29),
    (76, dstv_id, 'DStv Great Wall Standalone Bouquet', 2500, 2500, 30),
    (77, dstv_id, 'DStv French Touch Add-on', 4600, 4600, 31),
    (78, dstv_id, 'ExtraView Access', 4000, 4000, 32),
    (79, dstv_id, 'DStv French', 7200, 7200, 33),
    (80, dstv_id, 'DStv Asian Bouquet E36', 9900, 9900, 34),
    (81, dstv_id, 'DStv Yanga + Showmax', 5650, 5650, 35),
    (82, dstv_id, 'DStv Great Wall Standalone Bouquet + Showmax', 4950, 4950, 36),
    (83, dstv_id, 'DStv Compact Plus + Showmax', 21250, 21250, 37),
    (84, dstv_id, 'Dstv Confam + Showmax', 8850, 8850, 38),
    (85, dstv_id, 'DStv Compact + Showmax', 13950, 13950, 39),
    (86, dstv_id, 'DStv Padi + Showmax', 5850, 5850, 40),
    (87, dstv_id, 'DStv Premium + Asia + Showmax', 33000, 33000, 41),
    (88, dstv_id, 'DStv Premium + French + Showmax', 45600, 45600, 42),
    (89, dstv_id, 'DStv Premium + Showmax', 29500, 29500, 43),
    (90, dstv_id, 'DStv Premium Streaming Subscription', 29500, 29500, 44),
    (91, dstv_id, 'DStv Prestige', 590000, 590000, 45),
    (92, dstv_id, 'DStv Yanga OTT Streaming Subscription', 4200, 4200, 46),
    (93, dstv_id, 'DStv Compact Plus Streaming Subscription', 19800, 19800, 47),
    (94, dstv_id, 'DStv Compact Streaming Subscription', 12500, 12500, 48),
    (95, dstv_id, 'DStv Comfam Streaming Subscription', 7400, 7400, 49),
    (96, dstv_id, 'DStv Padi', 2950, 2950, 50)
  ON CONFLICT (external_id) DO NOTHING;

  -- Insert GOTV plans
  INSERT INTO cable_plans (external_id, cable_provider_id, name, cost_price, selling_price, sort_order) VALUES
    (97, gotv_id, 'GOtv Max', 7200, 7200, 1),
    (98, gotv_id, 'GOtv Jolli', 4850, 4850, 2),
    (99, gotv_id, 'GOtv Jinja', 3300, 3300, 3),
    (100, gotv_id, 'GOtv Smallie - monthly', 1575, 1575, 4),
    (101, gotv_id, 'GOtv Smallie - quarterly', 3450, 3450, 5),
    (102, gotv_id, 'GOtv Smallie - yearly', 10200, 10200, 6),
    (103, gotv_id, 'GOtv Supa - monthly', 9600, 9600, 7),
    (104, gotv_id, 'GOtv Supa Plus - monthly', 15700, 15700, 8)
  ON CONFLICT (external_id) DO NOTHING;

  -- Insert STARTIME plans
  INSERT INTO cable_plans (external_id, cable_provider_id, name, cost_price, selling_price, sort_order) VALUES
    (106, startime_id, 'Nova (Dish) 1 Month', 1700, 1700, 1),
    (107, startime_id, 'Basic (Antenna) 1 Month', 3000, 3000, 2),
    (108, startime_id, 'Smart (Dish) 1 Month', 3800, 3800, 3),
    (109, startime_id, 'Classic (Antenna) 1 Month', 5000, 5000, 4),
    (110, startime_id, 'Super (Dish) 1 Month', 7500, 7500, 5),
    (111, startime_id, 'Nova (Antenna) 1 Week', 500, 500, 6),
    (112, startime_id, 'Basic (Antenna) 1 Week', 1000, 1000, 7),
    (113, startime_id, 'Smart (Dish) 1 Week', 1300, 1300, 8),
    (114, startime_id, 'Classic (Antenna) 1 Week', 1500, 1500, 9),
    (115, startime_id, 'Super (Dish) 1 Week', 2500, 2500, 10),
    (116, startime_id, 'Chinese (Dish) 1 month', 14000, 14000, 11),
    (117, startime_id, 'Nova (Antenna) 1 Month', 1700, 1700, 12),
    (118, startime_id, 'Special (Dish) 1 Week', 1800, 1800, 13),
    (119, startime_id, 'Special (Dish) 1 Month', 5600, 5600, 14),
    (120, startime_id, 'Nova (Dish) - 1 Week', 600, 600, 15),
    (121, startime_id, 'Super (Antenna) 1 Week', 2500, 2500, 16),
    (122, startime_id, 'Super (Antenna) 1 Month', 7500, 7500, 17),
    (123, startime_id, 'Combo Smart and Basic (Dish) 1 Week', 1300, 1300, 18),
    (124, startime_id, 'Combo Special and Basic (Dish) 1 Week', 1800, 1800, 19),
    (125, startime_id, 'Combo Super and Classic (Dish) 1 Week', 2500, 2500, 20),
    (126, startime_id, 'Combo Smart and Basic (Dish) 1 Month', 3800, 3800, 21),
    (127, startime_id, 'Combo Special and Basic (Dish) 1 Month', 5600, 5600, 22),
    (128, startime_id, 'Combo Super and Classic (Dish) 1 Month', 7500, 7500, 23)
  ON CONFLICT (external_id) DO NOTHING;
END $$;

-- Update beneficiaries table to allow 'cable' type
DO $$
BEGIN
  -- Check if the constraint exists
  IF EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'beneficiaries_type_check' 
    AND conrelid = 'beneficiaries'::regclass
  ) THEN
    -- Drop the existing constraint
    ALTER TABLE beneficiaries DROP CONSTRAINT beneficiaries_type_check;
    
    -- Add the new constraint with 'cable' included
    ALTER TABLE beneficiaries 
    ADD CONSTRAINT beneficiaries_type_check 
    CHECK (type IN ('airtime', 'data', 'cable'));
  END IF;
EXCEPTION
  WHEN undefined_table THEN
    -- Table doesn't exist yet, constraint will be added in another migration
    NULL;
END $$;

-- Add admin setting for cable profit margin
INSERT INTO admin_settings (key, value, description) VALUES
  ('cable_plan_profit_margin', '5', 'Default profit margin percentage for cable plans')
ON CONFLICT (key) DO NOTHING;

-- Mark some popular plans
UPDATE cable_plans SET is_popular = true WHERE external_id IN (50, 53, 97, 103, 109, 110);