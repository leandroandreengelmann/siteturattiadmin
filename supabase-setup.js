// Script para configurar o Supabase automaticamente
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Definir credenciais do Supabase diretamente
const supabaseUrl = 'https://jxdycbctvnhaojsfbadd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp4ZHljYmN0dm5oYW9qc2ZiYWRkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM5OTQ4OTYsImV4cCI6MjA1OTU3MDg5Nn0.5wzf0Op1tNTMSB1L9l_ysqA8sc4oiFKYPS-XPiIPejQ';

console.log('Usando as seguintes credenciais do Supabase:');
console.log(`URL: ${supabaseUrl}`);
console.log(`Chave: ${supabaseKey.substring(0, 10)}...${supabaseKey.substring(supabaseKey.length - 10)}`);


// Criar cliente Supabase
const supabase = createClient(supabaseUrl, supabaseKey);

// Ler e executar o script de esquema
async function setupDatabase() {
  try {
    console.log('Iniciando configuração do banco de dados Supabase...');

    // Ler o arquivo de esquema SQL
    const schemaPath = path.join(__dirname, 'supabase-schema.sql');
    const schemaSQL = fs.readFileSync(schemaPath, 'utf8');

    // Executar o script de esquema
    console.log('Criando tabelas e inserindo dados iniciais...');
    const { error: schemaError } = await supabase.rpc('exec_sql', { sql: schemaSQL });
    
    if (schemaError) {
      console.error('Erro ao executar o script de esquema:', schemaError);
      console.log('\nVocê pode precisar executar o script manualmente no SQL Editor do Supabase.');
      console.log('Acesse: https://app.supabase.com/project/_/sql');
      console.log('E execute o conteúdo do arquivo supabase-schema.sql');
    } else {
      console.log('Tabelas criadas e dados iniciais inseridos com sucesso!');
    }

    // Ler o arquivo de usuário admin SQL
    const adminUserPath = path.join(__dirname, 'supabase-admin-user.sql');
    const adminUserSQL = fs.readFileSync(adminUserPath, 'utf8');

    // Executar o script de usuário admin
    console.log('\nCriando usuário administrativo...');
    const { error: adminError } = await supabase.rpc('exec_sql', { sql: adminUserSQL });
    
    if (adminError) {
      console.error('Erro ao criar usuário administrativo:', adminError);
      console.log('\nVocê pode precisar criar o usuário manualmente no SQL Editor do Supabase.');
      console.log('Acesse: https://app.supabase.com/project/_/sql');
      console.log('E execute o conteúdo do arquivo supabase-admin-user.sql');
    } else {
      console.log('Usuário administrativo criado com sucesso!');
      console.log('Email: admin@turatti.com');
      console.log('Senha: admin');
    }

    console.log('\nConfigurações concluídas. Você já pode acessar o site e o painel administrativo.');

  } catch (error) {
    console.error('Erro durante a configuração:', error);
    console.log('\nVocê precisará executar os scripts manualmente no SQL Editor do Supabase:');
    console.log('1. Acesse: https://app.supabase.com/project/_/sql');
    console.log('2. Execute o conteúdo do arquivo supabase-schema.sql');
    console.log('3. Execute o conteúdo do arquivo supabase-admin-user.sql');
  }
}

setupDatabase();
