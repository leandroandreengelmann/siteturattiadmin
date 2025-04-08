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
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT unique_store_name UNIQUE (name)
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
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT unique_seller_per_store UNIQUE (name, store_id)
);

-- 3. Inserir dados de exemplo para lojas (se não existirem)
-- Primeiro verificamos se a loja existe
DO $$
DECLARE
  store_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO store_count FROM stores WHERE name = 'Turatti Centro';
  
  IF store_count = 0 THEN
    INSERT INTO stores (name, city, phone, hours, icon_url, is_active)
    VALUES ('Turatti Centro', 'Matupá', '(66) 3595-1234', 'Segunda a Sexta: 8h às 18h, Sábado: 8h às 13h', '', TRUE);
  END IF;
  
  SELECT COUNT(*) INTO store_count FROM stores WHERE name = 'Turatti Peixoto';
  
  IF store_count = 0 THEN
    INSERT INTO stores (name, city, phone, hours, icon_url, is_active)
    VALUES ('Turatti Peixoto', 'Peixoto de Azevedo', '(66) 3575-5678', 'Segunda a Sexta: 8h às 18h, Sábado: 8h às 13h', '', TRUE);
  END IF;
END $$;

-- 4. Inserir dados de exemplo para vendedores 
-- Verificamos primeiro se já existem, para evitar duplicatas
DO $$
DECLARE
  centro_id UUID;
  peixoto_id UUID;
  seller_count INTEGER;
BEGIN
  -- Obter IDs das lojas
  SELECT id INTO centro_id FROM stores WHERE name = 'Turatti Centro' LIMIT 1;
  SELECT id INTO peixoto_id FROM stores WHERE name = 'Turatti Peixoto' LIMIT 1;
  
  -- Inserir vendedores para Turatti Centro
  IF centro_id IS NOT NULL THEN
    -- João Silva
    SELECT COUNT(*) INTO seller_count FROM sellers 
    WHERE name = 'João Silva' AND store_id = centro_id;
    
    IF seller_count = 0 THEN
      INSERT INTO sellers (name, store_id, whatsapp, is_active)
      VALUES ('João Silva', centro_id, '5566999991111', TRUE);
    END IF;
    
    -- Maria Oliveira
    SELECT COUNT(*) INTO seller_count FROM sellers 
    WHERE name = 'Maria Oliveira' AND store_id = centro_id;
    
    IF seller_count = 0 THEN
      INSERT INTO sellers (name, store_id, whatsapp, is_active)
      VALUES ('Maria Oliveira', centro_id, '5566999992222', TRUE);
    END IF;
  END IF;
  
  -- Inserir vendedores para Turatti Peixoto
  IF peixoto_id IS NOT NULL THEN
    -- Pedro Santos
    SELECT COUNT(*) INTO seller_count FROM sellers 
    WHERE name = 'Pedro Santos' AND store_id = peixoto_id;
    
    IF seller_count = 0 THEN
      INSERT INTO sellers (name, store_id, whatsapp, is_active)
      VALUES ('Pedro Santos', peixoto_id, '5566999993333', TRUE);
    END IF;
    
    -- Ana Souza
    SELECT COUNT(*) INTO seller_count FROM sellers 
    WHERE name = 'Ana Souza' AND store_id = peixoto_id;
    
    IF seller_count = 0 THEN
      INSERT INTO sellers (name, store_id, whatsapp, is_active)
      VALUES ('Ana Souza', peixoto_id, '5566999994444', TRUE);
    END IF;
  END IF;
END $$;

-- 5. Adicionar políticas de segurança para acesso às tabelas
-- Políticas para a tabela stores
DO $$
BEGIN
  -- SELECT policy
  IF NOT EXISTS (
    SELECT FROM pg_policies 
    WHERE tablename = 'stores' AND policyname = 'Allow anonymous select on stores'
  ) THEN
    CREATE POLICY "Allow anonymous select on stores" 
    ON stores FOR SELECT 
    USING (true);
  END IF;
  
  -- INSERT policy
  IF NOT EXISTS (
    SELECT FROM pg_policies 
    WHERE tablename = 'stores' AND policyname = 'Allow anonymous insert on stores'
  ) THEN
    CREATE POLICY "Allow anonymous insert on stores" 
    ON stores FOR INSERT 
    WITH CHECK (true);
  END IF;
  
  -- UPDATE policy
  IF NOT EXISTS (
    SELECT FROM pg_policies 
    WHERE tablename = 'stores' AND policyname = 'Allow anonymous update on stores'
  ) THEN
    CREATE POLICY "Allow anonymous update on stores" 
    ON stores FOR UPDATE 
    USING (true) 
    WITH CHECK (true);
  END IF;
  
  -- DELETE policy
  IF NOT EXISTS (
    SELECT FROM pg_policies 
    WHERE tablename = 'stores' AND policyname = 'Allow anonymous delete on stores'
  ) THEN
    CREATE POLICY "Allow anonymous delete on stores" 
    ON stores FOR DELETE 
    USING (true);
  END IF;
END $$;

-- Políticas para a tabela sellers
DO $$
BEGIN
  -- SELECT policy
  IF NOT EXISTS (
    SELECT FROM pg_policies 
    WHERE tablename = 'sellers' AND policyname = 'Allow anonymous select on sellers'
  ) THEN
    CREATE POLICY "Allow anonymous select on sellers" 
    ON sellers FOR SELECT 
    USING (true);
  END IF;
  
  -- INSERT policy
  IF NOT EXISTS (
    SELECT FROM pg_policies 
    WHERE tablename = 'sellers' AND policyname = 'Allow anonymous insert on sellers'
  ) THEN
    CREATE POLICY "Allow anonymous insert on sellers" 
    ON sellers FOR INSERT 
    WITH CHECK (true);
  END IF;
  
  -- UPDATE policy
  IF NOT EXISTS (
    SELECT FROM pg_policies 
    WHERE tablename = 'sellers' AND policyname = 'Allow anonymous update on sellers'
  ) THEN
    CREATE POLICY "Allow anonymous update on sellers" 
    ON sellers FOR UPDATE 
    USING (true) 
    WITH CHECK (true);
  END IF;
  
  -- DELETE policy
  IF NOT EXISTS (
    SELECT FROM pg_policies 
    WHERE tablename = 'sellers' AND policyname = 'Allow anonymous delete on sellers'
  ) THEN
    CREATE POLICY "Allow anonymous delete on sellers" 
    ON sellers FOR DELETE 
    USING (true);
  END IF;
END $$;

-- Habilitar RLS (Row Level Security) nas tabelas
ALTER TABLE stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE sellers ENABLE ROW LEVEL SECURITY; 