/*
  # Update Data Plans with NaijaDataSub IDs

  1. Changes
    - Update external_id values to match NaijaDataSub plan IDs
    - Update cost_price and selling_price based on NaijaDataSub pricing
    - Recalculate profit_margin for all updated plans
    - Reset and reapply is_popular and show_discount_badge flags

  2. Purpose
    - Fix "Invalid pk" errors when using NaijaDataSub API
    - Ensure data plans have accurate pricing from the current API provider
    - Maintain consistent profit margins and user experience
*/

-- Update MTN data plans with NaijaDataSub IDs and pricing
UPDATE data_plans
SET external_id = 427, cost_price = 100, selling_price = 105, profit_margin = 5
WHERE network = 'MTN' AND size = '110.0 MB';

UPDATE data_plans
SET external_id = 428, cost_price = 195, selling_price = 205, profit_margin = 10
WHERE network = 'MTN' AND size = '230.0 MB';

UPDATE data_plans
SET external_id = 477, cost_price = 475, selling_price = 500, profit_margin = 25
WHERE network = 'MTN' AND size = '500.0 MB' AND validity LIKE '%30 DAY%';

UPDATE data_plans
SET external_id = 429, cost_price = 427, selling_price = 449, profit_margin = 22
WHERE network = 'MTN' AND size = '750.0 MB';

UPDATE data_plans
SET external_id = 431, cost_price = 473, selling_price = 498, profit_margin = 25
WHERE network = 'MTN' AND size = '500.0 MB' AND validity LIKE '%7 DAY%';

UPDATE data_plans
SET external_id = 430, cost_price = 474, selling_price = 499, profit_margin = 25
WHERE network = 'MTN' AND size = '1.0 GB' AND validity LIKE '%1 DAY%';

UPDATE data_plans
SET external_id = 432, cost_price = 565, selling_price = 595, profit_margin = 30
WHERE network = 'MTN' AND size = '1.5 GB' AND validity LIKE '%2 DAY%';

UPDATE data_plans
SET external_id = 482, cost_price = 950, selling_price = 1000, profit_margin = 50
WHERE network = 'MTN' AND size = '1.0 GB' AND validity LIKE '%30 day%';

UPDATE data_plans
SET external_id = 433, cost_price = 708, selling_price = 745, profit_margin = 37
WHERE network = 'MTN' AND size = '1.2 GB';

UPDATE data_plans
SET external_id = 434, cost_price = 708, selling_price = 745, profit_margin = 37
WHERE network = 'MTN' AND size = '2.5 GB' AND validity LIKE '%1 DAY%';

UPDATE data_plans
SET external_id = 435, cost_price = 708, selling_price = 745, profit_margin = 37
WHERE network = 'MTN' AND size = '2.0 GB' AND validity LIKE '%2 DAY%';

UPDATE data_plans
SET external_id = 436, cost_price = 746, selling_price = 785, profit_margin = 39
WHERE network = 'MTN' AND size = '1.0 GB' AND validity LIKE '%7 DAY%';

UPDATE data_plans
SET external_id = 437, cost_price = 841, selling_price = 885, profit_margin = 44
WHERE network = 'MTN' AND size = '2.5 GB' AND validity LIKE '%2 DAY%';

UPDATE data_plans
SET external_id = 438, cost_price = 945, selling_price = 995, profit_margin = 50
WHERE network = 'MTN' AND size = '1.5 GB' AND validity LIKE '%7 DAY%';

UPDATE data_plans
SET external_id = 439, cost_price = 948, selling_price = 998, profit_margin = 50
WHERE network = 'MTN' AND size = '3.2 GB';

UPDATE data_plans
SET external_id = 440, cost_price = 1411, selling_price = 1485, profit_margin = 74
WHERE network = 'MTN' AND size = '2.0 GB' AND validity LIKE '%30 DAY%';

UPDATE data_plans
SET external_id = 441, cost_price = 1411, selling_price = 1485, profit_margin = 74
WHERE network = 'MTN' AND size = '1.8 GB';

UPDATE data_plans
SET external_id = 442, cost_price = 2361, selling_price = 2485, profit_margin = 124
WHERE network = 'MTN' AND size = '6.0 GB';

