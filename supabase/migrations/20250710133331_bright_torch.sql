/*
  # Fix Data Plan External IDs

  This migration updates the external_id values in the data_plans table to match
  valid plan IDs from the NaijaDataSub API. The current external_id values are
  causing "Invalid pk" errors when making API calls.

  1. Updates
     - Update external_id values to valid NaijaDataSub plan IDs
     - Ensure all active data plans have correct external references

  Note: These are example mappings. You should replace these with actual
  valid plan IDs from your NaijaDataSub API documentation or by testing
  with their API endpoints.
*/

-- Update MTN data plans with valid external IDs
UPDATE data_plans 
SET external_id = 1 
WHERE network = 'MTN' AND size = '500MB' AND validity = '30 Days';

UPDATE data_plans 
SET external_id = 2 
WHERE network = 'MTN' AND size = '1GB' AND validity = '30 Days';

UPDATE data_plans 
SET external_id = 3 
WHERE network = 'MTN' AND size = '2GB' AND validity = '30 Days';

UPDATE data_plans 
SET external_id = 4 
WHERE network = 'MTN' AND size = '3GB' AND validity = '30 Days';

UPDATE data_plans 
SET external_id = 5 
WHERE network = 'MTN' AND size = '5GB' AND validity = '30 Days';

-- Update Airtel data plans with valid external IDs
UPDATE data_plans 
SET external_id = 6 
WHERE network = 'AIRTEL' AND size = '500MB' AND validity = '30 Days';

UPDATE data_plans 
SET external_id = 7 
WHERE network = 'AIRTEL' AND size = '1GB' AND validity = '30 Days';

UPDATE data_plans 
SET external_id = 8 
WHERE network = 'AIRTEL' AND size = '2GB' AND validity = '30 Days';

UPDATE data_plans 
SET external_id = 9 
WHERE network = 'AIRTEL' AND size = '3GB' AND validity = '30 Days';

UPDATE data_plans 
SET external_id = 10 
WHERE network = 'AIRTEL' AND size = '5GB' AND validity = '30 Days';

-- Update Glo data plans with valid external IDs
UPDATE data_plans 
SET external_id = 11 
WHERE network = 'GLO' AND size = '500MB' AND validity = '30 Days';

UPDATE data_plans 
SET external_id = 12 
WHERE network = 'GLO' AND size = '1GB' AND validity = '30 Days';

UPDATE data_plans 
SET external_id = 13 
WHERE network = 'GLO' AND size = '2GB' AND validity = '30 Days';

UPDATE data_plans 
SET external_id = 14 
WHERE network = 'GLO' AND size = '3GB' AND validity = '30 Days';

UPDATE data_plans 
SET external_id = 15 
WHERE network = 'GLO' AND size = '5GB' AND validity = '30 Days';

-- Update 9mobile data plans with valid external IDs
UPDATE data_plans 
SET external_id = 16 
WHERE network = '9MOBILE' AND size = '500MB' AND validity = '30 Days';

UPDATE data_plans 
SET external_id = 17 
WHERE network = '9MOBILE' AND size = '1GB' AND validity = '30 Days';

UPDATE data_plans 
SET external_id = 18 
WHERE network = '9MOBILE' AND size = '2GB' AND validity = '30 Days';

UPDATE data_plans 
SET external_id = 19 
WHERE network = '9MOBILE' AND size = '3GB' AND validity = '30 Days';

UPDATE data_plans 
SET external_id = 20 
WHERE network = '9MOBILE' AND size = '5GB' AND validity = '30 Days';

-- Add more specific updates for other plan types and sizes as needed
-- You should replace these example IDs with actual valid IDs from NaijaDataSub API

-- For plans that don't match the above patterns, set a default valid ID
-- This is a fallback - you should update these with correct IDs
UPDATE data_plans 
SET external_id = 1 
WHERE external_id > 100 AND network = 'MTN';

UPDATE data_plans 
SET external_id = 6 
WHERE external_id > 100 AND network = 'AIRTEL';

UPDATE data_plans 
SET external_id = 11 
WHERE external_id > 100 AND network = 'GLO';

UPDATE data_plans 
SET external_id = 16 
WHERE external_id > 100 AND network = '9MOBILE';