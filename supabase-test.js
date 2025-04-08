// Script para testar a conexão com o Supabase
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Obter credenciais do ambiente
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('Tentando conectar ao Supabase usando:');
console.log(`URL: ${supabaseUrl}`);
console.log(`Chave: ${supabaseAnonKey.substring(0, 10)}...${supabaseAnonKey.substring(supabaseAnonKey.length - 10)}`);

// Criar cliente Supabase
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Testar conexão buscando informações do banco
async function testConnection() {
  try {
    console.log('\nTestando conexão...');
    
    // Tentar buscar produtos
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*')
      .limit(1);
    
    if (productsError) {
      console.error('Erro ao buscar produtos:', productsError);
    } else {
      console.log('\n✅ Conexão bem-sucedida!');
      console.log(`Encontrado ${products.length} produto(s) na tabela 'products'`);
      
      if (products.length > 0) {
        console.log('Exemplo de produto:');
        console.log(products[0]);
      }
    }
    
  } catch (error) {
    console.error('Erro ao testar conexão:', error);
  }
}

testConnection(); 