UPDATE data_plans
SET external_id = 444, cost_price = 3273, selling_price = 3445, profit_margin = 172
WHERE network = 'MTN' AND size = '11.0 GB';

UPDATE data_plans
SET external_id = 445, cost_price = 4711, selling_price = 4959, profit_margin = 248
WHERE network = 'MTN' AND size = '14.5 GB';

UPDATE data_plans
SET external_id = 447, cost_price = 8408, selling_price = 8850, profit_margin = 442
WHERE network = 'MTN' AND size = '40.0 GB';

UPDATE data_plans
SET external_id = 448, cost_price = 10308, selling_price = 10850, profit_margin = 542
WHERE network = 'MTN' AND size = '32.0 GB';

UPDATE data_plans
SET external_id = 449, cost_price = 16958, selling_price = 17850, profit_margin = 892
WHERE network = 'MTN' AND size = '75.0 GB';

UPDATE data_plans
SET external_id = 450, cost_price = 23228, selling_price = 24450, profit_margin = 1222
WHERE network = 'MTN' AND size = '90.0 GB';

UPDATE data_plans
SET external_id = 451, cost_price = 32775, selling_price = 34500, profit_margin = 1725
WHERE network = 'MTN' AND size = '165.0 GB';

UPDATE data_plans
SET external_id = 452, cost_price = 37478, selling_price = 39450, profit_margin = 1972
WHERE network = 'MTN' AND size = '150.0 GB';

UPDATE data_plans
SET external_id = 453, cost_price = 51253, selling_price = 53950, profit_margin = 2697
WHERE network = 'MTN' AND size = '250.0 GB';

UPDATE data_plans
SET external_id = 454, cost_price = 83458, selling_price = 87850, profit_margin = 4392
WHERE network = 'MTN' AND size = '480.0 GB';

-- Update SME plans
UPDATE data_plans
SET external_id = 7, cost_price = 646, selling_price = 680, profit_margin = 34
WHERE network = 'MTN' AND plan_type = 'SME' AND size = '1.0 GB';

UPDATE data_plans
SET external_id = 8, cost_price = 1292, selling_price = 1360, profit_margin = 68
WHERE network = 'MTN' AND plan_type = 'SME' AND size = '2.0 GB';

UPDATE data_plans
SET external_id = 44, cost_price = 1938, selling_price = 2040, profit_margin = 102
WHERE network = 'MTN' AND plan_type = 'SME' AND size = '3.0 GB';

UPDATE data_plans
SET external_id = 422, cost_price = 3230, selling_price = 3400, profit_margin = 170
WHERE network = 'MTN' AND plan_type = 'SME' AND size = '5.0 GB';

UPDATE data_plans
SET external_id = 483, cost_price = 333, selling_price = 350, profit_margin = 17
WHERE network = 'MTN' AND plan_type = 'SME' AND size = '500.0 MB';

-- Update GLO data plans
UPDATE data_plans
SET external_id = 466, cost_price = 81, selling_price = 85, profit_margin = 4
WHERE network = 'GLO' AND size = '200.0 MB';

UPDATE data_plans
SET external_id = 417, cost_price = 198, selling_price = 208, profit_margin = 10
WHERE network = 'GLO' AND size = '1.0 GB' AND validity LIKE '%1 DAY%';

UPDATE data_plans
SET external_id = 240, cost_price = 209, selling_price = 220, profit_margin = 11
WHERE network = 'GLO' AND size = '500.0 MB' AND validity LIKE '%30 DAY%';

UPDATE data_plans
SET external_id = 467, cost_price = 265, selling_price = 279, profit_margin = 14
WHERE network = 'GLO' AND size = '1.0 GB' AND validity LIKE '%3 Day%';

UPDATE data_plans
SET external_id = 418, cost_price = 284, selling_price = 299, profit_margin = 15
WHERE network = 'GLO' AND size = '1.5 GB' AND validity LIKE '%1 DAY%';

