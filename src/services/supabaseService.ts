import { supabase } from '@/lib/supabase';
import { Product, ColorCollection, Color, Store, ProductImage, Banner, Seller } from '@/data/types';

// Serviços para Produtos
export const productService = {
  // Buscar todos os produtos
  async getAll(): Promise<Product[]> {
    // Adicionar cache buster na query para evitar cache
    const cacheBuster = new Date().getTime();
    const { data, error } = await supabase
      .from('products')
      .select('*, product_images(*)')
      .order('updated_at', { ascending: false });
    
    if (error) {
      console.error('Erro ao buscar produtos:', error);
      return [];
    }
    
    // Converter nomes de campos de snake_case para camelCase
    return data.map((item: any) => ({
      id: item.id,
      name: item.name,
      price: item.price,
      promoPrice: item.promo_price,
      description: item.description,
      isPromotion: item.is_promotion,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
      images: item.product_images ? item.product_images.map((img: any) => ({
        id: img.id,
        productId: img.product_id,
        highResolution: img.high_resolution,
        standard: img.standard,
        thumbnail: img.thumbnail,
        isMain: img.is_main,
        createdAt: img.created_at,
        updatedAt: img.updated_at
      })) : []
    })) as Product[];
  },

  // Buscar produtos em promoção
  async getPromotions(): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*, product_images(*)')
      .eq('is_promotion', true);
    
    if (error) {
      console.error('Erro ao buscar promoções:', error);
      return [];
    }
    
    // Converter nomes de campos de snake_case para camelCase
    return data.map(item => ({
      id: item.id,
      name: item.name,
      price: item.price,
      promoPrice: item.promo_price,
      description: item.description,
      isPromotion: item.is_promotion,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
      images: item.product_images ? item.product_images.map((img: any) => ({
        id: img.id,
        productId: img.product_id,
        highResolution: img.high_resolution,
        standard: img.standard,
        thumbnail: img.thumbnail,
        isMain: img.is_main,
        createdAt: img.created_at,
        updatedAt: img.updated_at
      })) : []
    })) as Product[];
  },

  // Buscar produtos que não estão em promoção
  async getNonPromotions(): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*, product_images(*)')
      .eq('is_promotion', false);
    
    if (error) {
      console.error('Erro ao buscar produtos não promocionais:', error);
      return [];
    }
    
    // Converter nomes de campos de snake_case para camelCase
    return data.map(item => ({
      id: item.id,
      name: item.name,
      price: item.price,
      promoPrice: item.promo_price,
      description: item.description,
      isPromotion: item.is_promotion,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
      images: item.product_images ? item.product_images.map((img: any) => ({
        id: img.id,
        productId: img.product_id,
        highResolution: img.high_resolution,
        standard: img.standard,
        thumbnail: img.thumbnail,
        isMain: img.is_main,
        createdAt: img.created_at,
        updatedAt: img.updated_at
      })) : []
    })) as Product[];
  },

  // Buscar um produto pelo ID
  async getById(id: string): Promise<Product | null> {
    const { data, error } = await supabase
      .from('products')
      .select('*, product_images(*)')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error(`Erro ao buscar produto ${id}:`, error);
      return null;
    }
    
    // Converter nomes de campos de snake_case para camelCase
    return {
      id: data.id,
      name: data.name,
      price: data.price,
      promoPrice: data.promo_price,
      description: data.description,
      isPromotion: data.is_promotion,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      images: data.product_images ? data.product_images.map((img: any) => ({
        id: img.id,
        productId: img.product_id,
        highResolution: img.high_resolution,
        standard: img.standard,
        thumbnail: img.thumbnail,
        isMain: img.is_main,
        createdAt: img.created_at,
        updatedAt: img.updated_at
      })) : []
    } as Product;
  },

  // Adicionar um novo produto
  async add(product: Omit<Product, 'id'>): Promise<Product | null> {
    // Iniciar uma transação para garantir a consistência dos dados
    // Primeiro, criar o produto
    const { data: productData, error: productError } = await supabase
      .from('products')
      .insert([{
        name: product.name,
        price: product.price,
        promo_price: product.promoPrice,
        description: product.description,
        is_promotion: product.isPromotion
      }])
      .select()
      .single();
    
    if (productError) {
      console.error('Erro ao adicionar produto:', productError);
      return null;
    }
    
    // Em seguida, adicionar as imagens associadas
    const imageInsertPromises = product.images.map(async (image, index) => {
      const { data: imageData, error: imageError } = await supabase
        .from('product_images')
        .insert([{
          product_id: productData.id,
          high_resolution: image.highResolution,
          standard: image.standard,
          thumbnail: image.thumbnail,
          is_main: image.isMain !== undefined ? image.isMain : index === 0 // Se não especificado, a primeira imagem é a principal
        }])
        .select();
      
      if (imageError) {
        console.error('Erro ao adicionar imagem:', imageError);
        return null;
      }
      
      return {
        id: imageData[0].id,
        productId: imageData[0].product_id,
        highResolution: imageData[0].high_resolution,
        standard: imageData[0].standard,
        thumbnail: imageData[0].thumbnail,
        isMain: imageData[0].is_main,
        createdAt: imageData[0].created_at,
        updatedAt: imageData[0].updated_at
      } as ProductImage;
    });
    
    const imageResults = await Promise.all(imageInsertPromises);
    const validImages = imageResults.filter(img => img !== null) as ProductImage[];
    
    // Retornar o produto completo com as imagens
    return {
      id: productData.id,
      name: productData.name,
      price: productData.price,
      promoPrice: productData.promo_price,
      description: productData.description,
      isPromotion: productData.is_promotion,
      createdAt: productData.created_at,
      updatedAt: productData.updated_at,
      images: validImages
    } as Product;
  },

  // Atualizar um produto existente
  async update(id: string, updates: Partial<Product>): Promise<boolean> {
    try {
      // Primeiro, atualizar os dados básicos do produto
      if (updates.name !== undefined || updates.price !== undefined || 
          updates.promoPrice !== undefined || updates.description !== undefined || 
          updates.isPromotion !== undefined) {
        
        const supabaseUpdates: any = {};
        
        if (updates.name !== undefined) supabaseUpdates.name = updates.name;
        if (updates.price !== undefined) supabaseUpdates.price = updates.price;
        if (updates.promoPrice !== undefined) supabaseUpdates.promo_price = updates.promoPrice;
        if (updates.description !== undefined) supabaseUpdates.description = updates.description;
        if (updates.isPromotion !== undefined) supabaseUpdates.is_promotion = updates.isPromotion;
        
        const { error } = await supabase
          .from('products')
          .update(supabaseUpdates)
          .eq('id', id);
        
        if (error) {
          console.error(`Erro ao atualizar produto ${id}:`, error);
          return false;
        }
      }
      
      // Se houver novas imagens, atualizar as imagens
      if (updates.images && updates.images.length > 0) {
        // 1. Primeiro, excluir as imagens antigas
        const { error: deleteError } = await supabase
          .from('product_images')
          .delete()
          .eq('product_id', id);
        
        if (deleteError) {
          console.error(`Erro ao excluir imagens antigas do produto ${id}:`, deleteError);
          return false;
        }
        
        // 2. Inserir as novas imagens
        const imageInsertPromises = updates.images.map(async (image, index) => {
          return supabase
            .from('product_images')
            .insert([{
              product_id: id,
              high_resolution: image.highResolution,
              standard: image.standard,
              thumbnail: image.thumbnail,
              is_main: image.isMain !== undefined ? image.isMain : index === 0
            }]);
        });
        
        await Promise.all(imageInsertPromises);
      }
      
      return true;
    } catch (error) {
      console.error(`Erro ao atualizar produto ${id}:`, error);
      return false;
    }
  },

  // Excluir um produto
  async delete(id: string): Promise<boolean> {
    try {
      // 1. Primeiro, excluir todas as imagens associadas
      const { error: imagesError } = await supabase
        .from('product_images')
        .delete()
        .eq('product_id', id);
      
      if (imagesError) {
        console.error(`Erro ao excluir imagens do produto ${id}:`, imagesError);
        return false;
      }
      
      // 2. Em seguida, excluir o produto
      const { error: productError } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
      
      if (productError) {
        console.error(`Erro ao excluir produto ${id}:`, productError);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error(`Erro ao excluir produto ${id}:`, error);
      return false;
    }
  },

  // Upload de imagem para o Storage do Supabase
  async uploadImage(file: File): Promise<string | null> {
    try {
      // Primeiro, obter a sessão atual para o token de autenticação
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        console.error('Erro: Usuário não autenticado para fazer upload de arquivo');
        throw new Error('Você precisa estar autenticado para fazer upload de imagens');
      }
      
      // Limpar o nome do arquivo e remover caracteres especiais
      const originalName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
      const fileExt = originalName.split('.').pop()?.toLowerCase() || 'jpg';
      
      // Criar um nome único e seguro para o arquivo
      const randomId = Math.random().toString(36).substring(2, 10);
      const timestamp = Date.now();
      const fileName = `public/${timestamp}_${randomId}.${fileExt}`;
      
      console.log('Iniciando upload com nome limpo:', fileName);
      
      // Fazer upload para a pasta 'public' do bucket
      const { data, error } = await supabase.storage
        .from('images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true,
          contentType: file.type, // Definir explicitamente o tipo de conteúdo
        });
      
      if (error) {
        console.error('Erro ao fazer upload da imagem:', error);
        throw new Error(`Erro de upload: ${error.message}`);
      }
      
      // Obter a URL pública
      const { data: urlData } = supabase.storage
        .from('images')
        .getPublicUrl(fileName);
      
      if (!urlData || !urlData.publicUrl) {
        console.error('Erro ao obter URL pública');
        throw new Error('Erro ao obter URL pública');
      }
      
      console.log('Upload bem-sucedido:', urlData.publicUrl);
      return urlData.publicUrl;
    } catch (error) {
      console.error('Erro ao fazer upload da imagem:', error);
      return null;
    }
  },

  // Processar imagem para criar versões em diferentes tamanhos
  async processImage(file: File): Promise<ProductImage | null> {
    try {
      // Verificar se o usuário está autenticado
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        throw new Error('Você precisa estar autenticado para processar imagens. Faça login e tente novamente.');
      }
      
      // Validar tipo de arquivo
      if (!file.type.startsWith('image/')) {
        throw new Error('Apenas imagens são permitidas. Selecione um arquivo PNG, JPG ou GIF.');
      }
      
      // Validar tamanho máximo (10MB)
      const MAX_SIZE = 10 * 1024 * 1024;
      if (file.size > MAX_SIZE) {
        throw new Error(`Tamanho máximo permitido: 10MB. Arquivo atual: ${(file.size / (1024 * 1024)).toFixed(2)}MB`);
      }
      
      // Upload da imagem (mesma URL para todos os tamanhos por enquanto)
      const imageUrl = await this.uploadImage(file);
      if (!imageUrl) {
        throw new Error('Falha ao fazer upload da imagem. Verifique sua conexão e permissões.');
      }
      
      // Por enquanto, usamos a mesma URL para todas as versões
      // Em uma implementação futura, podemos adicionar redimensionamento
      return {
        highResolution: imageUrl,
        standard: imageUrl,
        thumbnail: imageUrl,
        isMain: false
      };
    } catch (error) {
      if (error instanceof Error) {
        console.error('Erro ao processar imagem:', error.message);
        throw new Error(error.message);
      }
      console.error('Erro desconhecido ao processar imagem');
      throw new Error('Erro desconhecido ao processar imagem. Tente novamente mais tarde.');
    }
  }
};

