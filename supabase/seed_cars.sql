-- Create cars table
CREATE TABLE IF NOT EXISTS cars (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  brand TEXT NOT NULL,
  year INTEGER NOT NULL,
  transmission TEXT NOT NULL,
  price INTEGER NOT NULL,
  condition TEXT NOT NULL,
  image TEXT NOT NULL,
  passengers INTEGER NOT NULL,
  features TEXT[] NOT NULL,
  featured BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0
);

-- Enable Row Level Security
ALTER TABLE cars ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Public read cars"
  ON cars FOR SELECT USING (true);

-- Seed data with real car images
INSERT INTO cars (name, brand, year, transmission, price, condition, image, passengers, features, featured, sort_order) VALUES

-- Toyota
('Toyota Calya', 'Toyota', 2023, 'Manual', 350000, 'Tersedia',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Toyota_Calya_1.2_G_A%2FT_%28facelift%2C_front%29%2C_2019_Indonesian_spec.jpg/1280px-Toyota_Calya_1.2_G_A%2FT_%28facelift%2C_front%29%2C_2019_Indonesian_spec.jpg',
  7, ARRAY['AC', 'Audio', 'Power Steering'], false, 1),

('Toyota Agya', 'Toyota', 2023, 'Manual', 300000, 'Tersedia',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Toyota_Agya_1.2_G_A%2FT_%28facelift%2C_front%29%2C_2019_Indonesian_spec.jpg/1280px-Toyota_Agya_1.2_G_A%2FT_%28facelift%2C_front%29%2C_2019_Indonesian_spec.jpg',
  4, ARRAY['AC', 'Audio', 'USB Charger'], false, 2),

('Toyota Avanza', 'Toyota', 2023, 'Otomatis', 450000, 'Tersedia',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Toyota_Avanza_1.5_G_A%2FT_%28third_generation%2C_front%29%2C_2022_Indonesian_spec.jpg/1280px-Toyota_Avanza_1.5_G_A%2FT_%28third_generation%2C_front%29%2C_2022_Indonesian_spec.jpg',
  7, ARRAY['AC Double Blower', 'Audio Touchscreen', 'Kamera Mundur'], true, 3),

('Toyota Innova Reborn', 'Toyota', 2023, 'Otomatis', 700000, 'Tersedia',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Toyota_Kijang_Innova_2.0_G_A%2FT_%28second_generation%2C_facelift%2C_front%29%2C_2018_Indonesian_spec.jpg/1280px-Toyota_Kijang_Innova_2.0_G_A%2FT_%28second_generation%2C_facelift%2C_front%29%2C_2018_Indonesian_spec.jpg',
  7, ARRAY['AC Double Blower', 'Kursi Captain', 'Sunroof'], true, 4),

('Toyota Fortuner', 'Toyota', 2022, 'Otomatis', 1250000, 'Tersedia',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Toyota_Fortuner_2.4_VRZ_A%2FT_%28second_generation%2C_facelift%2C_front%29%2C_2020_Indonesian_spec.jpg/1280px-Toyota_Fortuner_2.4_VRZ_A%2FT_%28second_generation%2C_facelift%2C_front%29%2C_2020_Indonesian_spec.jpg',
  7, ARRAY['4x4', 'Sunroof', 'Leather Seat'], true, 5),

('Toyota Alphard', 'Toyota', 2023, 'Otomatis', 2500000, 'Tersedia',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Toyota_Alphard_3.5_Executive_Lounge_%28third_generation%2C_facelift%2C_front%29%2C_2018_Indonesian_spec.jpg/1280px-Toyota_Alphard_3.5_Executive_Lounge_%28third_generation%2C_facelift%2C_front%29%2C_2018_Indonesian_spec.jpg',
  7, ARRAY['Captain Seat', 'Entertainment 4K', 'Sunroof'], true, 6),

-- Daihatsu
('Daihatsu Sigra', 'Daihatsu', 2023, 'Manual', 350000, 'Tersedia',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Daihatsu_Sigra_1.2_R_A%2FT_%28facelift%2C_front%29%2C_2019_Indonesian_spec.jpg/1280px-Daihatsu_Sigra_1.2_R_A%2FT_%28facelift%2C_front%29%2C_2019_Indonesian_spec.jpg',
  7, ARRAY['AC', 'Audio', 'Power Window'], false, 7),

('Daihatsu Ayla', 'Daihatsu', 2022, 'Manual', 280000, 'Tersedia',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Daihatsu_Ayla_1.0_D_M%2FT_%28facelift%2C_front%29%2C_2020_Indonesian_spec.jpg/1280px-Daihatsu_Ayla_1.0_D_M%2FT_%28facelift%2C_front%29%2C_2020_Indonesian_spec.jpg',
  4, ARRAY['AC', 'Audio', 'Irit BBM'], false, 8),

