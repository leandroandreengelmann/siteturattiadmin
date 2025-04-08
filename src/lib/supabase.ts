import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';

// Verificar se as variáveis de ambiente necessárias estão definidas
if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  console.error('Erro: NEXT_PUBLIC_SUPABASE_URL não está definido');
}

if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  console.error('Erro: NEXT_PUBLIC_SUPABASE_ANON_KEY não está definido');
}

// Usar valores das variáveis de ambiente ou valores padrão como fallback
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://jxdycbctvnhaojsfbadd.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp4ZHljYmN0dm5oYW9qc2ZiYWRkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM5OTQ4OTYsImV4cCI6MjA1OTU3MDg5Nn0.5wzf0Op1tNTMSB1L9l_ysqA8sc4oiFKYPS-XPiIPejQ';

// Criar o cliente Supabase com configurações de segurança e opções adicionais
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});