UPDATE data_plans
SET external_id = 468, cost_price = 313, selling_price = 329, profit_margin = 16
WHERE network = 'GLO' AND size = '1.0 GB' AND validity LIKE '%7 DAY%';

UPDATE data_plans
SET external_id = 469, cost_price = 313, selling_price = 329, profit_margin = 16
WHERE network = 'GLO' AND size = '1.0 GB' AND validity LIKE '%14 DAY%';

UPDATE data_plans
SET external_id = 234, cost_price = 413, selling_price = 435, profit_margin = 22
WHERE network = 'GLO' AND size = '1.0 GB' AND validity LIKE '%30day%';

UPDATE data_plans
SET external_id = 419, cost_price = 461, selling_price = 485, profit_margin = 24
WHERE network = 'GLO' AND size = '2.5 GB' AND validity LIKE '%2 DAY%';

UPDATE data_plans
SET external_id = 470, cost_price = 795, selling_price = 837, profit_margin = 42
WHERE network = 'GLO' AND size = '3.0 GB' AND validity LIKE '%30 day%';

UPDATE data_plans
SET external_id = 235, cost_price = 827, selling_price = 870, profit_margin = 43
WHERE network = 'GLO' AND size = '2.0 GB' AND validity LIKE '%30day%';

UPDATE data_plans
SET external_id = 471, cost_price = 998, selling_price = 1050, profit_margin = 52
WHERE network = 'GLO' AND size = '3.0 GB' AND validity LIKE '%14 DAY%';

UPDATE data_plans
SET external_id = 472, cost_price = 998, selling_price = 1050, profit_margin = 52
WHERE network = 'GLO' AND size = '3.0 GB' AND validity LIKE '%7 DAY%';

UPDATE data_plans
SET external_id = 236, cost_price = 1240, selling_price = 1305, profit_margin = 65
WHERE network = 'GLO' AND size = '3.0 GB' AND validity LIKE '%30day%';

UPDATE data_plans
SET external_id = 474, cost_price = 1663, selling_price = 1750, profit_margin = 87
WHERE network = 'GLO' AND size = '5.0 GB' AND validity LIKE '%14 DAY%';

UPDATE data_plans
SET external_id = 475, cost_price = 1663, selling_price = 1750, profit_margin = 87
WHERE network = 'GLO' AND size = '5.0 GB' AND validity LIKE '%7 DAY%';

UPDATE data_plans
SET external_id = 420, cost_price = 1853, selling_price = 1950, profit_margin = 97
WHERE network = 'GLO' AND size = '10.0 GB' AND validity LIKE '%7 DAY%';

UPDATE data_plans
SET external_id = 237, cost_price = 2066, selling_price = 2175, profit_margin = 109
WHERE network = 'GLO' AND size = '5.0 GB' AND validity LIKE '%30day%';

UPDATE data_plans
SET external_id = 476, cost_price = 3325, selling_price = 3500, profit_margin = 175
WHERE network = 'GLO' AND size = '10.0 GB' AND validity LIKE '%14 DAY%';

UPDATE data_plans
SET external_id = 238, cost_price = 4133, selling_price = 4350, profit_margin = 217
WHERE network = 'GLO' AND size = '10.0 GB' AND validity LIKE '%30day%';

-- Update AIRTEL data plans
UPDATE data_plans
SET external_id = 455, cost_price = 347, selling_price = 365, profit_margin = 18
WHERE network = 'AIRTEL' AND size = '1.0 GB' AND validity LIKE '%3 Day%';

UPDATE data_plans
SET external_id = 456, cost_price = 347, selling_price = 365, profit_margin = 18
WHERE network = 'AIRTEL' AND size = '1.0 GB' AND validity LIKE '%1 Day%';

UPDATE data_plans
SET external_id = 457, cost_price = 397, selling_price = 418, profit_margin = 21
WHERE network = 'AIRTEL' AND size = '1.5 GB' AND validity LIKE '%1 Day%';

UPDATE data_plans
SET external_id = 213, cost_price = 461, selling_price = 485, profit_margin = 24
WHERE network = 'AIRTEL' AND size = '500.0 MB' AND validity LIKE '%30day%';

