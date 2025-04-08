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

// Log de informações para debug
console.log('Ambiente: ', process.env.NODE_ENV);
console.log('Supabase URL: ', supabaseUrl);

// Criar o cliente Supabase com configurações de segurança e tratamento adequado de erros
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
    storage: globalThis?.localStorage,
    storageKey: 'turatti-store-auth',
    debug: process.env.NODE_ENV === 'development'
  },
  global: {
    // Melhor tratamento de erros no nível global
    fetch: (...args) => {
      // Adiciona um cache buster a cada requisição
      const [url, config] = args;
      
      // Se for uma URL string e não um objeto Request
      if (typeof url === 'string') {
        const separator = url.includes('?') ? '&' : '?';
        const newUrl = `${url}${separator}_t=${Date.now()}`;
        args[0] = newUrl;
      }
      
      // Adicionar headers anti-cache
      if (config && typeof config === 'object') {
        config.headers = {
          ...config.headers,
          'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
          'Pragma': 'no-cache',
          'Expires': '0'
        };
      }
      
      return fetch(...args).catch(error => {
        console.error('Erro na requisição Supabase:', error);
        throw error;
      });
    }
  },
  db: {
    schema: 'public',
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});
