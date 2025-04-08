import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const status: any = {
      timestamp: new Date().toISOString(),
      supabase: {
        url: process.env.NEXT_PUBLIC_SUPABASE_URL || 'Não definido',
        connection: 'Verificando...',
        tables: {},
        auth: 'Verificando...'
      },
      environment: process.env.NODE_ENV
    };

    // Verificar conexão com o Supabase
    try {
      const { data: pingData, error: pingError } = await supabase.from('products').select('count(*)', { count: 'exact', head: true });
      
      if (pingError) {
        status.supabase.connection = `Erro: ${pingError.message}`;
        if (pingError.code === 'PGRST116') {
          status.supabase.connection = 'Erro de Schema: Tabela não encontrada';
        }
      } else {
        status.supabase.connection = 'OK';
      }
    } catch (e: any) {
      status.supabase.connection = `Exceção: ${e.message}`;
    }

    // Verificar tabelas principais
    const tables = ['products', 'product_images', 'colors', 'color_collections', 'stores', 'banners'];
    
    for (const table of tables) {
      try {
        const { data, error, count } = await supabase
          .from(table)
          .select('*', { count: 'exact', head: true });
        
        if (error) {
          status.supabase.tables[table] = {
            exists: false,
            error: error.message,
            code: error.code
          };
        } else {
          status.supabase.tables[table] = {
            exists: true,
            count: count || 0
          };
        }
      } catch (e: any) {
        status.supabase.tables[table] = {
          exists: false,
          error: e.message
        };
      }
    }

    // Verificar autenticação
    try {
      const { data, error } = await supabase.auth.getSession();
      status.supabase.auth = error ? `Erro: ${error.message}` : (data.session ? 'Autenticado' : 'Não autenticado');
    } catch (e: any) {
      status.supabase.auth = `Exceção: ${e.message}`;
    }

    return NextResponse.json(status);
  } catch (error: any) {
    return NextResponse.json(
      { 
        error: 'Erro ao executar diagnóstico',
        message: error.message,
        stack: error.stack
      },
      { status: 500 }
    );
  }
} 