/*
  # Initial Schema Setup for House Plans Marketplace

  1. New Tables
    - users (extends auth.users)
      - Personal information and preferences
    - house_plans
      - Core house plan information
    - favorites
      - User's favorite house plans
    - saved_searches
      - User's saved search criteria

  2. Security
    - Enable RLS on all tables
    - Add policies for data access control
    
  3. Performance
    - Add indexes for commonly queried columns
*/

-- Create users table (extends auth.users)
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  first_name text,
  last_name text,
  phone text,
  preferences jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create house plans table
CREATE TABLE IF NOT EXISTS house_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  style text NOT NULL,
  bedrooms integer NOT NULL,
  bathrooms integer NOT NULL,
  floor_area numeric NOT NULL,
  floors integer NOT NULL,
  garages integer DEFAULT 0,
  has_pool boolean DEFAULT false,
  estimated_budget numeric NOT NULL,
  description text NOT NULL,
  images text[] NOT NULL,
  plans_2d text[] NOT NULL,
  model_3d text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create favorites table
CREATE TABLE IF NOT EXISTS favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  plan_id uuid REFERENCES house_plans(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, plan_id)
);

-- Create saved searches table
CREATE TABLE IF NOT EXISTS saved_searches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  name text NOT NULL,
  filters jsonb NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE house_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_searches ENABLE ROW LEVEL SECURITY;

-- Create policies
DO $$ 
BEGIN
  -- Only create policies if they don't exist
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'users' 
    AND policyname = 'Users can read their own data'
  ) THEN
    CREATE POLICY "Users can read their own data"
      ON users
      FOR SELECT
      TO authenticated
      USING (auth.uid() = id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'users' 
    AND policyname = 'Users can update their own data'
  ) THEN
    CREATE POLICY "Users can update their own data"
      ON users
      FOR UPDATE
      TO authenticated
      USING (auth.uid() = id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'house_plans' 
    AND policyname = 'Anyone can read house plans'
  ) THEN
    CREATE POLICY "Anyone can read house plans"
      ON house_plans
      FOR SELECT
      TO anon, authenticated
      USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'favorites' 
    AND policyname = 'Users can manage their favorites'
  ) THEN
    CREATE POLICY "Users can manage their favorites"
      ON favorites
      FOR ALL
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'saved_searches' 
    AND policyname = 'Users can manage their saved searches'
  ) THEN
    CREATE POLICY "Users can manage their saved searches"
      ON saved_searches
      FOR ALL
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;
END $$;

-- Create indexes
DO $$ 
BEGIN
  -- Only create indexes if they don't exist
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE tablename = 'house_plans' 
    AND indexname = 'idx_house_plans_style'
  ) THEN
    CREATE INDEX idx_house_plans_style ON house_plans(style);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE tablename = 'house_plans' 
    AND indexname = 'idx_house_plans_bedrooms'
  ) THEN
    CREATE INDEX idx_house_plans_bedrooms ON house_plans(bedrooms);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE tablename = 'house_plans' 
    AND indexname = 'idx_house_plans_floor_area'
  ) THEN
    CREATE INDEX idx_house_plans_floor_area ON house_plans(floor_area);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE tablename = 'house_plans' 
    AND indexname = 'idx_house_plans_estimated_budget'
  ) THEN
    CREATE INDEX idx_house_plans_estimated_budget ON house_plans(estimated_budget);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE tablename = 'favorites' 
    AND indexname = 'idx_favorites_user_id'
  ) THEN
    CREATE INDEX idx_favorites_user_id ON favorites(user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE tablename = 'saved_searches' 
    AND indexname = 'idx_saved_searches_user_id'
  ) THEN
    CREATE INDEX idx_saved_searches_user_id ON saved_searches(user_id);
  END IF;
END $$;