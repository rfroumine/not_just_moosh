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
  emoji TEXT,
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
  is_auto_complete BOOLEAN DEFAULT false,
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

-- =============================================================================
-- MIGRATIONS (run these on existing databases)
-- =============================================================================

-- Migration: Add emoji column to foods table (Feb 2026)
-- ALTER TABLE foods ADD COLUMN IF NOT EXISTS emoji TEXT;

-- Migration: Add is_auto_complete column to manual_marks table (Feb 2026)
-- ALTER TABLE manual_marks ADD COLUMN IF NOT EXISTS is_auto_complete BOOLEAN DEFAULT false;

-- Migration: Add new default foods to existing users (Feb 2026)
-- Run this to add new foods to all existing users
-- INSERT INTO foods (user_id, name, category, is_allergen, is_default, emoji)
-- SELECT p.id, new_food.name, new_food.category, new_food.is_allergen, true, new_food.emoji
-- FROM profiles p
-- CROSS JOIN (VALUES
--   -- Vegetables
--   ('Potato', 'vegetables', false, '🥔'),
--   ('Corn', 'vegetables', false, '🌽'),
--   ('Asparagus', 'vegetables', false, '🥬'),
--   ('Butternut Squash', 'vegetables', false, '🎃'),
--   ('Kale', 'vegetables', false, '🥬'),
--   ('Eggplant', 'vegetables', false, '🍆'),
--   ('Tomato', 'vegetables', false, '🍅'),
--   ('Mushroom', 'vegetables', false, '🍄'),
--   ('Celery', 'vegetables', false, '🥬'),
--   ('Onion', 'vegetables', false, '🧅'),
--   -- Fruits
--   ('Orange', 'fruit', false, '🍊'),
--   ('Pineapple', 'fruit', false, '🍍'),
--   ('Cherries', 'fruit', false, '🍒'),
--   ('Apricot', 'fruit', false, '🍑'),
--   ('Nectarine', 'fruit', false, '🍑'),
--   ('Blackberries', 'fruit', false, '🫐'),
--   ('Prunes', 'fruit', false, '🫐'),
--   ('Honeydew', 'fruit', false, '🍈'),
--   ('Lemon', 'fruit', false, '🍋'),
--   -- Dairy
--   ('Greek Yogurt', 'dairy', false, '🥛'),
--   ('Ricotta', 'dairy', false, '🧀'),
--   -- Grains
--   ('Rice', 'grains', false, '🍚'),
--   ('Couscous', 'grains', false, '🌾'),
--   ('Noodles', 'grains', false, '🍜'),
--   -- Protein
--   ('Tuna', 'protein', false, '🐟'),
--   -- Other
--   ('Cinnamon', 'other', false, '🫙'),
--   ('Ginger', 'other', false, '🫚'),
--   ('Chia Seeds', 'other', false, '🌱'),
--   ('Flaxseed', 'other', false, '🌱'),
--   ('Maple Syrup', 'other', false, '🍁')
-- ) AS new_food(name, category, is_allergen, emoji)
-- WHERE NOT EXISTS (
--   SELECT 1 FROM foods f
--   WHERE f.user_id = p.id
--   AND LOWER(f.name) = LOWER(new_food.name)
--   AND f.deleted_at IS NULL
-- );
