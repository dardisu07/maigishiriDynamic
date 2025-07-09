/*
  # Add NaijaDataSub API Settings

  1. New Settings
    - Add `naijadatasub_token` setting with placeholder value
    - Add `naijadatasub_base_url` setting with default API URL
    - Add `active_api_provider` setting to control which API to use

  2. Security
    - Only admins can manage these settings (existing RLS policies apply)

  3. Notes
    - Admin users need to update the token value with their actual NaijaDataSub API token
    - The base URL is set to the standard NaijaDataSub API endpoint
    - The active provider defaults to 'maskawa' for backward compatibility
*/

-- Insert NaijaDataSub API settings if they don't exist
INSERT INTO admin_settings (key, value, description) 
VALUES 
  ('naijadatasub_token', 'YOUR_NAIJADATASUB_TOKEN_HERE', 'NaijaDataSub API authentication token')
ON CONFLICT (key) DO NOTHING;

INSERT INTO admin_settings (key, value, description) 
VALUES 
  ('naijadatasub_base_url', 'https://naijadatasub.com', 'NaijaDataSub API base URL')
ON CONFLICT (key) DO NOTHING;

INSERT INTO admin_settings (key, value, description) 
VALUES 
  ('active_api_provider', 'maskawa', 'Active API provider for services (maskawa or naijadatasub)')
ON CONFLICT (key) DO NOTHING;

-- Also ensure we have the API settings table entries for consistency
INSERT INTO api_settings (key_name, key_value, description) 
VALUES 
  ('naijadatasub_token', 'YOUR_NAIJADATASUB_TOKEN_HERE', 'NaijaDataSub API authentication token')
ON CONFLICT (key_name) DO NOTHING;

INSERT INTO api_settings (key_name, key_value, description) 
VALUES 
  ('naijadatasub_base_url', 'https://naijadatasub.com', 'NaijaDataSub API base URL')
ON CONFLICT (key_name) DO NOTHING;