('Daihatsu Xenia', 'Daihatsu', 2022, 'Otomatis', 450000, 'Tersedia',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Daihatsu_Xenia_1.5_R_A%2FT_%28second_generation%2C_facelift%2C_front%29%2C_2019_Indonesian_spec.jpg/1280px-Daihatsu_Xenia_1.5_R_A%2FT_%28second_generation%2C_facelift%2C_front%29%2C_2019_Indonesian_spec.jpg',
  7, ARRAY['AC Double Blower', 'Audio Touchscreen', 'USB Port'], false, 9),

('Daihatsu Terios', 'Daihatsu', 2023, 'Otomatis', 550000, 'Tersedia',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Daihatsu_Terios_1.5_R_A%2FT_%28second_generation%2C_facelift%2C_front%29%2C_2020_Indonesian_spec.jpg/1280px-Daihatsu_Terios_1.5_R_A%2FT_%28second_generation%2C_facelift%2C_front%29%2C_2020_Indonesian_spec.jpg',
  7, ARRAY['4x4 Optional', 'Roof Rail', 'Kamera Mundur'], false, 10),

-- Honda
('Honda Brio', 'Honda', 2023, 'Otomatis', 320000, 'Tersedia',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Honda_Brio_1.2_E_Satya_A%2FT_%28facelift%2C_front%29%2C_2020_Indonesian_spec.jpg/1280px-Honda_Brio_1.2_E_Satya_A%2FT_%28facelift%2C_front%29%2C_2020_Indonesian_spec.jpg',
  4, ARRAY['AC', 'Touchscreen Audio', 'Honda Sensing'], false, 11),

('Honda Mobilio', 'Honda', 2022, 'Otomatis', 450000, 'Tersedia',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Honda_Mobilio_1.5_E_A%2FT_%28facelift%2C_front%29%2C_2019_Indonesian_spec.jpg/1280px-Honda_Mobilio_1.5_E_A%2FT_%28facelift%2C_front%29%2C_2019_Indonesian_spec.jpg',
  7, ARRAY['AC Double Blower', 'VSA', 'Eco Assist'], false, 12),

('Honda CR-V', 'Honda', 2023, 'Otomatis', 900000, 'Tersedia',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Honda_CR-V_1.5_TC-P_A%2FT_%28sixth_generation%2C_front%29%2C_2023_Indonesian_spec.jpg/1280px-Honda_CR-V_1.5_TC-P_A%2FT_%28sixth_generation%2C_front%29%2C_2023_Indonesian_spec.jpg',
  5, ARRAY['Panoramic Roof', 'Leather Seat', 'Honda Sensing'], true, 13),

-- Suzuki
('Suzuki Ertiga', 'Suzuki', 2022, 'Otomatis', 450000, 'Tersedia',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Suzuki_Ertiga_1.5_GX_A%2FT_%28second_generation%2C_facelift%2C_front%29%2C_2019_Indonesian_spec.jpg/1280px-Suzuki_Ertiga_1.5_GX_A%2FT_%28second_generation%2C_facelift%2C_front%29%2C_2019_Indonesian_spec.jpg',
  7, ARRAY['AC Auto', 'Cruise Control', 'Eco Mode'], false, 14),

-- Mitsubishi
('Mitsubishi Xpander', 'Mitsubishi', 2023, 'Otomatis', 550000, 'Tersedia',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Mitsubishi_Xpander_1.5_Exceed_A%2FT_%28facelift%2C_front%29%2C_2019_Indonesian_spec.jpg/1280px-Mitsubishi_Xpander_1.5_Exceed_A%2FT_%28facelift%2C_front%29%2C_2019_Indonesian_spec.jpg',
  7, ARRAY['AC Double Blower', 'Touchscreen', 'Kamera 360'], true, 15),

('Mitsubishi Pajero Sport', 'Mitsubishi', 2022, 'Otomatis', 1500000, 'Tersedia',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Mitsubishi_Pajero_Sport_2.4_Exceed_A%2FT_%28third_generation%2C_facelift%2C_front%29%2C_2019_Indonesian_spec.jpg/1280px-Mitsubishi_Pajero_Sport_2.4_Exceed_A%2FT_%28third_generation%2C_facelift%2C_front%29%2C_2019_Indonesian_spec.jpg',
  7, ARRAY['4WD', 'Sunroof', 'Leather Captain Seat'], true, 16);
