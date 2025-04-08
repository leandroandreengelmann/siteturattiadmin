# Guia de Configuração do Supabase para o Projeto Turatti

Este guia explica como configurar manualmente o banco de dados Supabase para o projeto Turatti Store.

## 1. Acessar o Painel do Supabase

1. Acesse [https://app.supabase.com](https://app.supabase.com)
2. Faça login na sua conta
3. Selecione o projeto que você criou para o Turatti Store

## 2. Criar as Tabelas e Inserir Dados Iniciais

1. No menu lateral esquerdo, clique em **SQL Editor**
2. Clique em **+ New Query**
3. Copie e cole o conteúdo do arquivo `supabase-schema.sql` no editor
4. Clique em **Run** para executar o script
5. Verifique se não houve erros na execução

## 3. Criar o Usuário Administrativo

1. No menu lateral esquerdo, clique em **SQL Editor**
2. Clique em **+ New Query**
3. Copie e cole o conteúdo do arquivo `supabase-admin-user.sql` no editor
4. Clique em **Run** para executar o script
5. Verifique se não houve erros na execução

## 4. Verificar as Tabelas Criadas

1. No menu lateral esquerdo, clique em **Table Editor**
2. Você deverá ver as seguintes tabelas:
   - `products`
   - `color_collections`
   - `colors`
   - `stores`
3. Clique em cada tabela para verificar se os dados foram inseridos corretamente

## 5. Verificar o Usuário Administrativo

1. No menu lateral esquerdo, clique em **Authentication**
2. Clique em **Users**
3. Você deverá ver um usuário com o email `admin@turatti.com`

## 6. Testar o Login no Site

1. Acesse o site Turatti Store (http://localhost:3003)
2. Clique no link de login administrativo no rodapé
3. Faça login com as seguintes credenciais:
   - Email: `admin@turatti.com`
   - Senha: `admin`
4. Você deverá ser redirecionado para o painel administrativo

## Credenciais do Supabase

- URL: `https://jxdycbctvnhaojsfbadd.supabase.co`
- Chave Anônima: Configurada no arquivo `.env.local`

## Observações

- Caso encontre algum erro durante a execução dos scripts, verifique os logs de erro no painel do Supabase
- Se necessário, você pode executar os scripts SQL em partes, separando as criações de tabelas e as inserções de dados
- Lembre-se de que em um ambiente de produção, você deve usar senhas fortes e seguras para os usuários administrativos
