import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // Criar usuário administrador
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: 'admin@turatti.com',
      password: 'admin123',
      email_confirm: true,
      user_metadata: {
        name: 'Administrador',
        role: 'admin'
      }
    });

    if (authError && !authError.message.includes('already exists')) {
      return NextResponse.json({
        success: false,
        message: 'Erro ao criar usuário administrador',
        error: authError.message
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: authError ? 'Usuário administrador já existe' : 'Usuário administrador criado com sucesso',
      user: authData?.user || null
    });
  } catch (error: any) {
    console.error('Erro durante a configuração da autenticação:', error);
    return NextResponse.json({
      success: false,
      message: 'Erro durante a configuração da autenticação',
      error: error.message
    }, { status: 500 });
  }
} 