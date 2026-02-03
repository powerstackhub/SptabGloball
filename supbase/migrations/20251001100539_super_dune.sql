/*
  # Admin Configuration System

  1. New Tables
    - `app_configuration`
      - `id` (uuid, primary key)
      - `app_name` (text, not null)
      - `app_logo_url` (text, nullable)
      - `primary_color` (text, default '#22c55e')
      - `secondary_color` (text, default '#059669')
      - `theme_mode` (text, default 'light')
      - `google_oauth_client_id` (text, nullable)
      - `google_oauth_client_secret` (text, nullable)
      - `supabase_url` (text, nullable)
      - `supabase_anon_key` (text, nullable)
      - `android_package_name` (text, nullable)
      - `ios_bundle_identifier` (text, nullable)
      - `app_version` (text, default '1.0.0')
      - `build_number` (integer, default 1)
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())

  2. Security
    - Enable RLS on `app_configuration` table
    - Add policies for admin access only
*/

-- Create app_configuration table
CREATE TABLE IF NOT EXISTS app_configuration (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  app_name text NOT NULL DEFAULT 'Spiritual Tablets',
  app_logo_url text,
  primary_color text DEFAULT '#22c55e',
  secondary_color text DEFAULT '#059669',
  theme_mode text DEFAULT 'light' CHECK (theme_mode IN ('light', 'dark', 'auto')),
  google_oauth_client_id text,
  google_oauth_client_secret text,
  supabase_url text,
  supabase_anon_key text,
  android_package_name text DEFAULT 'com.spiritualtablets.app',
  ios_bundle_identifier text DEFAULT 'com.spiritualtablets.app',
  app_version text DEFAULT '1.0.0',
  build_number integer DEFAULT 1,
  welcome_message text DEFAULT 'Welcome to your spiritual journey',
  support_email text DEFAULT 'support@spiritualtablets.com',
  privacy_policy_url text,
  terms_of_service_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE app_configuration ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Admins can view app configuration" ON app_configuration
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can manage app configuration" ON app_configuration
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Insert default configuration
INSERT INTO app_configuration (app_name, app_logo_url, primary_color, secondary_color)
VALUES ('Spiritual Tablets', NULL, '#22c55e', '#059669')
ON CONFLICT DO NOTHING;


ALTER TABLE app_configuration
ADD COLUMN razorpay_key_id text,
ADD COLUMN razorpay_key_secret text,
ADD COLUMN webhook_url text,
ADD COLUMN is_live_mode boolean DEFAULT false;
