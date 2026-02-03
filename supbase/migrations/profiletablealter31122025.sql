-- enable RLS (if not already)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- allow SELECT for owner
CREATE POLICY "profiles_select_owner"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

-- allow INSERT for owner (so they can create their profile record)
CREATE POLICY "profiles_insert_owner"
  ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- allow UPDATE for owner (so they can update their own profile)
CREATE POLICY "profiles_update_owner"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);



  -- Enable RLS
alter table public.profiles enable row level security;

-- Allow users to SELECT their own profile
create policy "profiles_select_own"
on public.profiles
for select
using ( auth.uid() = id );

-- Allow users to INSERT their own profile
create policy "profiles_insert_own"
on public.profiles
for insert
with check ( auth.uid() = id );

-- Allow users to UPDATE their own profile
create policy "profiles_update_own"
on public.profiles
for update
using ( auth.uid() = id )
with check ( auth.uid() = id );



alter table public.profiles disable row level security;


alter table public.profiles enable row level security;

