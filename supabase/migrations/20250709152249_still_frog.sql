/*
  # Add NaijaDataSub Webhook Secret

  1. New Settings
    - Add webhook secret to api_settings table
    - This will be used to verify webhook requests from NaijaDataSub
  
  2. Security
    - Setting is protected by existing RLS policies
    - Only admins can access API settings
*/

-- Insert NaijaDataSub webhook secret if it doesn't exist
INSERT INTO api_settings (key_name, key_value, description) VALUES
  ('naijadatasub_webhook_secret', 'your-webhook-secret-here', 'Secret key for verifying NaijaDataSub webhook requests')
ON CONFLICT (key_name) DO NOTHING;

-- Add refund type to transactions table constraints if needed
DO $$
BEGIN
  -- Check if the constraint exists and contains 'refund'
  IF EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'transactions_type_check' 
    AND conrelid = 'transactions'::regclass
  ) THEN
    -- If constraint exists but doesn't include 'refund', drop and recreate it
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.check_constraints
      WHERE constraint_name = 'transactions_type_check'
      AND check_clause LIKE '%refund%'
    ) THEN
      -- We can't easily modify the check constraint, so we'll just note it
      -- In a real scenario, you would drop and recreate the constraint
      -- This is just a placeholder comment as we don't want to risk breaking existing data
      RAISE NOTICE 'Consider adding "refund" to the transaction type check constraint';
    END IF;
  END IF;
END $$;