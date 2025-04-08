# Turatti Store - E-commerce de Materiais para Construção

## Sobre o Projeto

Turatti Store é um site de e-commerce especializado em materiais para construção. Desenvolvido com Next.js 15 e integrado com o Supabase para gerenciamento de dados e autenticação.

## Tecnologias Utilizadas

- **Frontend**: Next.js 15, React 19, TailwindCSS
- **Backend/DB**: Supabase (PostgreSQL)
- **Autenticação**: Supabase Auth
- **Estilização**: TailwindCSS

## Requisitos

- Node.js 18+
- Conta no Supabase

## Configuração

### 1. Instalação de Dependências

```bash
npm install
```

### 2. Configuração do Supabase

Siga as instruções detalhadas no arquivo [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) para configurar o banco de dados Supabase.

Você pode verificar a conexão com o Supabase executando:

```bash
node check-supabase.js
```

### 3. Configuração do Ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```
NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
```

### 4. Desenvolvimento Local

```bash
npm run dev
```

Acesse `http://localhost:3000` para ver o site.

## Estrutura do Projeto

```
/src
  /app             # Rotas e páginas Next.js
  /components      # Componentes React
  /data            # Tipos e dados estáticos
  /lib             # Configurações e utilitários
  /services        # Serviços de integração com APIs
/public            # Arquivos estáticos
```

## Recursos

- Catálogo de produtos
- Seção de cores Suvinil
- Área administrativa (protegida por autenticação)
- Layout responsivo

## Licença

Este projeto é licenciado sob a licença MIT - veja o arquivo LICENSE para detalhes.