// Serviços para Coleções de Cores
export const collectionService = {
  // Buscar todas as coleções
  async getAll(): Promise<ColorCollection[]> {
    // Adicionar cache buster na query para evitar cache
    const cacheBuster = new Date().getTime();
    const { data, error } = await supabase
      .from('color_collections')
      .select('*')
      .order('updated_at', { ascending: false });
    
    if (error) {
      console.error('Erro ao buscar coleções de cores:', error);
      return [];
    }
    
    // Converter nomes de campos de snake_case para camelCase
    return data.map((item: any) => ({
      id: item.id,
      name: item.name,
      description: item.description,
      representativeColor: item.representative_color,
      createdAt: item.created_at,
      updatedAt: item.updated_at
    })) as ColorCollection[];
  },

  // Buscar uma coleção pelo ID
  async getById(id: string): Promise<ColorCollection | null> {
    const { data, error } = await supabase
      .from('color_collections')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error(`Erro ao buscar coleção ${id}:`, error);
      return null;
    }
    
    // Converter nomes de campos de snake_case para camelCase
    return {
      id: data.id,
      name: data.name,
      representativeColor: data.representative_color,
      description: data.description,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    } as ColorCollection;
  },

  // Adicionar uma nova coleção
  async add(collection: Omit<ColorCollection, 'id'>): Promise<ColorCollection | null> {
    console.log('Adicionando coleção:', collection);
    
    // Converter de camelCase para snake_case para o Supabase
    const supabaseCollection = {
      name: collection.name,
      representative_color: collection.representativeColor,
      description: collection.description
    };
    
    console.log('Dados para o Supabase:', supabaseCollection);
    
    const { data, error } = await supabase
      .from('color_collections')
      .insert([supabaseCollection])
      .select();
    
    if (error) {
      console.error('Erro ao adicionar coleção:', error);
      return null;
    }
    
    console.log('Resposta do Supabase:', data[0]);
    
    // Converter de volta para camelCase
    return {
      id: data[0].id,
      name: data[0].name,
      representativeColor: data[0].representative_color,
      description: data[0].description,
      createdAt: data[0].created_at,
      updatedAt: data[0].updated_at
    } as ColorCollection;
  },

  // Atualizar uma coleção existente
  async update(id: string, updates: Partial<ColorCollection>): Promise<boolean> {
    console.log('Atualizando coleção:', id, updates);
    
    // Converter de camelCase para snake_case para o Supabase
    const supabaseUpdates: any = {};
    
    if (updates.name !== undefined) supabaseUpdates.name = updates.name;
    if (updates.representativeColor !== undefined) supabaseUpdates.representative_color = updates.representativeColor;
    if (updates.description !== undefined) supabaseUpdates.description = updates.description;
    
    console.log('Dados para o Supabase:', supabaseUpdates);
    
    const { error } = await supabase
      .from('color_collections')
      .update(supabaseUpdates)
      .eq('id', id);
    
    if (error) {
      console.error(`Erro ao atualizar coleção ${id}:`, error);
      return false;
    }
    
    return true;
  },

  // Excluir uma coleção
  async delete(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('color_collections')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error(`Erro ao excluir coleção ${id}:`, error);
      return false;
    }
    
    return true;
  }
};

