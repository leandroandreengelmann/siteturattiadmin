import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const results: any = {
      migrations: {}
    };

    // Migração 1: Adicionar campos faltantes à tabela stores
    try {
      const { error: storesMigrationError } = await supabase.rpc('exec_sql', {
        query_text: `
          -- Adicionar icon_url se não existir
          DO $$ 
          BEGIN 
            IF NOT EXISTS (
              SELECT FROM information_schema.columns 
              WHERE table_name = 'stores' AND column_name = 'icon_url'
            ) THEN
              ALTER TABLE stores ADD COLUMN icon_url TEXT;
            END IF;
          END $$;

          -- Adicionar is_active se não existir
          DO $$ 
          BEGIN 
            IF NOT EXISTS (
              SELECT FROM information_schema.columns 
              WHERE table_name = 'stores' AND column_name = 'is_active'
            ) THEN
              ALTER TABLE stores ADD COLUMN is_active BOOLEAN DEFAULT true;
            END IF;
          END $$;
        `
      });

      results.migrations.stores = storesMigrationError ? 
        { success: false, message: storesMigrationError.message } :
        { success: true, message: 'Migração da tabela stores concluída com sucesso' };
    } catch (err: any) {
      results.migrations.stores = { success: false, message: err.message };
    }

    // Migração 2: Criar tabela sellers se não existir
    try {
      const { error: sellersMigrationError } = await supabase.rpc('exec_sql', {
        query_text: `
          CREATE TABLE IF NOT EXISTS sellers (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            name TEXT NOT NULL,
            store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
            whatsapp TEXT NOT NULL,
            is_active BOOLEAN DEFAULT true,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `
      });

      results.migrations.sellers = sellersMigrationError ? 
        { success: false, message: sellersMigrationError.message } :
        { success: true, message: 'Tabela sellers criada com sucesso' };
    } catch (err: any) {
      results.migrations.sellers = { success: false, message: err.message };
    }

    return NextResponse.json({
      success: true,
      message: 'Migrações concluídas',
      results
    });

  } catch (error: any) {
    console.error('Erro durante a execução das migrações:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error.message
      },
      { status: 500 }
    );
  }
} 