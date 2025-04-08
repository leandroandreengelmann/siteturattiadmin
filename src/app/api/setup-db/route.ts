import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const results: any = {
      tables: {},
      data: {},
      buckets: {}
    };

    // Criar bucket de armazenamento para imagens
    try {
      const { data: bucketData, error: bucketError } = await supabase.storage.createBucket('images', {
        public: true,
        fileSizeLimit: 10485760, // 10MB
        allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif', 'image/webp']
      });

      results.buckets.images = bucketError ? 
        { success: false, message: bucketError.message } : 
        { success: true, message: 'Bucket criado ou já existente' };
    } catch (err: any) {
      results.buckets.images = { success: false, message: err.message };
    }

    // Criar tabela de produtos
    try {
      const { error: productsError } = await supabase.rpc('exec_sql', {
        query_text: `
          CREATE TABLE IF NOT EXISTS products (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            name TEXT NOT NULL,
            price DECIMAL(10, 2) NOT NULL,
            promo_price DECIMAL(10, 2),
            description TEXT,
            is_promotion BOOLEAN DEFAULT false,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `
      });

      results.tables.products = productsError ? 
        { success: false, message: productsError.message } :
        { success: true };
    } catch (err: any) {
      results.tables.products = { success: false, message: err.message };
    }

    // Criar tabela de imagens de produtos
    try {
      const { error: imagesError } = await supabase.rpc('exec_sql', {
        query_text: `
          CREATE TABLE IF NOT EXISTS product_images (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            product_id UUID REFERENCES products(id) ON DELETE CASCADE,
            high_resolution TEXT NOT NULL,
            standard TEXT NOT NULL,
            thumbnail TEXT NOT NULL,
            is_main BOOLEAN DEFAULT false,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `
      });

      results.tables.product_images = imagesError ? 
        { success: false, message: imagesError.message } :
        { success: true };
    } catch (err: any) {
      results.tables.product_images = { success: false, message: err.message };
    }

    // Criar tabela de coleções de cores
    try {
      const { error: collectionsError } = await supabase.rpc('exec_sql', {
        query_text: `
          CREATE TABLE IF NOT EXISTS color_collections (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            name TEXT NOT NULL,
            representative_color TEXT,
            description TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `
      });

      results.tables.color_collections = collectionsError ? 
        { success: false, message: collectionsError.message } :
        { success: true };
    } catch (err: any) {
      results.tables.color_collections = { success: false, message: err.message };
    }

    // Criar tabela de cores
    try {
      const { error: colorsError } = await supabase.rpc('exec_sql', {
        query_text: `
          CREATE TABLE IF NOT EXISTS colors (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            name TEXT NOT NULL,
            collection_id UUID REFERENCES color_collections(id) ON DELETE CASCADE,
            hex_code TEXT NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `
      });

      results.tables.colors = colorsError ? 
        { success: false, message: colorsError.message } :
        { success: true };
    } catch (err: any) {
      results.tables.colors = { success: false, message: err.message };
    }

    // Criar tabela de lojas
    try {
      const { error: storesError } = await supabase.rpc('exec_sql', {
        query_text: `
          CREATE TABLE IF NOT EXISTS stores (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            name TEXT NOT NULL,
            city TEXT NOT NULL,
            phone TEXT,
            hours TEXT,
            icon_url TEXT,
            is_active BOOLEAN DEFAULT true,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `
      });

      results.tables.stores = storesError ? 
        { success: false, message: storesError.message } :
        { success: true };
    } catch (err: any) {
      results.tables.stores = { success: false, message: err.message };
    }

    // Criar tabela de vendedores
    try {
      const { error: sellersError } = await supabase.rpc('exec_sql', {
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

      results.tables.sellers = sellersError ? 
        { success: false, message: sellersError.message } :
        { success: true };
    } catch (err: any) {
      results.tables.sellers = { success: false, message: err.message };
    }

    // Criar tabela de banners
    try {
      const { error: bannersError } = await supabase.rpc('exec_sql', {
        query_text: `
          CREATE TABLE IF NOT EXISTS banners (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            title TEXT NOT NULL,
            subtitle TEXT,
            button_text TEXT,
            button_link TEXT,
            image_url TEXT NOT NULL,
            is_active BOOLEAN DEFAULT true,
            order INTEGER DEFAULT 0,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `
      });

      results.tables.banners = bannersError ? 
        { success: false, message: bannersError.message } :
        { success: true };
    } catch (err: any) {
      results.tables.banners = { success: false, message: err.message };
    }

    // Inserir dados de exemplo para produtos
    try {
      const { data: productData, error: productDataError } = await supabase
        .from('products')
        .upsert([
          {
            name: 'Cimento Portland CP II 50kg',
            price: 39.90,
            promo_price: 34.90,
            description: 'Cimento Portland de alta qualidade para construções residenciais e comerciais.',
            is_promotion: true
          },
          {
            name: 'Argamassa Colante AC-II 20kg',
            price: 25.50,
            description: 'Argamassa colante para assentamento de revestimentos cerâmicos em áreas internas e externas.',
            is_promotion: false
          },
          {
            name: 'Tinta Acrílica Premium 18L',
            price: 189.90,
            promo_price: 159.90,
            description: 'Tinta acrílica de alta qualidade para ambientes internos e externos.',
            is_promotion: true
          }
        ], { onConflict: 'name' })
        .select();

      results.data.products = productDataError ? 
        { success: false, message: productDataError.message } :
        { success: true, count: productData?.length || 0 };
    } catch (err: any) {
      results.data.products = { success: false, message: err.message };
    }

    // Inserir dados de exemplo para coleções de cores
    try {
      const { data: collectionData, error: collectionDataError } = await supabase
        .from('color_collections')
        .upsert([
          {
            name: 'Clássicas',
            representative_color: '#A52A2A',
            description: 'Cores tradicionais que nunca saem de moda'
          },
          {
            name: 'Naturais',
            representative_color: '#228B22',
            description: 'Inspiradas na beleza da natureza'
          },
          {
            name: 'Contemporâneas',
            representative_color: '#4169E1',
            description: 'Cores modernas para ambientes sofisticados'
          }
        ], { onConflict: 'name' })
        .select();

      results.data.color_collections = collectionDataError ? 
        { success: false, message: collectionDataError.message } :
        { success: true, count: collectionData?.length || 0 };
    } catch (err: any) {
      results.data.color_collections = { success: false, message: err.message };
    }

    // Inserir dados de exemplo para lojas
    try {
      const { data: storeData, error: storeDataError } = await supabase
        .from('stores')
        .upsert([
          {
            name: 'Turatti Centro',
            city: 'Matupá',
            phone: '(66) 3595-1234',
            hours: 'Segunda a Sexta: 8h às 18h, Sábado: 8h às 13h',
            icon_url: 'https://cdn-icons-png.flaticon.com/512/2449/2449322.png',
            is_active: true
          },
          {
            name: 'Turatti Peixoto',
            city: 'Peixoto de Azevedo',
            phone: '(66) 3575-5678',
            hours: 'Segunda a Sexta: 8h às 18h, Sábado: 8h às 13h',
            icon_url: 'https://cdn-icons-png.flaticon.com/512/3820/3820307.png',
            is_active: true
          }
        ], { onConflict: 'name' })
        .select();

      results.data.stores = storeDataError ? 
        { success: false, message: storeDataError.message } :
        { success: true, count: storeData?.length || 0 };
        
      // Inserir vendedores após criar as lojas
      if (storeData && storeData.length > 0) {
        // Obter IDs das lojas
        const storeIds = storeData.reduce((acc, store) => {
          acc[store.name] = store.id;
          return acc;
        }, {} as Record<string, string>);
        
        // Inserir vendedores para as lojas
        const { data: sellerData, error: sellerDataError } = await supabase
          .from('sellers')
          .upsert([
            {
              name: 'João Silva',
              store_id: storeIds['Turatti Centro'],
              whatsapp: '5566999991111',
              is_active: true
            },
            {
              name: 'Maria Oliveira',
              store_id: storeIds['Turatti Centro'],
              whatsapp: '5566999992222',
              is_active: true
            },
            {
              name: 'Pedro Santos',
              store_id: storeIds['Turatti Peixoto'],
              whatsapp: '5566999993333',
              is_active: true
            },
            {
              name: 'Ana Souza',
              store_id: storeIds['Turatti Peixoto'],
              whatsapp: '5566999994444',
              is_active: true
            }
          ], { onConflict: 'name, store_id' })
          .select();
          
        results.data.sellers = sellerDataError ? 
          { success: false, message: sellerDataError.message } :
          { success: true, count: sellerData?.length || 0 };
      }
    } catch (err: any) {
      results.data.stores = { success: false, message: err.message };
    }

    // Inserir banner de exemplo
    try {
      const { data: bannerData, error: bannerDataError } = await supabase
        .from('banners')
        .upsert([
          {
            title: 'Materiais de Qualidade para sua Construção',
            subtitle: 'Encontre tudo o que você precisa para sua obra ou reforma na Turatti',
            button_text: 'Ver Produtos',
            button_link: '/products',
            image_url: 'https://images.unsplash.com/photo-1520209759809-a9bcb6cb3241?q=80&w=1000',
            is_active: true,
            order: 0
          }
        ], { onConflict: 'title' })
        .select();

      results.data.banners = bannerDataError ? 
        { success: false, message: bannerDataError.message } :
        { success: true, count: bannerData?.length || 0 };
    } catch (err: any) {
      results.data.banners = { success: false, message: err.message };
    }

    return NextResponse.json({
      success: true,
      message: 'Configuração do banco de dados concluída',
      results
    });

  } catch (error: any) {
    console.error('Erro durante a inicialização do banco de dados:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error.message
      },
      { status: 500 }
    );
  }
} 