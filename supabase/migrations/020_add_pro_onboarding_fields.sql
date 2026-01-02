-- Add onboarding fields to pro_profiles
ALTER TABLE public.pro_profiles
  ADD COLUMN birth_date DATE,
  ADD COLUMN verification_file_url TEXT,
  ADD COLUMN primary_region VARCHAR(50),
  ADD COLUMN primary_city VARCHAR(50);
