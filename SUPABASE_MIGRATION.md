# Migrações do Banco de Dados Supabase

Este documento descreve o processo para atualizar o banco de dados Supabase para suportar o sistema de lojas e vendedores.

## O que estas migrações fazem

1. **Tabela `stores`**:
   - Adiciona colunas `icon_url` e `is_active` à tabela existente
   - Insere dados de exemplo para lojas

2. **Tabela `sellers`**:
   - Cria uma nova tabela para armazenar dados de vendedores
   - Associa vendedores às lojas (relação muitos-para-um)
   - Insere dados de exemplo para vendedores

## Como executar as migrações

### Opção 1: Via painel do Supabase (recomendado)

1. Faça login no [Dashboard do Supabase](https://app.supabase.com)
2. Selecione seu projeto
3. Navegue até "SQL Editor" no menu lateral
4. Clique em "New Query"
5. Cole o conteúdo do arquivo `SUPABASE_MIGRATION.sql` no editor
6. Clique em "Run" para executar a migração
7. Verifique se as tabelas foram criadas/atualizadas corretamente na seção "Table Editor"

### Opção 2: Via API local (em desenvolvimento)

Se estiver rodando o projeto localmente, você pode usar os endpoints da API para verificar e inicializar o banco de dados:

1. Inicie o servidor de desenvolvimento:
   ```
   npm run dev
   ```

2. Acesse o endpoint de migração no navegador:
   ```
   http://localhost:3000/api/db-migrations
   ```

3. Verifique se as tabelas foram criadas corretamente usando o endpoint:
   ```
   http://localhost:3000/api/check-sellers
   ```

## Verificação da migração

Após executar as migrações, verifique se:

1. A tabela `stores` possui as colunas `icon_url` e `is_active`
2. A tabela `sellers` existe e contém dados de exemplo
3. Ambas as tabelas têm políticas de segurança (RLS) configuradas corretamente

## Resolução de problemas

Se encontrar erros durante a migração:

1. Verifique se você tem permissões de administrador no projeto Supabase
2. Confirme se a extensão `uuid-ossp` está habilitada no seu banco de dados
3. Verifique se as tabelas já existem antes de tentar criar novamente
4. Procure erros específicos no console do Supabase

Para assistência adicional, consulte a [documentação do Supabase](https://supabase.com/docs) ou abra uma issue no repositório do projeto. 