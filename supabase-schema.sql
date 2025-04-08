-- Criação da tabela de produtos
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  promo_price DECIMAL(10, 2),
  image TEXT,
  description TEXT,
  is_promotion BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criação da tabela de imagens de produtos
CREATE TABLE IF NOT EXISTS product_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  high_resolution TEXT NOT NULL,
  standard TEXT NOT NULL,
  thumbnail TEXT NOT NULL,
  is_main BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criação da tabela de coleções de cores
CREATE TABLE IF NOT EXISTS color_collections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  representative_color TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criação da tabela de cores
CREATE TABLE IF NOT EXISTS colors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  collection_id UUID REFERENCES color_collections(id) ON DELETE CASCADE,
  hex_code TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criação da tabela de lojas
CREATE TABLE IF NOT EXISTS stores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  phone TEXT,
  hours TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inserir dados de exemplo para produtos
INSERT INTO products (name, price, promo_price, image, description, is_promotion)
VALUES 
  ('Cimento Portland CP II 50kg', 39.90, 34.90, 'https://via.placeholder.com/300x300?text=Cimento', 'Cimento Portland de alta qualidade para construções residenciais e comerciais.', true),
  ('Argamassa Colante AC-II 20kg', 25.50, NULL, 'https://via.placeholder.com/300x300?text=Argamassa', 'Argamassa colante para assentamento de revestimentos cerâmicos em áreas internas e externas.', false),
  ('Tinta Acrílica Premium 18L', 189.90, 159.90, 'https://via.placeholder.com/300x300?text=Tinta', 'Tinta acrílica de alta qualidade para ambientes internos e externos.', true),
  ('Telha Cerâmica Portuguesa', 2.50, NULL, 'https://via.placeholder.com/300x300?text=Telha', 'Telha cerâmica tipo portuguesa, resistente e durável.', false),
  ('Torneira para Cozinha', 79.90, 69.90, 'https://via.placeholder.com/300x300?text=Torneira', 'Torneira para cozinha com acabamento cromado e bico móvel.', true);

-- Inserir dados de exemplo para coleções de cores
INSERT INTO color_collections (name, representative_color, description)
VALUES 
  ('Clássicas', '#A52A2A', 'Cores tradicionais que nunca saem de moda'),
  ('Naturais', '#228B22', 'Inspiradas na beleza da natureza'),
  ('Contemporâneas', '#4169E1', 'Cores modernas para ambientes sofisticados');

-- Inserir dados de exemplo para cores
INSERT INTO colors (name, collection_id, hex_code)
VALUES 
  ('Vermelho Colonial', (SELECT id FROM color_collections WHERE name = 'Clássicas' LIMIT 1), '#B22222'),
  ('Marrom Tabaco', (SELECT id FROM color_collections WHERE name = 'Clássicas' LIMIT 1), '#8B4513'),
  ('Verde Musgo', (SELECT id FROM color_collections WHERE name = 'Naturais' LIMIT 1), '#006400'),
  ('Azul Céu', (SELECT id FROM color_collections WHERE name = 'Naturais' LIMIT 1), '#87CEEB'),
  ('Cinza Urbano', (SELECT id FROM color_collections WHERE name = 'Contemporâneas' LIMIT 1), '#708090'),
  ('Roxo Intenso', (SELECT id FROM color_collections WHERE name = 'Contemporâneas' LIMIT 1), '#800080');

-- Inserir dados de exemplo para lojas
INSERT INTO stores (name, city, phone, hours)
VALUES 
  ('Turatti Centro', 'São Paulo', '(11) 3333-4444', 'Segunda a Sexta: 8h às 18h, Sábado: 8h às 13h'),
  ('Turatti Zona Sul', 'São Paulo', '(11) 5555-6666', 'Segunda a Sexta: 8h às 18h, Sábado: 8h às 13h'),
  ('Turatti Campinas', 'Campinas', '(19) 3333-4444', 'Segunda a Sexta: 8h às 18h, Sábado: 8h às 13h');
