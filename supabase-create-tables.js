// Script para criar tabelas e inserir dados no Supabase
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Obter credenciais do ambiente
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('Conectando ao Supabase...');
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function setupDatabase() {
  try {
    console.log('Iniciando configuração do banco de dados...');
    
    // Verificar se as tabelas já existem
    const { data: tables, error: tablesError } = await supabase
      .from('products')
      .select('count(*)');
    
    if (!tablesError) {
      console.log('✓ Tabelas já existem no banco de dados');
      console.log('  Para recriar as tabelas, exclua-as manualmente no Dashboard do Supabase');
      return;
    }
    
    // Criar tabela de produtos
    console.log('Criando tabela de produtos...');
    await supabase.rpc('create_table_products');
    
    // Criar tabela de coleções de cores
    console.log('Criando tabela de coleções de cores...');
    await supabase.rpc('create_table_color_collections');
    
    // Criar tabela de cores
    console.log('Criando tabela de cores...');
    await supabase.rpc('create_table_colors');
    
    // Criar tabela de lojas
    console.log('Criando tabela de lojas...');
    await supabase.rpc('create_table_stores');
    
    // Criar tabela de imagens de produtos
    console.log('Criando tabela de imagens de produtos...');
    await supabase.rpc('create_table_product_images');
    
    console.log('Tabelas criadas com sucesso! Por favor, acesse o Dashboard do Supabase para verificar.');
    console.log('URL do Dashboard: https://app.supabase.com/');
    
  } catch (error) {
    console.error('Erro ao configurar banco de dados:', error);
    console.log('\nPara criar as tabelas manualmente:');
    console.log('1. Acesse o Dashboard do Supabase: https://app.supabase.com/');
    console.log('2. Vá para a seção SQL Editor');
    console.log('3. Execute o conteúdo do arquivo supabase-schema.sql');
  }
}

setupDatabase(); 