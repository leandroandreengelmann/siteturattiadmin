import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';

// Função para verificar se uma string é uma URL válida
function isValidUrl(urlString: string): boolean {
  try {
    new URL(urlString);
    return true;
  } catch (e) {
    return false;
  }
}

// Verificar se as variáveis de ambiente necessárias estão definidas e são válidas
const envSupabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const envSupabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Valores padrão seguros para desenvolvimento
const defaultSupabaseUrl = 'https://jxdycbctvnhaojsfbadd.supabase.co';
const defaultSupabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp4ZHljYmN0dm5oYW9qc2ZiYWRkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM5OTQ4OTYsImV4cCI6MjA1OTU3MDg5Nn0.5wzf0Op1tNTMSB1L9l_ysqA8sc4oiFKYPS-XPiIPejQ';

// Verificar e usar valores válidos
const supabaseUrl = (envSupabaseUrl && isValidUrl(envSupabaseUrl)) 
  ? envSupabaseUrl 
  : defaultSupabaseUrl;

const supabaseAnonKey = envSupabaseKey || defaultSupabaseKey;

if (!envSupabaseUrl || !isValidUrl(envSupabaseUrl)) {
  console.warn('Aviso: Usando URL padrão do Supabase porque NEXT_PUBLIC_SUPABASE_URL não está definido ou é inválido');
}

if (!envSupabaseKey) {
  console.warn('Aviso: Usando chave anônima padrão do Supabase porque NEXT_PUBLIC_SUPABASE_ANON_KEY não está definido');
}

// Criar o cliente Supabase com configurações de segurança e opções adicionais
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});