// Serviços para Cores
export const colorService = {
  // Buscar todas as cores
  async getAll(): Promise<Color[]> {
    // Adicionar cache buster na query para evitar cache
    const cacheBuster = new Date().getTime();
    const { data, error } = await supabase
      .from('colors')
      .select('*')
      .order('updated_at', { ascending: false });
    
    if (error) {
      console.error('Erro ao buscar cores:', error);
      return [];
    }
    
    // Converter nomes de campos de snake_case para camelCase
    return data.map((item: any) => ({
      id: item.id,
      name: item.name,
      code: item.code,
      collectionId: item.collection_id,
      hexValue: item.hex_value,
      createdAt: item.created_at,
      updatedAt: item.updated_at
    })) as Color[];
  },

  // Buscar cores por coleção
  async getByCollection(collectionId: string): Promise<Color[]> {
    // Adicionar cache buster na query para evitar cache
    const cacheBuster = new Date().getTime();
    const { data, error } = await supabase
      .from('colors')
      .select('*')
      .eq('collection_id', collectionId)
      .order('updated_at', { ascending: false });
    
    if (error) {
      console.error(`Erro ao buscar cores da coleção ${collectionId}:`, error);
      return [];
    }
    
    // Converter nomes de campos de snake_case para camelCase
    return data.map((item: any) => ({
      id: item.id,
      name: item.name,
      code: item.code,
      collectionId: item.collection_id,
      hexValue: item.hex_value,
      createdAt: item.created_at,
      updatedAt: item.updated_at
    })) as Color[];
  },

  // Adicionar uma nova cor
  async add(color: Omit<Color, 'id'>): Promise<Color | null> {
    console.log('Recebido para adicionar cor:', color);
    
    // Converter de camelCase para snake_case para o Supabase
    const supabaseColor = {
      name: color.name,
      collection_id: color.collectionId || null,
      hex_code: color.hexCode || '#000000'
    };
    
    console.log('Preparado para o Supabase:', supabaseColor);
    
    const { data, error } = await supabase
      .from('colors')
      .insert([supabaseColor])
      .select();
    
    if (error) {
      console.error('Erro ao adicionar cor:', error);
      return null;
    }
    
    console.log('Resposta do Supabase:', data[0]);
    
    // Converter de volta para camelCase
    return {
      id: data[0].id,
      name: data[0].name,
      collectionId: data[0].collection_id,
      hexCode: data[0].hex_code,
      createdAt: data[0].created_at,
      updatedAt: data[0].updated_at
    } as Color;
  },

  // Atualizar uma cor existente
  async update(id: string, updates: Partial<Color>): Promise<boolean> {
    // Converter de camelCase para snake_case para o Supabase
    const supabaseUpdates: any = {};
    
    if (updates.name !== undefined) supabaseUpdates.name = updates.name;
    if (updates.collectionId !== undefined) supabaseUpdates.collection_id = updates.collectionId;
    if (updates.hexCode !== undefined) supabaseUpdates.hex_code = updates.hexCode;
    
    const { error } = await supabase
      .from('colors')
      .update(supabaseUpdates)
      .eq('id', id);
    
    if (error) {
      console.error(`Erro ao atualizar cor ${id}:`, error);
      return false;
    }
    
    return true;
  },

  // Excluir uma cor
  async delete(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('colors')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error(`Erro ao excluir cor ${id}:`, error);
      return false;
    }
    
    return true;
  }
};

