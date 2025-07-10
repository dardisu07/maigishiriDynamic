-- First, identify which external_ids already exist in the database
CREATE TEMPORARY TABLE existing_external_ids AS
SELECT external_id FROM data_plans WHERE external_id IS NOT NULL;

-- Create a temporary table to store the mapping of plans to new external_ids
CREATE TEMPORARY TABLE temp_plan_mapping (
  id uuid,
  network text,
  size text,
  validity text,
  plan_type text,
  new_external_id integer,
  new_cost_price numeric,
  new_selling_price numeric,
  should_update boolean DEFAULT true
);

-- Insert mappings for MTN plans
INSERT INTO temp_plan_mapping (network, size, validity, plan_type, new_external_id, new_cost_price, new_selling_price) VALUES
  ('MTN', '110.0 MB', '%', '', 427, 100, 105),
  ('MTN', '230.0 MB', '%', '', 428, 195, 205),
  ('MTN', '500.0 MB', '%30 DAY%', '', 477, 475, 500),
  ('MTN', '750.0 MB', '%', '', 429, 427, 449),
  ('MTN', '500.0 MB', '%7 DAY%', '', 431, 473, 498),
  ('MTN', '1.0 GB', '%1 DAY%', '', 430, 474, 499),
  ('MTN', '1.5 GB', '%2 DAY%', '', 432, 565, 595),
  ('MTN', '1.0 GB', '%30 day%', '', 482, 950, 1000),
  ('MTN', '1.2 GB', '%', '', 433, 708, 745),
  ('MTN', '2.5 GB', '%1 DAY%', '', 434, 708, 745),
  ('MTN', '2.0 GB', '%2 DAY%', '', 435, 708, 745),
  ('MTN', '1.0 GB', '%7 DAY%', '', 436, 746, 785),
  ('MTN', '2.5 GB', '%2 DAY%', '', 437, 841, 885),
  ('MTN', '1.5 GB', '%7 DAY%', '', 438, 945, 995),
  ('MTN', '3.2 GB', '%', '', 439, 948, 998),
  ('MTN', '2.0 GB', '%30 DAY%', '', 440, 1411, 1485),
  ('MTN', '1.8 GB', '%', '', 441, 1411, 1485),
  ('MTN', '6.0 GB', '%', '', 442, 2361, 2485),
  ('MTN', '11.0 GB', '%', '', 444, 3273, 3445),
  ('MTN', '14.5 GB', '%', '', 445, 4711, 4959),
  ('MTN', '40.0 GB', '%', '', 447, 8408, 8850),
  ('MTN', '32.0 GB', '%', '', 448, 10308, 10850),
  ('MTN', '75.0 GB', '%', '', 449, 16958, 17850),
  ('MTN', '90.0 GB', '%', '', 450, 23228, 24450),
  ('MTN', '165.0 GB', '%', '', 451, 32775, 34500),
  ('MTN', '150.0 GB', '%', '', 452, 37478, 39450),
  ('MTN', '250.0 GB', '%', '', 453, 51253, 53950),
  ('MTN', '480.0 GB', '%', '', 454, 83458, 87850);

-- Insert mappings for MTN SME plans
INSERT INTO temp_plan_mapping (network, size, validity, plan_type, new_external_id, new_cost_price, new_selling_price) VALUES
  ('MTN', '1.0 GB', '%', 'SME', 7, 646, 680),
  ('MTN', '2.0 GB', '%', 'SME', 8, 1292, 1360),
  ('MTN', '3.0 GB', '%', 'SME', 44, 1938, 2040),
  ('MTN', '5.0 GB', '%', 'SME', 422, 3230, 3400),
  ('MTN', '500.0 MB', '%', 'SME', 483, 333, 350);

