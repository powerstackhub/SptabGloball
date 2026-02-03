-- ===================================
-- Update RBAC Policies for Superadmin
-- ===================================

-- 1. Create or replace the is_superadmin function
CREATE OR REPLACE FUNCTION is_superadmin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() 
    AND role = 'superadmin'::text
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- 2. Create or replace the is_admin function to include both admin and superadmin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() 
    AND role IN ('admin'::text, 'superadmin'::text)
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- 3. Update RLS policies for all tables to restrict deletes to superadmins
-- Example for courses table (repeat for other tables as needed)
DO $$
DECLARE
  table_record RECORD;
  policy_sql TEXT;
BEGIN
  -- List of tables to update policies for
  FOR table_record IN 
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_type = 'BASE TABLE'
    AND table_name NOT IN ('spatial_ref_sys', 'pg_stat_statements')
  LOOP
    -- Drop existing delete policy if it exists
    EXECUTE format('DROP POLICY IF EXISTS "Superadmin can delete" ON %I', table_record.table_name);
    
    -- Create new delete policy that only allows superadmins to delete
    EXECUTE format('CREATE POLICY "Superadmin can delete" ON %I 
                   FOR DELETE USING (is_superadmin())', table_record.table_name);
    
    -- Update existing policies to use is_admin() instead of role = ''admin''
    FOR policy_sql IN 
      SELECT format('ALTER POLICY %I ON %I TO %s', 
                  pol.polname, 
                  table_record.table_name,
                  CASE 
                    WHEN pol.polpermissive THEN 'PUBLIC' 
                    ELSE 'RESTRICTED' 
                  END)
      FROM pg_policy pol
      JOIN pg_class ON pol.polrelid = pg_class.oid
      WHERE pg_class.relname = table_record.table_name
      AND pol.polname != 'Superadmin can delete'
    LOOP
      EXECUTE policy_sql;
    END LOOP;
  END LOOP;
END $$;

-- 4. Update the profiles table to include superadmin role
DO $$
BEGIN
  -- First, check if we need to update the role column
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'profiles' 
    AND column_name = 'role' 
    AND data_type = 'text'
  ) THEN
    -- If role column doesn't exist as text, create it
    ALTER TABLE profiles 
    ADD COLUMN role TEXT NOT NULL DEFAULT 'user';
    
    -- Set existing admin users to 'admin' role
    UPDATE profiles 
    SET role = 'admin' 
    WHERE is_admin = true;
  END IF;
  
  -- Add superadmin role to existing admin if needed
  -- Note: You'll need to manually set a superadmin user after this migration
  -- UPDATE profiles SET role = 'superadmin' WHERE email = 'your-superadmin-email@example.com';
  
  -- Create a constraint to ensure role is one of the allowed values
  ALTER TABLE profiles 
  DROP CONSTRAINT IF EXISTS profiles_role_check;
  
  ALTER TABLE profiles 
  ADD CONSTRAINT profiles_role_check 
  CHECK (role IN ('user', 'admin', 'superadmin', 'counselor'));
  
  -- Create an index on role for better performance
  CREATE INDEX IF NOT EXISTS profiles_role_idx ON profiles(role);
END $$;

-- 5. Create a function to get user role
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS TEXT AS $$
  SELECT role::TEXT 
  FROM profiles 
  WHERE id = auth.uid() 
  LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER STABLE;