// Serviços para Lojas
export const storeService = {
  // Flag para verificar se já tentamos criar a tabela
  _tableCheckAttempted: false,

  // Verificar e inicializar a tabela de lojas, se necessário
  async checkAndInitializeStoresTable(): Promise<boolean> {
    if (this._tableCheckAttempted) {
      return true;
    }

    this._tableCheckAttempted = true;
    
    try {
      const { data, error } = await supabase.from('stores').select('count(*)', { count: 'exact', head: true });
      
      if (!error) {
        return true;
      }
      
      console.log('A tabela de lojas pode não existir. Usando dados estáticos.');
      return false;
    } catch (e) {
      console.log('Erro ao verificar tabela de lojas.');
      return false;
    }
  },

  // Buscar todas as lojas
  async getAll(): Promise<Store[]> {
    await this.checkAndInitializeStoresTable();
    
    const { data, error } = await supabase
      .from('stores')
      .select('*')
      .order('name');
    
    if (error) {
      console.error('Erro ao buscar lojas:', error);
      return [];
    }
    
    // Converter nomes de campos de snake_case para camelCase
    return data.map(item => ({
      id: item.id,
      name: item.name,
      city: item.city,
      phone: item.phone,
      hours: item.hours,
      iconUrl: item.icon_url,
      isActive: item.is_active !== false, // Se não estiver explicitamente false, considera ativo
      createdAt: item.created_at,
      updatedAt: item.updated_at
    })) as Store[];
  },

  // Buscar lojas ativas
  async getActive(): Promise<Store[]> {
    try {
      await this.checkAndInitializeStoresTable();
      
      const { data, error } = await supabase
        .from('stores')
        .select('*')
        .eq('is_active', true)
        .order('name');
      
      if (error) {
        console.error('Erro ao buscar lojas ativas:', error);
        return [];
      }
      
      if (!data || !Array.isArray(data)) {
        console.error('Dados de lojas inválidos:', data);
        return [];
      }
      
      // Converter nomes de campos de snake_case para camelCase
      return data.map(item => ({
        id: item.id,
        name: item.name,
        city: item.city,
        phone: item.phone,
        hours: item.hours,
        iconUrl: item.icon_url,
        isActive: true,
        createdAt: item.created_at,
        updatedAt: item.updated_at
      })) as Store[];
    } catch (error) {
      console.error('Exceção ao buscar lojas ativas:', error);
      return [];
    }
  },

  // Buscar uma loja pelo ID
  async getById(id: string): Promise<Store | null> {
    await this.checkAndInitializeStoresTable();
    
    const { data, error } = await supabase
      .from('stores')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error(`Erro ao buscar loja ${id}:`, error);
      return null;
    }
    
    // Converter nomes de campos de snake_case para camelCase
    return {
      id: data.id,
      name: data.name,
      city: data.city,
      phone: data.phone,
      hours: data.hours,
      iconUrl: data.icon_url,
      isActive: data.is_active !== false,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    } as Store;
  },

  // Adicionar uma nova loja
  async add(store: Omit<Store, 'id'>): Promise<Store | null> {
    await this.checkAndInitializeStoresTable();
    
    // Converter de camelCase para snake_case para o Supabase
    const supabaseStore = {
      name: store.name,
      city: store.city,
      phone: store.phone,
      hours: store.hours,
      icon_url: store.iconUrl,
      is_active: store.isActive !== false
    };
    
    const { data, error } = await supabase
      .from('stores')
      .insert([supabaseStore])
      .select();
    
    if (error) {
      console.error('Erro ao adicionar loja:', error);
      return null;
    }
    
    // Converter de volta para camelCase
    return {
      id: data[0].id,
      name: data[0].name,
      city: data[0].city,
      phone: data[0].phone,
      hours: data[0].hours,
      iconUrl: data[0].icon_url,
      isActive: data[0].is_active,
      createdAt: data[0].created_at,
      updatedAt: data[0].updated_at
    } as Store;
  },

  // Atualizar uma loja existente
  async update(id: string, updates: Partial<Store>): Promise<boolean> {
    await this.checkAndInitializeStoresTable();
    
    // Converter de camelCase para snake_case para o Supabase
    const supabaseUpdates: any = {};
    
    if (updates.name !== undefined) supabaseUpdates.name = updates.name;
    if (updates.city !== undefined) supabaseUpdates.city = updates.city;
    if (updates.phone !== undefined) supabaseUpdates.phone = updates.phone;
    if (updates.hours !== undefined) supabaseUpdates.hours = updates.hours;
    if (updates.iconUrl !== undefined) supabaseUpdates.icon_url = updates.iconUrl;
    if (updates.isActive !== undefined) supabaseUpdates.is_active = updates.isActive;
    
    const { error } = await supabase
      .from('stores')
      .update(supabaseUpdates)
      .eq('id', id);
    
    if (error) {
      console.error(`Erro ao atualizar loja ${id}:`, error);
      return false;
    }
    
    return true;
  },

  // Excluir uma loja
  async delete(id: string): Promise<boolean> {
    await this.checkAndInitializeStoresTable();
    
    const { error } = await supabase
      .from('stores')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error(`Erro ao excluir loja ${id}:`, error);
      return false;
    }
    
    return true;
  },
  
  // Upload de ícone para a loja
  async uploadStoreIcon(file: File): Promise<string | null> {
    try {
      // Limpar o nome do arquivo e remover caracteres especiais
      const originalName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
      const fileExt = originalName.split('.').pop()?.toLowerCase() || 'jpg';
      
      // Criar um nome único e seguro para o arquivo
      const timestamp = Date.now();
      const fileName = `public/store-icon-${timestamp}.${fileExt}`;
      
      // Fazer upload para a pasta 'public' do bucket
      const { data, error } = await supabase.storage
        .from('images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true,
          contentType: file.type
        });
      
      if (error) {
        console.error('Erro ao fazer upload do ícone da loja:', error);
        throw new Error(`Erro de upload: ${error.message}`);
      }
      
      // Obter a URL pública
      const { data: urlData } = supabase.storage
        .from('images')
        .getPublicUrl(fileName);
      
      if (!urlData || !urlData.publicUrl) {
        console.error('Erro ao obter URL pública do ícone');
        throw new Error('Erro ao obter URL pública');
      }
      
      return urlData.publicUrl;
    } catch (error) {
      console.error('Erro ao fazer upload do ícone da loja:', error);
      return null;
    }
  }
};

