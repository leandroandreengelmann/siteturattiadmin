# Configuração do Supabase para o Projeto Turatti Store

Este guia fornece instruções detalhadas para configurar o Supabase como banco de dados para o projeto Turatti Store.

## 1. Criação da Conta e Projeto no Supabase

1. Acesse [https://supabase.com](https://supabase.com) e crie uma conta ou faça login
2. Clique em "New Project"
3. Preencha os dados do projeto:
   - Nome: `turatti-store`
   - Senha do banco de dados: Crie uma senha forte
   - Região: Escolha a mais próxima de você
   - Plano: Free tier
4. Clique em "Create new project"
5. Aguarde a criação do projeto (pode levar alguns minutos)

## 2. Configuração das Variáveis de Ambiente

1. No dashboard do Supabase, clique em "Project Settings" (ícone de engrenagem)
2. Clique em "API" no menu lateral
3. Copie a "URL" e a "anon public" key
4. No projeto, crie ou edite o arquivo `.env.local` na raiz:

```
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anonima
```

## 3. Criação do Esquema do Banco de Dados

1. No dashboard do Supabase, clique em "SQL Editor" no menu lateral
2. Clique em "New Query"
3. Copie e cole o conteúdo do arquivo `supabase-schema.sql`
4. Clique em "Run" para executar o script
5. Verifique se não houve erros na execução

## 4. Criação do Usuário Administrativo (Opcional)

1. No dashboard do Supabase, clique em "SQL Editor" no menu lateral
2. Clique em "New Query"
3. Copie e cole o conteúdo do arquivo `supabase-admin-user.sql`
4. Clique em "Run" para executar o script
5. Verifique se não houve erros na execução

## 5. Verificação das Tabelas Criadas

1. No dashboard do Supabase, clique em "Table Editor" no menu lateral
2. Verifique se as seguintes tabelas foram criadas:
   - `products`
   - `color_collections`
   - `colors`
   - `stores`
3. Clique em cada tabela para verificar se os dados foram inseridos corretamente

## 6. Configuração do Supabase Auth (para Login/Autenticação)

1. No dashboard do Supabase, clique em "Authentication" no menu lateral
2. Clique em "Providers"
3. Habilite o Email provider com as seguintes configurações:
   - Disable Email Confirmations: Ativado (para facilitar testes)
4. Clique em "Save"

## 7. Ajuste das Permissões de Acesso (Políticas de Segurança)

1. No dashboard do Supabase, clique em "Table Editor" no menu lateral
2. Para cada tabela, clique no ícone de "..." e selecione "Edit Policies"
3. Adicione políticas de acesso conforme necessário:
   - Para leitura pública: `true`
   - Para escrita apenas por usuários autenticados: `auth.role() = 'authenticated'`

## 8. Testando o Projeto

1. Execute o projeto localmente:
   ```
   npm run dev
   ```
2. Acesse o site em `http://localhost:3000`
3. O site deve estar conectado ao Supabase e exibindo os dados das tabelas

## Problemas Comuns e Soluções

### Problemas de Banco de Dados
- **Erro de CORS**: Verifique se a URL do site está adicionada nas configurações de CORS no Supabase
- **Erro de Autenticação**: Verifique se as chaves estão corretas no arquivo `.env.local`
- **Tabelas não encontradas**: Verifique se o script SQL foi executado com sucesso
- **Dados não aparecem**: Verifique as políticas de segurança das tabelas

### Problemas com Tailwind CSS
- **Erro `@layer base` is used but no matching `@tailwind base` directive is present**: Certifique-se de que o arquivo `globals.css` inclui as diretivas corretas do Tailwind:
  ```css
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
  ```
- **Problemas de estilo ausente**: Verifique se o `tailwind.config.js` está configurado corretamente para incluir todos os arquivos de componentes

## Referências Úteis

- [Documentação do Supabase](https://supabase.com/docs)
- [Supabase com Next.js](https://supabase.com/docs/guides/getting-started/tutorials/with-nextjs)
- [Políticas de Segurança do Supabase](https://supabase.com/docs/guides/auth/row-level-security) 