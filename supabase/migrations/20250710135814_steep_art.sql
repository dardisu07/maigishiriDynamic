/*
  # Create Data Plan Categories Table

  1. New Tables
    - `data_plan_categories`
      - `id` (uuid, primary key)
      - `network` (text, not null)
      - `plan_type` (text, not null)
      - `display_name` (text, not null)
      - `description` (text)
      - `is_active` (boolean, default true)
      - `sort_order` (integer, default 0)
      - `created_at` (timestamptz, default now())
  2. Security
    - Enable RLS on `data_plan_categories` table
    - Add policy for admins to manage data plan categories
    - Add policy for anyone to read active data plan categories
*/

-- Create data_plan_categories table
CREATE TABLE IF NOT EXISTS data_plan_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  network text NOT NULL,
  plan_type text NOT NULL,
  display_name text NOT NULL,
  description text,
  is_active boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS data_plan_categories_network_idx ON data_plan_categories(network);
CREATE INDEX IF NOT EXISTS data_plan_categories_active_idx ON data_plan_categories(is_active);

-- Enable Row Level Security
ALTER TABLE data_plan_categories ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Admins can manage data plan categories"
  ON data_plan_categories
  FOR ALL
  TO authenticated
  USING (is_admin_user());

CREATE POLICY "Anyone can read active data plan categories"
  ON data_plan_categories
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

-- Insert default data plan categories
INSERT INTO data_plan_categories (network, plan_type, display_name, description, sort_order)
VALUES
  ('MTN', 'SME', 'MTN SME', 'MTN SME data plans for businesses', 10),
  ('MTN', 'GIFTING', 'MTN Gifting', 'MTN gifting data plans for individuals', 20),
  ('MTN', 'AWOOF DATA SHARE', 'MTN Awoof', 'MTN Awoof data share plans', 30),
  ('AIRTEL', 'CORPORATE GIFTING', 'Airtel Corporate', 'Airtel corporate gifting data plans', 10),
  ('AIRTEL', 'AWOOF DATA SHARE', 'Airtel Awoof', 'Airtel Awoof data share plans', 20),
  ('GLO', 'CORPORATE GIFTING', 'Glo Corporate', 'Glo corporate gifting data plans', 10),
  ('GLO', 'GIFTING', 'Glo Gifting', 'Glo gifting data plans', 20),
  ('9MOBILE', 'CORPORATE GIFTING', '9mobile Corporate', '9mobile corporate gifting data plans', 10);