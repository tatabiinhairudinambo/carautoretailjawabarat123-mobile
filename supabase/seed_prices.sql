-- Create prices table
CREATE TABLE IF NOT EXISTS prices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL,
  category_emoji TEXT NOT NULL,
  category_color TEXT NOT NULL,
  name TEXT NOT NULL,
  duration TEXT NOT NULL,
  price INTEGER NOT NULL,
  sort_order INTEGER NOT NULL
);

-- Enable Row Level Security
ALTER TABLE prices ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Public read access"
  ON prices
  FOR SELECT
  USING (true);

-- Seed data
INSERT INTO prices (category, category_emoji, category_color, name, duration, price, sort_order) VALUES
-- City Car / LCGC
('City Car / LCGC', '🚗', '#3b82f6', 'Toyota Calya / Daihatsu Sigra', '12 jam', 280000, 1),
('City Car / LCGC', '🚗', '#3b82f6', 'Toyota Calya / Daihatsu Sigra', '24 jam', 350000, 2),
('City Car / LCGC', '🚗', '#3b82f6', 'Daihatsu Ayla / Toyota Agya', '12 jam', 250000, 3),
('City Car / LCGC', '🚗', '#3b82f6', 'Daihatsu Ayla / Toyota Agya', '24 jam', 300000, 4),
-- MPV Keluarga
('MPV Keluarga', '🚐', '#10b981', 'Toyota Avanza / Daihatsu Xenia', '12 jam', 350000, 5),
('MPV Keluarga', '🚐', '#10b981', 'Toyota Avanza / Daihatsu Xenia', '24 jam', 450000, 6),
('MPV Keluarga', '🚐', '#10b981', 'Toyota Kijang Innova', '12 jam', 600000, 7),
('MPV Keluarga', '🚐', '#10b981', 'Toyota Kijang Innova', '24 jam', 700000, 8),
-- Premium MPV
('Premium MPV', '✨', '#f59e0b', 'Toyota Innova Zenix Hybrid', '12 jam', 750000, 9),
('Premium MPV', '✨', '#f59e0b', 'Toyota Innova Zenix Hybrid', '24 jam', 850000, 10),
('Premium MPV', '✨', '#f59e0b', 'Toyota Alphard', '12 jam', 2000000, 11),
('Premium MPV', '✨', '#f59e0b', 'Toyota Alphard', '24 jam', 2500000, 12),
-- SUV
('SUV', '🏔️', '#dc2626', 'Daihatsu Terios / Toyota Rush', '12 jam', 450000, 13),
('SUV', '🏔️', '#dc2626', 'Daihatsu Terios / Toyota Rush', '24 jam', 550000, 14),
('SUV', '🏔️', '#dc2626', 'Toyota Fortuner', '12 jam', 1100000, 15),
('SUV', '🏔️', '#dc2626', 'Toyota Fortuner', '24 jam', 1250000, 16);