UPDATE data_plans
SET external_id = 458, cost_price = 537, selling_price = 565, profit_margin = 28
WHERE network = 'AIRTEL' AND size = '2.0 GB' AND validity LIKE '%2 Day%';

UPDATE data_plans
SET external_id = 459, cost_price = 807, selling_price = 849, profit_margin = 42
WHERE network = 'AIRTEL' AND size = '4.0 GB' AND validity LIKE '%2 Day%';

UPDATE data_plans
SET external_id = 214, cost_price = 922, selling_price = 970, profit_margin = 48
WHERE network = 'AIRTEL' AND size = '1.0 GB' AND validity LIKE '%30day%';

UPDATE data_plans
SET external_id = 473, cost_price = 1378, selling_price = 1450, profit_margin = 72
WHERE network = 'AIRTEL' AND size = '5.0 GB' AND validity LIKE '%3 Day%';

UPDATE data_plans
SET external_id = 215, cost_price = 1843, selling_price = 1940, profit_margin = 97
WHERE network = 'AIRTEL' AND size = '2.0 GB' AND validity LIKE '%30day%';

UPDATE data_plans
SET external_id = 460, cost_price = 1986, selling_price = 2090, profit_margin = 104
WHERE network = 'AIRTEL' AND size = '7.0 GB' AND validity LIKE '%7 Day%';

UPDATE data_plans
SET external_id = 461, cost_price = 2944, selling_price = 3099, profit_margin = 155
WHERE network = 'AIRTEL' AND size = '10.0 GB' AND validity LIKE '%30 Day%';

UPDATE data_plans
SET external_id = 216, cost_price = 4608, selling_price = 4850, profit_margin = 242
WHERE network = 'AIRTEL' AND size = '5.0 GB' AND validity LIKE '%30day%';

UPDATE data_plans
SET external_id = 462, cost_price = 4798, selling_price = 5050, profit_margin = 252
WHERE network = 'AIRTEL' AND size = '13.0 GB' AND validity LIKE '%30 Day%';

UPDATE data_plans
SET external_id = 228, cost_price = 9215, selling_price = 9700, profit_margin = 485
WHERE network = 'AIRTEL' AND size = '10.0 GB' AND validity LIKE '%30day%';

UPDATE data_plans
SET external_id = 463, cost_price = 9595, selling_price = 10100, profit_margin = 505
WHERE network = 'AIRTEL' AND size = '35.0 GB' AND validity LIKE '%30 Day%';

UPDATE data_plans
SET external_id = 232, cost_price = 13823, selling_price = 14550, profit_margin = 727
WHERE network = 'AIRTEL' AND size = '15.0 GB' AND validity LIKE '%30day%';

UPDATE data_plans
SET external_id = 464, cost_price = 14345, selling_price = 15100, profit_margin = 755
WHERE network = 'AIRTEL' AND size = '60.0 GB' AND validity LIKE '%30 Day%';

UPDATE data_plans
SET external_id = 233, cost_price = 18430, selling_price = 19400, profit_margin = 970
WHERE network = 'AIRTEL' AND size = '20.0 GB' AND validity LIKE '%30day%';

UPDATE data_plans
SET external_id = 465, cost_price = 19095, selling_price = 20100, profit_margin = 1005
WHERE network = 'AIRTEL' AND size = '100.0 GB' AND validity LIKE '%30 Day%';

-- Update 9MOBILE data plans
UPDATE data_plans
SET external_id = 254, cost_price = 65, selling_price = 68, profit_margin = 3
WHERE network = '9MOBILE' AND size = '500.0 MB' AND validity LIKE '%30 DAY%';

UPDATE data_plans
SET external_id = 242, cost_price = 128, selling_price = 135, profit_margin = 7
WHERE network = '9MOBILE' AND size = '1.0 GB' AND validity LIKE '%30 DAY%';

UPDATE data_plans
SET external_id = 253, cost_price = 189, selling_price = 199, profit_margin = 10
WHERE network = '9MOBILE' AND size = '1.5 GB' AND validity LIKE '%30 DAY%';

