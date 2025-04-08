-- Script para criar um usuário administrativo no Supabase
-- Este script deve ser executado no SQL Editor do Supabase

-- Primeiro, precisamos verificar se a extensão de autenticação está habilitada
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Inserir um usuário administrativo na tabela auth.users
-- Substitua os valores conforme necessário
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  recovery_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  uuid_generate_v4(),
  'authenticated',
  'authenticated',
  'admin@turatti.com',
  -- Senha: admin (criptografada)
  crypt('admin', gen_salt('bf')),
  now(),
  null,
  now(),
  '{"provider": "email", "providers": ["email"]}',
  '{"name": "Admin Turatti"}',
  now(),
  now(),
  '',
  '',
  '',
  ''
);

-- Nota: Este script cria um usuário com email admin@turatti.com e senha admin
-- Em um ambiente de produção, você deve usar uma senha forte e segura
