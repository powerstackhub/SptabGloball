/*
  # Payment System for Donations

  1. New Tables
    - `payment_configurations`
      - `id` (uuid, primary key)
      - `razorpay_key_id` (text, not null)
      - `razorpay_key_secret` (text, not null)
      - `is_live_mode` (boolean, default false)
      - `webhook_secret` (text, nullable)
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())

    - `donations`
      - `id` (uuid, primary key)
      - `donor_name` (text, nullable)
      - `donor_email` (text, nullable)
      - `donor_phone` (text, nullable)
      - `amount` (numeric, not null)
      - `currency` (text, default 'INR')
      - `payment_id` (text, nullable)
      - `order_id` (text, not null)
      - `status` (text, default 'pending')
      - `payment_method` (text, nullable)
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())

  2. Security
    - Enable RLS on all tables
    - Add appropriate policies
*/

-- Create payment_configurations table
CREATE TABLE IF NOT EXISTS payment_configurations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  razorpay_key_id text NOT NULL,
  razorpay_key_secret text NOT NULL,
  is_live_mode boolean DEFAULT false,
  webhook_secret text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create donations table
CREATE TABLE IF NOT EXISTS donations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  donor_name text,
  donor_email text,
  donor_phone text,
  amount numeric NOT NULL CHECK (amount > 0),
  currency text DEFAULT 'INR',
  payment_id text,
  order_id text NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed', 'cancelled')),
  payment_method text,
  razorpay_payment_id text,
  razorpay_order_id text,
  razorpay_signature text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE payment_configurations ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;

-- Payment configurations policies (admin only)
CREATE POLICY "Admins can view payment configurations" ON payment_configurations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can manage payment configurations" ON payment_configurations
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Donations policies
CREATE POLICY "Anyone can create donations" ON donations
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view all donations" ON donations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can update donations" ON donations
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );