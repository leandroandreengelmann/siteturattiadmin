import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

type TableStatus = {
  status: string;
  count?: number;
  error?: string;
};

export async function GET() {
  try {
    // Verificar conexão com o Supabase
    const tables = ['products', 'color_collections', 'colors', 'stores'];
    const status = {
      connection: 'ok',
      supabase_url: process.env.NEXT_PUBLIC_SUPABASE_URL,
      tables: {} as Record<string, TableStatus>,
    };

    // Verificar tabelas
    for (const table of tables) {
      try {
        // Primeiro verificamos se a tabela existe fazendo uma consulta simples
        const { error: existsError } = await supabase
          .from(table)
          .select('id')
          .limit(1);

        if (existsError) {
          status.tables[table] = { status: 'error', error: existsError.message };
          continue;
        }

        // Se a tabela existe, fazemos uma consulta para contar os registros
        const { count, error: countError } = await supabase
          .from(table)
          .select('*', { count: 'exact', head: true });

        if (countError) {
          status.tables[table] = { status: 'error', error: countError.message };
        } else {
          status.tables[table] = { status: 'ok', count: count || 0 };
        }
      } catch (error: any) {
        status.tables[table] = { status: 'error', error: error.message };
      }
    }

    return NextResponse.json(status);
  } catch (error: any) {
    return NextResponse.json(
      { 
        connection: 'error', 
        error: error.message 
      },
      { status: 500 }
    );
  }
} 