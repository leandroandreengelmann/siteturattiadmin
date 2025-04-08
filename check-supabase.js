// Script para verificar a conexão com o Supabase e a existência das tabelas
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Obter credenciais do ambiente
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('=== Verificação do Supabase ===');
console.log(`URL: ${supabaseUrl}`);

// Criar cliente Supabase
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Tabelas para verificar
const tables = ['products', 'color_collections', 'colors', 'stores'];

// Testar conexão e verificar tabelas
async function checkTables() {
  console.log('\nVerificando conexão e tabelas...');
  
  try {
    for (const table of tables) {
      const { data, error } = await supabase
        .from(table)
        .select('id')
        .limit(1);
      
      if (error) {
        if (error.code === 'PGRST116') {
          console.log(`❌ Tabela '${table}' não encontrada ou sem permissão de acesso`);
        } else {
          console.log(`❌ Erro ao verificar tabela '${table}': ${error.message}`);
        }
      } else {
        console.log(`✅ Tabela '${table}' encontrada`);
        
        // Contar registros
        const { count, error: countError } = await supabase
          .from(table)
          .select('*', { count: 'exact', head: true });
        
        if (!countError) {
          console.log(`   Total de registros: ${count}`);
        }
      }
    }
    
    console.log('\n=== Resumo ===');
    console.log('Se alguma tabela não foi encontrada, siga as instruções em SUPABASE_SETUP.md para criar o esquema do banco de dados.');
    console.log('URL do Dashboard do Supabase: https://app.supabase.com/');
    
  } catch (error) {
    console.error('\n❌ Erro ao conectar com o Supabase:', error.message);
    console.log('\nVerifique se:');
    console.log('1. As credenciais no arquivo .env.local estão corretas');
    console.log('2. Você tem acesso ao projeto no Supabase');
    console.log('3. O projeto foi criado corretamente');
  }
}

checkTables(); 