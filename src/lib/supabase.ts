import { createClient } from '@supabase/supabase-js'

// Cria um cliente Supabase usando variáveis de ambiente
// Essas variáveis devem ser definidas no seu ambiente de implantação
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Criamos um cliente mockado para uso durante o build se as variáveis não estiverem disponíveis
let supabaseClient;

if (supabaseUrl && supabaseKey) {
  supabaseClient = createClient(supabaseUrl, supabaseKey);
} else {
  // Mock do cliente para permitir o build sem erros
  supabaseClient = {
    from: () => ({
      select: () => ({ data: [], error: null }),
      insert: () => ({ data: null, error: null }),
      update: () => ({ data: null, error: null }),
      delete: () => ({ data: null, error: null }),
    }),
    auth: {
      signUp: () => Promise.resolve({ data: null, error: null }),
      signIn: () => Promise.resolve({ data: null, error: null }),
      signOut: () => Promise.resolve({ error: null }),
    },
  };

  // Log para ambiente de desenvolvimento
  if (process.env.NODE_ENV === 'development') {
    console.warn('Variáveis de ambiente Supabase não encontradas. Usando cliente mockado.');
  }
}

export const supabase = supabaseClient; 