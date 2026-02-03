/*
  # Add webhook URL to app configuration

  1. Changes
    - Add `webhook_url` column to `app_configuration` table
    - This will store the Razorpay webhook URL for payment notifications

  2. Security
    - No changes to existing RLS policies
*/

-- Add webhook_url column to app_configuration table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'app_configuration' AND column_name = 'webhook_url'
  ) THEN
    ALTER TABLE app_configuration ADD COLUMN webhook_url text;
  END IF;
END $$;