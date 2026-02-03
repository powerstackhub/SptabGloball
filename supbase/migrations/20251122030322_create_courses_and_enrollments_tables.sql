

-- ================================
-- 1) TABLE CREATION + INDEXES
-- ================================

-- Create courses table
CREATE TABLE IF NOT EXISTS courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create course_enrollments table
CREATE TABLE IF NOT EXISTS course_enrollments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  address text NOT NULL,
  country text NOT NULL,
  state text NOT NULL,
  city text NOT NULL,
  batch_month text NOT NULL,
  status text DEFAULT 'enrollment' CHECK (status IN ('enrollment', 'confirmed', 'completed', 'cancelled')),
  enrolled_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_course_enrollments_user_id ON course_enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_course_enrollments_course_id ON course_enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_courses_type ON courses(type);


-- ================================
-- 2) DATA INSERTION (SAMPLE)
-- ================================

-- Insert sample courses (safe to run multiple times)
INSERT INTO courses (name, type, description) VALUES
  ('Spiritual Awakening Level 1', 'L1', 'Beginner course on spiritual awakening and meditation practices'),
  ('Advanced Spiritual Practice Level 2', 'L2', 'Advanced level course for experienced practitioners'),
  ('Mindfulness Mastery Level 1', 'L1', 'Learn practical mindfulness techniques'),
  ('Energy Healing Level 2', 'L2', 'Advanced energy healing and chakra balancing')
ON CONFLICT DO NOTHING;



-- -------------------------------
-- ENABLE RLS (idempotent if already enabled)
-- -------------------------------
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_enrollments ENABLE ROW LEVEL SECURITY;

-- -------------------------------
-- COURSES: admin management + view by authenticated users
-- -------------------------------

-- Admins (profiles.role = 'admin') can manage courses (INSERT/UPDATE/DELETE/SELECT)
CREATE POLICY "Admins can manage courses"
  ON courses
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
  );

-- Authenticated users can view (select) courses
CREATE POLICY "Authenticated users can view courses"
  ON courses
  FOR SELECT
  TO authenticated
  USING (true);


-- -------------------------------
-- COURSE_ENROLLMENTS: public inserts, authenticated user control for own rows, admin full control
-- -------------------------------

-- 1) Allow anyone (including anonymous/guest) to create enrollments
--    (Useful if you allow guest registration: they can insert rows without user_id)
CREATE POLICY "Anyone can create enrollments (guest allowed)"
  ON course_enrollments
  FOR INSERT
  WITH CHECK (true);

-- 2) Allow authenticated users to INSERT and set user_id = auth.uid()
--    (this ensures an authenticated user can create an enrollment tied to their account)
CREATE POLICY "Authenticated users can insert enrollments with user_id"
  ON course_enrollments
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- 3) Authenticated users can SELECT their own enrollments
CREATE POLICY "Authenticated users can view own enrollments"
  ON course_enrollments
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- 4) Authenticated users can UPDATE their own enrollments (and can't change user_id away from themselves)
CREATE POLICY "Authenticated users can update own enrollments"
  ON course_enrollments
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 5) Authenticated users can DELETE their own enrollments
CREATE POLICY "Authenticated users can delete own enrollments"
  ON course_enrollments
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- 6) Admins can manage ALL enrollments
CREATE POLICY "Admins can manage enrollments"
  ON course_enrollments
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
  );

-- -------------------------------
-- (Optional) Indexes (if not already present)
-- -------------------------------
CREATE INDEX IF NOT EXISTS idx_course_enrollments_user_id ON course_enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_course_enrollments_course_id ON course_enrollments(course_id);