UPDATE data_plans
SET external_id = 252, cost_price = 257, selling_price = 270, profit_margin = 13
WHERE network = '9MOBILE' AND size = '2.0 GB' AND validity LIKE '%30 DAY%';

UPDATE data_plans
SET external_id = 251, cost_price = 385, selling_price = 405, profit_margin = 20
WHERE network = '9MOBILE' AND size = '3.0 GB' AND validity LIKE '%30 DAY%';

UPDATE data_plans
SET external_id = 323, cost_price = 512, selling_price = 539, profit_margin = 27
WHERE network = '9MOBILE' AND size = '4.0 GB' AND validity LIKE '%30day%';

UPDATE data_plans
SET external_id = 248, cost_price = 569, selling_price = 599, profit_margin = 30
WHERE network = '9MOBILE' AND size = '4.5 GB' AND validity LIKE '%30 DAY%';

UPDATE data_plans
SET external_id = 250, cost_price = 641, selling_price = 675, profit_margin = 34
WHERE network = '9MOBILE' AND size = '5.0 GB' AND validity LIKE '%30 DAY%';

UPDATE data_plans
SET external_id = 245, cost_price = 1282, selling_price = 1349, profit_margin = 67
WHERE network = '9MOBILE' AND size = '10.0 GB' AND validity LIKE '%30 DAY%';

UPDATE data_plans
SET external_id = 247, cost_price = 1410, selling_price = 1484, profit_margin = 74
WHERE network = '9MOBILE' AND size = '11.0 GB' AND validity LIKE '%30 DAY%';

UPDATE data_plans
SET external_id = 243, cost_price = 1962, selling_price = 2065, profit_margin = 103
WHERE network = '9MOBILE' AND size = '15.0 GB' AND validity LIKE '%30 DAY%';

UPDATE data_plans
SET external_id = 244, cost_price = 2564, selling_price = 2699, profit_margin = 135
WHERE network = '9MOBILE' AND size = '20.0 GB' AND validity LIKE '%30 DAY%';

UPDATE data_plans
SET external_id = 324, cost_price = 5129, selling_price = 5399, profit_margin = 270
WHERE network = '9MOBILE' AND size = '40.0 GB' AND validity LIKE '%30day%';

-- Reset and reapply popular plans
UPDATE data_plans SET is_popular = false;

-- Mark popular plans for each network
UPDATE data_plans SET is_popular = true 
WHERE network = 'MTN' AND external_id IN (482, 440, 422, 461);

UPDATE data_plans SET is_popular = true 
WHERE network = 'GLO' AND external_id IN (234, 235, 237, 238);

UPDATE data_plans SET is_popular = true 
WHERE network = 'AIRTEL' AND external_id IN (214, 215, 216, 228);

UPDATE data_plans SET is_popular = true 
WHERE network = '9MOBILE' AND external_id IN (242, 252, 250, 245);

-- Reset and reapply discount badges
UPDATE data_plans SET show_discount_badge = false, discount_percentage = 0;

-- Add discount badges to selected plans
UPDATE data_plans SET discount_percentage = 10, show_discount_badge = true 
WHERE network = 'MTN' AND external_id IN (482, 440, 422);

UPDATE data_plans SET discount_percentage = 15, show_discount_badge = true 
WHERE network = 'AIRTEL' AND external_id IN (214, 215, 216);

UPDATE data_plans SET discount_percentage = 12, show_discount_badge = true 
WHERE network = 'GLO' AND external_id IN (234, 235, 237);

UPDATE data_plans SET discount_percentage = 8, show_discount_badge = true 
WHERE network = '9MOBILE' AND external_id IN (242, 252, 250);

-- Add admin setting for active API provider if it doesn't exist
INSERT INTO admin_settings (key, value, description) VALUES
  ('active_api_provider', 'naijadatasub', 'Active API provider for services (maskawa or naijadatasub)')
ON CONFLICT (key) DO UPDATE SET value = 'naijadatasub';

-- Log the migration in admin_logs
INSERT INTO admin_logs (action, details)
VALUES (
  'update_data_plans_naijadatasub',
  '{"description": "Updated data plans with NaijaDataSub IDs and pricing", "updated_plans_count": "All data plans"}'
);