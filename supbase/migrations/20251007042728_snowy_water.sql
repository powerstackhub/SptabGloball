/*
  # Patient God System Schema

  1. New Tables
    - `patient_god_registrations`
      - `id` (uuid, primary key)
      - `full_name` (text, not null)
      - `email` (text, not null)
      - `phone` (text, not null)
      - `date_of_birth` (date, not null)
      - `gender` (text, not null)
      - `address` (text, not null)
      - `city` (text, not null)
      - `district` (text, not null)
      - `state` (text, not null)
      - `country` (text, not null)
      - `pincode` (text, not null)
      - `occupation` (text, nullable)
      - `health_issues` (text, nullable)
      - `spiritual_background` (text, nullable)
      - `consultation_preference` (text, default 'online')
      - `assigned_counselor_id` (uuid, nullable, references counselors)
      - `status` (text, default 'pending')
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())

  2. Changes to existing tables
    - Add location columns to `counselors` table
    - Add `counselor` role to profiles role check

  3. Security
    - Enable RLS on new table
    - Add appropriate policies
*/

-- Add location columns to counselors table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'counselors' AND column_name = 'country'
  ) THEN
    ALTER TABLE counselors 
    ADD COLUMN country text,
    ADD COLUMN state text,
    ADD COLUMN district text,
    ADD COLUMN city text;
  END IF;
END $$;

-- Update profiles role check to include counselor
DO $$
BEGIN
  -- Drop existing constraint
  ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
  
  -- Add new constraint with counselor role
  ALTER TABLE profiles ADD CONSTRAINT profiles_role_check 
    CHECK (role IN ('user', 'admin', 'counselor'));
END $$;

-- Create patient_god_registrations table
CREATE TABLE IF NOT EXISTS patient_god_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  date_of_birth date NOT NULL,
  gender text NOT NULL CHECK (gender IN ('male', 'female', 'other')),
  address text NOT NULL,
  city text NOT NULL,
  district text NOT NULL,
  state text NOT NULL,
  country text NOT NULL,
  pincode text NOT NULL,
  occupation text,
  health_issues text,
  spiritual_background text,
  consultation_preference text DEFAULT 'online' CHECK (consultation_preference IN ('online', 'offline', 'both')),
  assigned_counselor_id uuid REFERENCES counselors(id),
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'assigned', 'in_progress', 'completed', 'cancelled')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE patient_god_registrations ENABLE ROW LEVEL SECURITY;

-- Create policies for patient_god_registrations
CREATE POLICY "Anyone can register for Patient God" ON patient_god_registrations
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view their own registrations" ON patient_god_registrations
  FOR SELECT USING (
    auth.jwt() ->> 'email' = email
  );

CREATE POLICY "Counselors can view assigned patients" ON patient_god_registrations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'counselor'
      AND assigned_counselor_id IN (
        SELECT id FROM counselors WHERE email = profiles.email
      )
    )
  );

CREATE POLICY "Counselors can update assigned patients" ON patient_god_registrations
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'counselor'
      AND assigned_counselor_id IN (
        SELECT id FROM counselors WHERE email = profiles.email
      )
    )
  );

CREATE POLICY "Admins can manage all patient registrations" ON patient_god_registrations
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Create function to auto-assign counselors based on location
CREATE OR REPLACE FUNCTION assign_counselor_by_location()
RETURNS trigger AS $$
BEGIN
  -- Find a counselor in the same location
  UPDATE patient_god_registrations 
  SET assigned_counselor_id = (
    SELECT id FROM counselors 
    WHERE available = true 
    AND (country = NEW.country OR country IS NULL)
    AND (state = NEW.state OR state IS NULL)
    AND (district = NEW.district OR district IS NULL)
    ORDER BY 
      CASE WHEN country = NEW.country THEN 1 ELSE 2 END,
      CASE WHEN state = NEW.state THEN 1 ELSE 2 END,
      CASE WHEN district = NEW.district THEN 1 ELSE 2 END,
      created_at ASC
    LIMIT 1
  ),
  status = 'assigned'
  WHERE id = NEW.id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for auto-assignment
DROP TRIGGER IF EXISTS auto_assign_counselor ON patient_god_registrations;
CREATE TRIGGER auto_assign_counselor
  AFTER INSERT ON patient_god_registrations
  FOR EACH ROW EXECUTE FUNCTION assign_counselor_by_location();