import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // Verificar se a tabela sellers existe
    const { count, error: countError } = await supabase
      .from('sellers')
      .select('*', { count: 'exact', head: true });
    
    // Se não houver erro, a tabela existe
    if (!countError) {
      // Buscar todos os vendedores
      const { data: sellers, error: sellersError } = await supabase
        .from('sellers')
        .select('*, stores(name, city)');
      
      return NextResponse.json({
        success: true,
        tableExists: true,
        count,
        sellers: sellers || [],
        error: sellersError ? sellersError.message : null
      });
    } else {
      return NextResponse.json({
        success: false,
        tableExists: false,
        error: countError.message,
        message: 'A tabela de vendedores não existe ou não está acessível. Execute a migração do banco de dados no painel do Supabase.'
      });
    }
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        message: 'Erro ao verificar tabela de vendedores'
      },
      { status: 500 }
    );
  }
} 