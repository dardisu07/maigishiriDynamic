/*
  # Remove NaijaDataSub Webhook Secret

  1. Changes
    - Remove the webhook secret from api_settings table
    - This is necessary because NaijaDataSub doesn't provide a webhook secret
  
  2. Security
    - The webhook function will be updated to handle requests without signature verification
    - This matches NaijaDataSub's actual webhook implementation
*/

-- Delete the webhook secret entry if it exists
DELETE FROM api_settings 
WHERE key_name = 'naijadatasub_webhook_secret';

-- Log the change
INSERT INTO admin_logs (action, details)
VALUES (
  'remove_webhook_secret',
  '{"reason": "NaijaDataSub does not provide a webhook secret for verification"}'
);