-- Not Just Moosh Database Schema
-- Run this in your Supabase SQL editor

-- Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  baby_name TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Foods table
CREATE TABLE IF NOT EXISTS foods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  is_allergen BOOLEAN DEFAULT false,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  deleted_at TIMESTAMPTZ
);

-- Calendar entries table
CREATE TABLE IF NOT EXISTS calendar_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  food_id UUID NOT NULL REFERENCES foods(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  texture TEXT NOT NULL,
  notes TEXT,
  reaction TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Manual marks table (for quick ticks without full entry)
CREATE TABLE IF NOT EXISTS manual_marks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  food_id UUID NOT NULL REFERENCES foods(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_foods_user_id ON foods(user_id);
CREATE INDEX IF NOT EXISTS idx_foods_category ON foods(category);
CREATE INDEX IF NOT EXISTS idx_calendar_entries_user_id ON calendar_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_calendar_entries_date ON calendar_entries(date);
CREATE INDEX IF NOT EXISTS idx_calendar_entries_food_id ON calendar_entries(food_id);
CREATE INDEX IF NOT EXISTS idx_manual_marks_user_id ON manual_marks(user_id);
CREATE INDEX IF NOT EXISTS idx_manual_marks_food_id ON manual_marks(food_id);

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE foods ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE manual_marks ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Foods policies
CREATE POLICY "Users can view own foods"
  ON foods FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own foods"
  ON foods FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own foods"
  ON foods FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own foods"
  ON foods FOR DELETE
  USING (auth.uid() = user_id);

-- Calendar entries policies
CREATE POLICY "Users can view own calendar entries"
  ON calendar_entries FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own calendar entries"
  ON calendar_entries FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own calendar entries"
  ON calendar_entries FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own calendar entries"
  ON calendar_entries FOR DELETE
  USING (auth.uid() = user_id);

-- Manual marks policies
CREATE POLICY "Users can view own manual marks"
  ON manual_marks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own manual marks"
  ON manual_marks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own manual marks"
  ON manual_marks FOR DELETE
  USING (auth.uid() = user_id);

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
