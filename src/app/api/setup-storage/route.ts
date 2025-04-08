import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const results: any = {
      buckets: {},
      policies: {}
    };

    // 1. Criar bucket de imagens se não existir
    try {
      const { data: bucketData, error: bucketError } = await supabase.storage
        .createBucket('images', {
          public: true,
          fileSizeLimit: 10485760, // 10MB
          allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif', 'image/webp']
        });

      results.buckets.images = bucketError 
        ? { success: false, message: bucketError.message }
        : { success: true, message: 'Bucket criado ou já existente' };
    } catch (err: any) {
      results.buckets.images = { success: false, message: err.message };
    }

    // 2. Configurar políticas para acesso anônimo ao bucket
    try {
      // Política para listar arquivos publicamente
      const { data: listPolicyData, error: listPolicyError } = await supabase.rpc('exec_sql', {
        query_text: `
          BEGIN;
          -- Adiciona política para listar arquivos
          INSERT INTO storage.policies (name, bucket_id, definition, actions, tenant)
          VALUES ('Acesso público para listar arquivos', 'images', 'true', ARRAY['SELECT'], 'authenticated')
          ON CONFLICT (name, bucket_id, actions[1], tenant) DO NOTHING;
          
          -- Adiciona política para downloads anônimos
          INSERT INTO storage.policies (name, bucket_id, definition, actions, tenant)
          VALUES ('Download anônimo', 'images', 'true', ARRAY['SELECT'], 'anon')
          ON CONFLICT (name, bucket_id, actions[1], tenant) DO NOTHING;
          
          -- Adiciona política para upload autenticado
          INSERT INTO storage.policies (name, bucket_id, definition, actions, tenant)
          VALUES ('Upload autenticado', 'images', 'true', ARRAY['INSERT'], 'authenticated')
          ON CONFLICT (name, bucket_id, actions[1], tenant) DO NOTHING;
          
          -- Adiciona política para acesso público
          UPDATE storage.buckets
          SET public = true
          WHERE name = 'images';
          COMMIT;
        `
      });

      results.policies.list = listPolicyError 
        ? { success: false, message: listPolicyError.message }
        : { success: true, message: 'Políticas de acesso configuradas' };
    } catch (err: any) {
      results.policies.list = { success: false, message: err.message };
    }

    return NextResponse.json({
      success: true,
      message: 'Configuração de armazenamento concluída',
      results
    });

  } catch (error: any) {
    console.error('Erro durante a configuração de armazenamento:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error.message
      },
      { status: 500 }
    );
  }
} 