-- Insert mappings for GLO plans
INSERT INTO temp_plan_mapping (network, size, validity, plan_type, new_external_id, new_cost_price, new_selling_price) VALUES
  ('GLO', '200.0 MB', '%', '', 466, 81, 85),
  ('GLO', '1.0 GB', '%1 DAY%', '', 417, 198, 208),
  ('GLO', '500.0 MB', '%30 DAY%', '', 240, 209, 220),
  ('GLO', '1.0 GB', '%3 Day%', '', 467, 265, 279),
  ('GLO', '1.5 GB', '%1 DAY%', '', 418, 284, 299),
  ('GLO', '1.0 GB', '%7 DAY%', '', 468, 313, 329),
  ('GLO', '1.0 GB', '%14 DAY%', '', 469, 313, 329),
  ('GLO', '1.0 GB', '%30day%', '', 234, 413, 435),
  ('GLO', '2.5 GB', '%2 DAY%', '', 419, 461, 485),
  ('GLO', '3.0 GB', '%30 day%', '', 470, 795, 837),
  ('GLO', '2.0 GB', '%30day%', '', 235, 827, 870),
  ('GLO', '3.0 GB', '%14 DAY%', '', 471, 998, 1050),
  ('GLO', '3.0 GB', '%7 DAY%', '', 472, 998, 1050),
  ('GLO', '3.0 GB', '%30day%', '', 236, 1240, 1305),
  ('GLO', '5.0 GB', '%14 DAY%', '', 474, 1663, 1750),
  ('GLO', '5.0 GB', '%7 DAY%', '', 475, 1663, 1750),
  ('GLO', '10.0 GB', '%7 DAY%', '', 420, 1853, 1950),
  ('GLO', '5.0 GB', '%30day%', '', 237, 2066, 2175),
  ('GLO', '10.0 GB', '%14 DAY%', '', 476, 3325, 3500),
  ('GLO', '10.0 GB', '%30day%', '', 238, 4133, 4350);

-- Insert mappings for AIRTEL plans
INSERT INTO temp_plan_mapping (network, size, validity, plan_type, new_external_id, new_cost_price, new_selling_price) VALUES
  ('AIRTEL', '1.0 GB', '%3 Day%', '', 455, 347, 365),
  ('AIRTEL', '1.0 GB', '%1 Day%', '', 456, 347, 365),
  ('AIRTEL', '1.5 GB', '%1 Day%', '', 457, 397, 418),
  ('AIRTEL', '500.0 MB', '%30day%', '', 213, 461, 485),
  ('AIRTEL', '2.0 GB', '%2 Day%', '', 458, 537, 565),
  ('AIRTEL', '4.0 GB', '%2 Day%', '', 459, 807, 849),
  ('AIRTEL', '1.0 GB', '%30day%', '', 214, 922, 970),
  ('AIRTEL', '5.0 GB', '%3 Day%', '', 473, 1378, 1450),
  ('AIRTEL', '2.0 GB', '%30day%', '', 215, 1843, 1940),
  ('AIRTEL', '7.0 GB', '%7 Day%', '', 460, 1986, 2090),
  ('AIRTEL', '10.0 GB', '%30 Day%', '', 461, 2944, 3099),
  ('AIRTEL', '5.0 GB', '%30day%', '', 216, 4608, 4850),
  ('AIRTEL', '13.0 GB', '%30 Day%', '', 462, 4798, 5050),
  ('AIRTEL', '10.0 GB', '%30day%', '', 228, 9215, 9700),
  ('AIRTEL', '35.0 GB', '%30 Day%', '', 463, 9595, 10100),
  ('AIRTEL', '15.0 GB', '%30day%', '', 232, 13823, 14550),
  ('AIRTEL', '60.0 GB', '%30 Day%', '', 464, 14345, 15100),
  ('AIRTEL', '20.0 GB', '%30day%', '', 233, 18430, 19400),
  ('AIRTEL', '100.0 GB', '%30 Day%', '', 465, 19095, 20100);

-- Insert mappings for 9MOBILE plans
INSERT INTO temp_plan_mapping (network, size, validity, plan_type, new_external_id, new_cost_price, new_selling_price) VALUES
  ('9MOBILE', '500.0 MB', '%30 DAY%', '', 254, 65, 68),
  ('9MOBILE', '1.0 GB', '%30 DAY%', '', 242, 128, 135),
  ('9MOBILE', '1.5 GB', '%30 DAY%', '', 253, 189, 199),
  ('9MOBILE', '2.0 GB', '%30 DAY%', '', 252, 257, 270),
  ('9MOBILE', '3.0 GB', '%30 DAY%', '', 251, 385, 405),
  ('9MOBILE', '4.0 GB', '%30day%', '', 323, 512, 539),
  ('9MOBILE', '4.5 GB', '%30 DAY%', '', 248, 569, 599),
  ('9MOBILE', '5.0 GB', '%30 DAY%', '', 250, 641, 675),
  ('9MOBILE', '10.0 GB', '%30 DAY%', '', 245, 1282, 1349),
  ('9MOBILE', '11.0 GB', '%30 DAY%', '', 247, 1410, 1484),
  ('9MOBILE', '15.0 GB', '%30 DAY%', '', 243, 1962, 2065),
  ('9MOBILE', '20.0 GB', '%30 DAY%', '', 244, 2564, 2699),
  ('9MOBILE', '40.0 GB', '%30day%', '', 324, 5129, 5399);

