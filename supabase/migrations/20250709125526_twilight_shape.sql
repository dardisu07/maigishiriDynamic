/*
  # Add NaijaDataSub API Settings

  1. New Settings
    - Add NaijaDataSub API token and base URL to api_settings table
    - Add active_api_provider setting to admin_settings table
  
  2. Security
    - Settings are protected by existing RLS policies
    - Only admins can access API settings
*/

-- Insert NaijaDataSub API settings
INSERT INTO api_settings (key_name, key_value, description) VALUES
  ('naijadatasub_token', 'YOUR_NAIJADATASUB_TOKEN_HERE', 'NaijaDataSub API authentication token'),
  ('naijadatasub_base_url', 'https://naijadatasub.com.ng', 'NaijaDataSub API base URL')
ON CONFLICT (key_name) DO NOTHING;

-- Insert active API provider setting
INSERT INTO admin_settings (key, value, description) VALUES
  ('active_api_provider', 'maskawa', 'Active API provider for services (maskawa or naijadatasub)')
ON CONFLICT (key) DO NOTHING;