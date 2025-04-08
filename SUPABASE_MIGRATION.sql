-- Script de migração para o Supabase
-- Execute este script no Editor SQL do painel do Supabase

-- Extensão necessária para gerar UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Atualizar tabela de lojas (stores)
-- Verificar se a tabela já existe, caso contrário, criar
CREATE TABLE IF NOT EXISTS stores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  phone TEXT,
  hours TEXT,
  icon_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Adicionar coluna icon_url se não existir
DO $$ 
BEGIN 
  IF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_name = 'stores' AND column_name = 'icon_url'
  ) THEN
    ALTER TABLE stores ADD COLUMN icon_url TEXT;
  END IF;
END $$;

-- Adicionar coluna is_active se não existir
DO $$ 
BEGIN 
  IF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_name = 'stores' AND column_name = 'is_active'
  ) THEN
    ALTER TABLE stores ADD COLUMN is_active BOOLEAN DEFAULT TRUE;
  END IF;
END $$;

-- 2. Criar tabela de vendedores (sellers)
CREATE TABLE IF NOT EXISTS sellers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
  whatsapp TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Inserir dados de exemplo para lojas (se não existirem)
INSERT INTO stores (name, city, phone, hours, icon_url, is_active)
VALUES 
  ('Turatti Centro', 'Matupá', '(66) 3595-1234', 'Segunda a Sexta: 8h às 18h, Sábado: 8h às 13h', 'https://cdn-icons-png.flaticon.com/512/2449/2449322.png', TRUE),
  ('Turatti Peixoto', 'Peixoto de Azevedo', '(66) 3575-5678', 'Segunda a Sexta: 8h às 18h, Sábado: 8h às 13h', 'https://cdn-icons-png.flaticon.com/512/3820/3820307.png', TRUE)
ON CONFLICT (name) DO NOTHING;

-- 4. Inserir dados de exemplo para vendedores (com referência às lojas correspondentes)
-- João e Maria para Turatti Centro
WITH store_centro AS (SELECT id FROM stores WHERE name = 'Turatti Centro' LIMIT 1)
INSERT INTO sellers (name, store_id, whatsapp, is_active)
SELECT 'João Silva', id, '5566999991111', TRUE FROM store_centro
ON CONFLICT (name, store_id) DO NOTHING;

WITH store_centro AS (SELECT id FROM stores WHERE name = 'Turatti Centro' LIMIT 1)
INSERT INTO sellers (name, store_id, whatsapp, is_active)
SELECT 'Maria Oliveira', id, '5566999992222', TRUE FROM store_centro
ON CONFLICT (name, store_id) DO NOTHING;

-- Pedro e Ana para Turatti Peixoto
WITH store_peixoto AS (SELECT id FROM stores WHERE name = 'Turatti Peixoto' LIMIT 1)
INSERT INTO sellers (name, store_id, whatsapp, is_active)
SELECT 'Pedro Santos', id, '5566999993333', TRUE FROM store_peixoto
ON CONFLICT (name, store_id) DO NOTHING;

WITH store_peixoto AS (SELECT id FROM stores WHERE name = 'Turatti Peixoto' LIMIT 1)
INSERT INTO sellers (name, store_id, whatsapp, is_active)
SELECT 'Ana Souza', id, '5566999994444', TRUE FROM store_peixoto
ON CONFLICT (name, store_id) DO NOTHING;

-- 5. Adicionar políticas de segurança para acesso anônimo às tabelas
-- Política para leitura anônima da tabela stores
DROP POLICY IF EXISTS "Allow anonymous select on stores" ON stores;
CREATE POLICY "Allow anonymous select on stores" 
ON stores FOR SELECT 
TO anon
USING (true);

-- Política para leitura anônima da tabela sellers
DROP POLICY IF EXISTS "Allow anonymous select on sellers" ON sellers;
CREATE POLICY "Allow anonymous select on sellers" 
ON sellers FOR SELECT 
TO anon
USING (true);

-- Habilitar RLS (Row Level Security) nas tabelas
ALTER TABLE stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE sellers ENABLE ROW LEVEL SECURITY; 