// Serviço de Autenticação
export const authService = {
  // Login com email e senha
  async login(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error('Erro ao fazer login:', error);
        return { 
          success: false, 
          error,
          message: error.message === 'Invalid login credentials' 
            ? 'Credenciais inválidas. Verifique seu e-mail e senha.' 
            : error.message 
        };
      }
      
      if (!data.session) {
        return {
          success: false,
          error: new Error('Sessão não criada'),
          message: 'Não foi possível criar uma sessão. Tente novamente.'
        };
      }
      
      // Log de depuração
      console.log('Login bem-sucedido. Token expira em:', new Date(data.session.expires_at! * 1000).toLocaleString());
      
      // Tentar persistir manualmente a sessão no localStorage
      try {
        localStorage.setItem('turatti-store-auth-token', data.session.access_token);
        localStorage.setItem('turatti-store-auth-expires', String(data.session.expires_at));
      } catch (storageError) {
        console.warn('Não foi possível salvar o token no localStorage:', storageError);
      }
      
      return { success: true, session: data.session };
    } catch (error) {
      console.error('Erro inesperado ao fazer login:', error);
      return { 
        success: false, 
        error, 
        message: 'Ocorreu um erro ao processar o login. Tente novamente.'
      };
    }
  },
  
  // Verificar sessão atual
  async getSession() {
    try {
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Erro ao verificar sessão:', error);
        return null;
      }
      
      if (data.session) {
        return data.session;
      }
      
      // Se não houver sessão, tentar recuperar do localStorage
      if (typeof window !== 'undefined') {
        try {
          const token = localStorage.getItem('turatti-store-auth-token');
          const expires = localStorage.getItem('turatti-store-auth-expires');
          
          if (token && expires) {
            const expiresAt = Number(expires);
            const now = Math.floor(Date.now() / 1000);
            
            // Se o token ainda for válido, tentar usá-lo
            if (expiresAt > now) {
              console.log('Restaurando sessão a partir do token armazenado');
              const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
                access_token: token,
                refresh_token: '',
              });
              
              if (!sessionError && sessionData.session) {
                return sessionData.session;
              }
            } else {
              // Token expirado, limpar
              localStorage.removeItem('turatti-store-auth-token');
              localStorage.removeItem('turatti-store-auth-expires');
            }
          }
        } catch (storageError) {
          console.warn('Erro ao acessar localStorage:', storageError);
        }
      }
      
      return null;
    } catch (error) {
      console.error('Erro inesperado ao verificar sessão:', error);
      return null;
    }
  },
  
  // Logout
  async logout() {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error('Erro ao fazer logout:', error);
      return { success: false, error };
    }
    
    return { success: true, error: null };
  },
  
  // Solicitar redefinição de senha
  async requestPasswordReset(email: string) {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/resetar-senha`,
    });
    
    if (error) {
      console.error('Erro ao solicitar redefinição de senha:', error);
      return { success: false, error };
    }
    
    return { success: true, data };
  },
  
  // Redefinir senha com o token
  async resetPassword(newPassword: string) {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    
    if (error) {
      console.error('Erro ao redefinir senha:', error);
      return { success: false, error };
    }
    
    return { success: true, user: data.user };
  },
  
  // Verificar token de redefinição de senha
  async verifyPasswordResetToken() {
    const { data, error } = await supabase.auth.getSession();
    
    if (error || !data.session) {
      console.error('Token de redefinição inválido ou expirado:', error);
      return { success: false, error };
    }
    
    return { success: true, session: data.session };
  },
  
  // Criar novo usuário (para administradores)
  async createUser(email: string, password: string, userData: { name: string }) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData,
        // Definir para false em produção se quiser que os usuários confirmem o email
        emailRedirectTo: `${window.location.origin}/admin`,
      },
    });
    
    if (error) {
      console.error('Erro ao criar usuário:', error);
      return { success: false, error };
    }
    
    return { 
      success: true, 
      user: data.user,
      message: data.user?.identities?.length === 0 
        ? 'Este e-mail já está em uso.' 
        : 'Usuário criado com sucesso.' 
    };
  },
  
  // Verificar se o usuário atual é um administrador
  async isAdmin() {
    try {
      const session = await this.getSession();
      if (!session) return false;
      
      // Verificar metadados ou email para determinar se é admin
      const isAdminEmail = session.user.email?.includes('admin@');
      
      return isAdminEmail || false;
    } catch (error) {
      console.error('Erro ao verificar permissões:', error);
      return false;
    }
  }
};

// Serviços para Banners
export const bannerService = {
  // Flag para verificar se já tentamos criar a tabela
  _tableCheckAttempted: false,

  // Simplificamos esta função para evitar loops infinitos
  async checkAndInitializeBannersTable(): Promise<boolean> {
    // Se já tentamos antes, não tente novamente durante esta sessão
    if (this._tableCheckAttempted) {
      return true;
    }

    this._tableCheckAttempted = true;
    
    try {
      const { data, error } = await supabase.from('banners').select('count(*)', { count: 'exact', head: true });
      
      // Se não houve erro, a tabela existe
      if (!error) {
        return true;
      }
      
      // Se houve erro, vamos apenas registrar e retornar false
      console.log('A tabela banners pode não existir. Usando dados estáticos.');
      return false;
    } catch (e) {
      console.log('Erro ao verificar tabela. Usando dados estáticos.');
      return false;
    }
  },

  // Buscar todos os banners
  async getAll(): Promise<Banner[]> {
    try {
      await this.checkAndInitializeBannersTable();
      
      const { data, error } = await supabase
        .from('banners')
        .select('*')
        .order('order', { ascending: true });
      
      if (error || !data || data.length === 0) {
        // Se houver erro ou não houver dados, retornar um banner estático
        return [{
          id: 'default-banner',
          title: 'Materiais de Qualidade para sua Construção',
          subtitle: 'Encontre tudo o que você precisa para sua obra ou reforma na Turatti',
          buttonText: 'Ver Produtos',
          buttonLink: '/products',
          imageUrl: 'https://images.unsplash.com/photo-1520209759809-a9bcb6cb3241?q=80&w=1000',
          isActive: true,
          order: 0
        }];
      }
      
      // Converter nomes de campos de snake_case para camelCase
      return data.map(item => ({
        id: item.id,
        title: item.title,
        subtitle: item.subtitle,
        buttonText: item.button_text,
        buttonLink: item.button_link,
        imageUrl: item.image_url,
        isActive: item.is_active,
        order: item.order,
        createdAt: item.created_at,
        updatedAt: item.updated_at
      })) as Banner[];
    } catch (error) {
      // Em caso de erro, retornar um banner estático
      return [{
        id: 'default-banner',
        title: 'Materiais de Qualidade para sua Construção',
        subtitle: 'Encontre tudo o que você precisa para sua obra ou reforma na Turatti',
        buttonText: 'Ver Produtos',
        buttonLink: '/products',
        imageUrl: 'https://images.unsplash.com/photo-1520209759809-a9bcb6cb3241?q=80&w=1000',
        isActive: true,
        order: 0
      }];
    }
  },

  // Buscar apenas banners ativos
  async getActive(): Promise<Banner[]> {
    try {
      await this.checkAndInitializeBannersTable();
      
      const { data, error } = await supabase
        .from('banners')
        .select('*')
        .eq('is_active', true)
        .order('order', { ascending: true });
      
      if (error || !data || data.length === 0) {
        // Se houver erro ou não houver dados, retornar um banner estático
        return [{
          id: 'default-banner',
          title: 'Materiais de Qualidade para sua Construção',
          subtitle: 'Encontre tudo o que você precisa para sua obra ou reforma na Turatti',
          buttonText: 'Ver Produtos',
          buttonLink: '/products',
          imageUrl: 'https://images.unsplash.com/photo-1520209759809-a9bcb6cb3241?q=80&w=1000',
          isActive: true,
          order: 0
        }];
      }
      
      // Converter nomes de campos de snake_case para camelCase
      return data.map(item => ({
        id: item.id,
        title: item.title,
        subtitle: item.subtitle,
        buttonText: item.button_text,
        buttonLink: item.button_link,
        imageUrl: item.image_url,
        isActive: item.is_active,
        order: item.order,
        createdAt: item.created_at,
        updatedAt: item.updated_at
      })) as Banner[];
    } catch (error) {
      // Em caso de erro, retornar um banner estático
      return [{
        id: 'default-banner',
        title: 'Materiais de Qualidade para sua Construção',
        subtitle: 'Encontre tudo o que você precisa para sua obra ou reforma na Turatti',
        buttonText: 'Ver Produtos',
        buttonLink: '/products',
        imageUrl: 'https://images.unsplash.com/photo-1520209759809-a9bcb6cb3241?q=80&w=1000',
        isActive: true,
        order: 0
      }];
    }
  },

  // Buscar um banner pelo ID
  async getById(id: string): Promise<Banner | null> {
    try {
      // Verificar se a tabela existe
      const tableExists = await this.checkAndInitializeBannersTable().catch(() => false);
      if (!tableExists) {
        return null;
      }
      
      const { data, error } = await supabase
        .from('banners')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        return null;
      }
      
      // Converter nomes de campos de snake_case para camelCase
      return {
        id: data.id,
        title: data.title,
        subtitle: data.subtitle,
        buttonText: data.button_text,
        buttonLink: data.button_link,
        imageUrl: data.image_url,
        isActive: data.is_active,
        order: data.order,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      } as Banner;
    } catch (error) {
      return null;
    }
  },

  // Adicionar um novo banner
  async add(banner: Omit<Banner, 'id'>): Promise<Banner | null> {
    try {
      // Verificar se a tabela existe
      await this.checkAndInitializeBannersTable();
      
      // Converter de camelCase para snake_case para o Supabase
      const { data, error } = await supabase
        .from('banners')
        .insert([{
          title: banner.title,
          subtitle: banner.subtitle,
          button_text: banner.buttonText,
          button_link: banner.buttonLink,
          image_url: banner.imageUrl,
          is_active: banner.isActive,
          order: banner.order || 0
        }])
        .select();
      
      if (error) {
        console.error('Erro ao adicionar banner:', error);
        return null;
      }
      
      // Converter de volta para camelCase
      return {
        id: data[0].id,
        title: data[0].title,
        subtitle: data[0].subtitle,
        buttonText: data[0].button_text,
        buttonLink: data[0].button_link,
        imageUrl: data[0].image_url,
        isActive: data[0].is_active,
        order: data[0].order,
        createdAt: data[0].created_at,
        updatedAt: data[0].updated_at
      } as Banner;
    } catch (error) {
      console.error('Erro ao adicionar banner:', error);
      return null;
    }
  },

  // Atualizar um banner existente
  async update(id: string, updates: Partial<Banner>): Promise<boolean> {
    try {
      // Verificar se a tabela existe
      await this.checkAndInitializeBannersTable();
      
      // Converter de camelCase para snake_case para o Supabase
      const supabaseUpdates: any = {};
      
      if (updates.title !== undefined) supabaseUpdates.title = updates.title;
      if (updates.subtitle !== undefined) supabaseUpdates.subtitle = updates.subtitle;
      if (updates.buttonText !== undefined) supabaseUpdates.button_text = updates.buttonText;
      if (updates.buttonLink !== undefined) supabaseUpdates.button_link = updates.buttonLink;
      if (updates.imageUrl !== undefined) supabaseUpdates.image_url = updates.imageUrl;
      if (updates.isActive !== undefined) supabaseUpdates.is_active = updates.isActive;
      if (updates.order !== undefined) supabaseUpdates.order = updates.order;
      
      const { error } = await supabase
        .from('banners')
        .update(supabaseUpdates)
        .eq('id', id);
      
      if (error) {
        console.error(`Erro ao atualizar banner ${id}:`, error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error(`Erro ao atualizar banner ${id}:`, error);
      return false;
    }
  },

  // Excluir um banner
  async delete(id: string): Promise<boolean> {
    try {
      // Verificar se a tabela existe
      await this.checkAndInitializeBannersTable();
      
      const { error } = await supabase
        .from('banners')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error(`Erro ao excluir banner ${id}:`, error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error(`Erro ao excluir banner ${id}:`, error);
      return false;
    }
  },

  // Upload de imagem para o banner
  async uploadBannerImage(file: File): Promise<string | null> {
    try {
      // Limpar o nome do arquivo e remover caracteres especiais
      const originalName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
      const fileExt = originalName.split('.').pop()?.toLowerCase() || 'jpg';
      
      // Criar um nome único e seguro para o arquivo
      const timestamp = Date.now();
      const fileName = `public/banner-${timestamp}.${fileExt}`;
      
      console.log('Iniciando upload do banner:', fileName);
      
      // Fazer upload para a pasta 'public' do bucket
      const { data, error } = await supabase.storage
        .from('images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true,
          contentType: file.type
        });
      
      if (error) {
        console.error('Erro ao fazer upload da imagem do banner:', error);
        throw new Error(`Erro de upload: ${error.message}`);
      }
      
      // Obter a URL pública
      const { data: urlData } = supabase.storage
        .from('images')
        .getPublicUrl(fileName);
      
      if (!urlData || !urlData.publicUrl) {
        console.error('Erro ao obter URL pública do banner');
        throw new Error('Erro ao obter URL pública');
      }
      
      console.log('Upload do banner bem-sucedido:', urlData.publicUrl);
      return urlData.publicUrl;
    } catch (error) {
      console.error('Erro ao fazer upload da imagem do banner:', error);
      return null;
    }
  }
};

// Serviço para Vendedores
export const sellerService = {
  // Flag para verificar se já tentamos criar a tabela
  _tableCheckAttempted: false,

  // Verificar e inicializar a tabela de vendedores, se necessário
  async checkAndInitializeSellersTable(): Promise<boolean> {
    if (this._tableCheckAttempted) {
      return true;
    }

    this._tableCheckAttempted = true;
    
    try {
      const { data, error } = await supabase.from('sellers').select('count(*)', { count: 'exact', head: true });
      
      if (!error) {
        return true;
      }
      
      console.log('A tabela de vendedores pode não existir. Usando dados estáticos.');
      return false;
    } catch (e) {
      console.log('Erro ao verificar tabela de vendedores.');
      return false;
    }
  },

  // Buscar todos os vendedores
  async getAll(): Promise<Seller[]> {
    await this.checkAndInitializeSellersTable();
    
    const { data, error } = await supabase
      .from('sellers')
      .select('*')
      .order('name');
    
    if (error) {
      console.error('Erro ao buscar vendedores:', error);
      return [];
    }
    
    // Converter de snake_case para camelCase
    return data.map(item => ({
      id: item.id,
      name: item.name,
      storeId: item.store_id,
      whatsapp: item.whatsapp,
      isActive: item.is_active !== false, // Se não estiver explicitamente false, considera ativo
      createdAt: item.created_at,
      updatedAt: item.updated_at
    })) as Seller[];
  },

  // Buscar vendedores por loja
  async getByStore(storeId: string): Promise<Seller[]> {
    try {
      await this.checkAndInitializeSellersTable();
      
      if (!storeId) {
        console.error('ID da loja inválido ou não fornecido');
        return [];
      }
      
      const { data, error } = await supabase
        .from('sellers')
        .select('*')
        .eq('store_id', storeId)
        .eq('is_active', true) // Apenas vendedores ativos
        .order('name');
      
      if (error) {
        console.error(`Erro ao buscar vendedores da loja ${storeId}:`, error);
        return [];
      }
      
      if (!data || !Array.isArray(data)) {
        console.error('Dados de vendedores inválidos:', data);
        return [];
      }
      
      // Converter de snake_case para camelCase
      return data.map(item => ({
        id: item.id,
        name: item.name,
        storeId: item.store_id,
        whatsapp: item.whatsapp || '',
        isActive: true,
        createdAt: item.created_at,
        updatedAt: item.updated_at
      })) as Seller[];
    } catch (error) {
      console.error(`Exceção ao buscar vendedores da loja ${storeId}:`, error);
      return [];
    }
  },

  // Buscar um vendedor pelo ID
  async getById(id: string): Promise<Seller | null> {
    await this.checkAndInitializeSellersTable();
    
    const { data, error } = await supabase
      .from('sellers')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error(`Erro ao buscar vendedor ${id}:`, error);
      return null;
    }
    
    // Converter de snake_case para camelCase
    return {
      id: data.id,
      name: data.name,
      storeId: data.store_id,
      whatsapp: data.whatsapp,
      isActive: data.is_active !== false,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    } as Seller;
  },

  // Adicionar um novo vendedor
  async add(seller: Omit<Seller, 'id'>): Promise<Seller | null> {
    await this.checkAndInitializeSellersTable();

    // Formatar o WhatsApp para garantir que esteja no formato correto
    let whatsapp = seller.whatsapp.replace(/\D/g, '');
    
    // Adicionar o código do país (Brasil - 55) se não existir
    if (!whatsapp.startsWith('55')) {
      whatsapp = `55${whatsapp}`;
    }
    
    // Converter de camelCase para snake_case
    const supabaseSeller = {
      name: seller.name,
      store_id: seller.storeId,
      whatsapp: whatsapp,
      is_active: seller.isActive !== false
    };
    
    const { data, error } = await supabase
      .from('sellers')
      .insert([supabaseSeller])
      .select();
    
    if (error) {
      console.error('Erro ao adicionar vendedor:', error);
      return null;
    }
    
    // Converter de volta para camelCase
    return {
      id: data[0].id,
      name: data[0].name,
      storeId: data[0].store_id,
      whatsapp: data[0].whatsapp,
      isActive: data[0].is_active,
      createdAt: data[0].created_at,
      updatedAt: data[0].updated_at
    } as Seller;
  },

  // Atualizar um vendedor existente
  async update(id: string, updates: Partial<Seller>): Promise<boolean> {
    await this.checkAndInitializeSellersTable();
    
    // Converter de camelCase para snake_case
    const supabaseUpdates: any = {};
    
    if (updates.name !== undefined) supabaseUpdates.name = updates.name;
    if (updates.storeId !== undefined) supabaseUpdates.store_id = updates.storeId;
    
    if (updates.whatsapp !== undefined) {
      // Formatar o WhatsApp
      let whatsapp = updates.whatsapp.replace(/\D/g, '');
      
      // Adicionar o código do país se não existir
      if (!whatsapp.startsWith('55')) {
        whatsapp = `55${whatsapp}`;
      }
      
      supabaseUpdates.whatsapp = whatsapp;
    }
    
    if (updates.isActive !== undefined) supabaseUpdates.is_active = updates.isActive;
    
    const { error } = await supabase
      .from('sellers')
      .update(supabaseUpdates)
      .eq('id', id);
    
    if (error) {
      console.error(`Erro ao atualizar vendedor ${id}:`, error);
      return false;
    }
    
    return true;
  },

  // Excluir um vendedor
  async delete(id: string): Promise<boolean> {
    await this.checkAndInitializeSellersTable();
    
    const { error } = await supabase
      .from('sellers')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error(`Erro ao excluir vendedor ${id}:`, error);
      return false;
    }
    
    return true;
  }
};