-- Mark plans that would cause duplicate key errors
UPDATE temp_plan_mapping t
SET should_update = false
FROM existing_external_ids e
WHERE t.new_external_id = e.external_id;

-- Find all data plans that match our criteria
UPDATE temp_plan_mapping t
SET id = d.id
FROM data_plans d
WHERE d.network = t.network
  AND d.size = t.size
  AND (t.validity = '%' OR d.validity LIKE t.validity)
  AND (t.plan_type = '' OR d.plan_type = t.plan_type);

-- Update only the plans that won't cause conflicts
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN (SELECT * FROM temp_plan_mapping WHERE should_update = true AND id IS NOT NULL)
  LOOP
    UPDATE data_plans
    SET 
      external_id = r.new_external_id,
      cost_price = r.new_cost_price,
      selling_price = r.new_selling_price,
      profit_margin = r.new_selling_price - r.new_cost_price
    WHERE id = r.id;
  END LOOP;
END $$;

-- Reset and reapply popular plans
UPDATE data_plans SET is_popular = false;

-- Mark popular plans for each network based on plan characteristics instead of external_id
-- This avoids issues if some external_ids weren't updated
UPDATE data_plans SET is_popular = true 
WHERE network = 'MTN' AND size IN ('1.0 GB', '2.0 GB', '5.0 GB', '10.0 GB') 
AND validity LIKE '%30%';

UPDATE data_plans SET is_popular = true 
WHERE network = 'GLO' AND size IN ('1.0 GB', '2.0 GB', '5.0 GB', '10.0 GB')
AND validity LIKE '%30%';

UPDATE data_plans SET is_popular = true 
WHERE network = 'AIRTEL' AND size IN ('1.0 GB', '2.0 GB', '5.0 GB', '10.0 GB')
AND validity LIKE '%30%';

UPDATE data_plans SET is_popular = true 
WHERE network = '9MOBILE' AND size IN ('1.0 GB', '2.0 GB', '5.0 GB', '10.0 GB')
AND validity LIKE '%30%';

-- Reset and reapply discount badges
UPDATE data_plans SET show_discount_badge = false, discount_percentage = 0;

-- Add discount badges to selected plans based on plan characteristics
UPDATE data_plans SET discount_percentage = 10, show_discount_badge = true 
WHERE network = 'MTN' AND size IN ('1.0 GB', '2.0 GB', '5.0 GB')
AND validity LIKE '%30%';

UPDATE data_plans SET discount_percentage = 15, show_discount_badge = true 
WHERE network = 'AIRTEL' AND size IN ('1.0 GB', '2.0 GB', '5.0 GB')
AND validity LIKE '%30%';

UPDATE data_plans SET discount_percentage = 12, show_discount_badge = true 
WHERE network = 'GLO' AND size IN ('1.0 GB', '2.0 GB', '5.0 GB')
AND validity LIKE '%30%';

UPDATE data_plans SET discount_percentage = 8, show_discount_badge = true 
WHERE network = '9MOBILE' AND size IN ('1.0 GB', '2.0 GB', '5.0 GB')
AND validity LIKE '%30%';

-- Update active API provider setting
UPDATE admin_settings 
SET value = 'naijadatasub' 
WHERE key = 'active_api_provider';

-- If the setting doesn't exist, create it
INSERT INTO admin_settings (key, value, description)
SELECT 'active_api_provider', 'naijadatasub', 'Active API provider for services (maskawa or naijadatasub)'
WHERE NOT EXISTS (
  SELECT 1 FROM admin_settings WHERE key = 'active_api_provider'
);

-- Log the migration in admin_logs
INSERT INTO admin_logs (action, details)
VALUES (
  'update_data_plans_naijadatasub',
  jsonb_build_object(
    'description', 'Updated data plans with NaijaDataSub IDs and pricing',
    'updated_at', now(),
    'skipped_plans', (SELECT COUNT(*) FROM temp_plan_mapping WHERE should_update = false),
    'updated_plans', (SELECT COUNT(*) FROM temp_plan_mapping WHERE should_update = true AND id IS NOT NULL)
  )
);

-- Clean up temporary tables
DROP TABLE temp_plan_mapping;
DROP TABLE existing_external_ids;