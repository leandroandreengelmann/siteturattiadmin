import { Product, ColorCollection, Color, Store, ProductImage, Banner, Seller } from '@/data/types';
import { products as sampleProducts, colorCollections as sampleCollections, colors as sampleColors, stores as sampleStores } from '@/data/sampleData';

// Função para criar IDs únicos
const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

// Serviços para Produtos
export const productService = {
  // Buscar todos os produtos
  async getAll(): Promise<Product[]> {
    return sampleProducts;
  },

  // Buscar produtos em promoção
  async getPromotions(): Promise<Product[]> {
    return sampleProducts.filter(product => product.isPromotion);
  },

  // Buscar produtos que não estão em promoção
  async getNonPromotions(): Promise<Product[]> {
    return sampleProducts.filter(product => !product.isPromotion);
  },

  // Buscar um produto pelo ID
  async getById(id: string): Promise<Product | null> {
    const product = sampleProducts.find(product => product.id === id);
    if (!product) return null;
    return product;
  },

  // Adicionar um novo produto (simulação)
  async add(product: Omit<Product, 'id'>): Promise<Product | null> {
    const newProduct = {
      ...product,
      id: generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Na vida real, adicionaria ao banco de dados
    // Aqui só retornamos o produto como se tivesse sido adicionado
    return newProduct;
  },

  // Atualizar um produto (simulação)
  async update(id: string, updates: Partial<Product>): Promise<Product | null> {
    const product = await this.getById(id);
    if (!product) return null;
    
    const updatedProduct = {
      ...product,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    // Na vida real, atualizaria no banco de dados
    // Aqui só retornamos o produto como se tivesse sido atualizado
    return updatedProduct;
  },

  // Excluir um produto (simulação)
  async delete(id: string): Promise<boolean> {
    // Na vida real, removeria do banco de dados
    // Aqui só retornamos true como se tivesse sido removido
    return true;
  }
};

// Serviços para Coleções de Cores
export const colorCollectionService = {
  // Buscar todas as coleções
  async getAll(): Promise<ColorCollection[]> {
    return sampleCollections;
  },

  // Buscar uma coleção pelo ID
  async getById(id: string): Promise<ColorCollection | null> {
    return sampleCollections.find(collection => collection.id === id) || null;
  },

  // Adicionar uma nova coleção (simulação)
  async add(collection: Omit<ColorCollection, 'id'>): Promise<ColorCollection | null> {
    const newCollection = {
      ...collection,
      id: generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    return newCollection;
  },

  // Atualizar uma coleção (simulação)
  async update(id: string, updates: Partial<ColorCollection>): Promise<ColorCollection | null> {
    const collection = await this.getById(id);
    if (!collection) return null;
    
    const updatedCollection = {
      ...collection,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    return updatedCollection;
  },

  // Excluir uma coleção (simulação)
  async delete(id: string): Promise<boolean> {
    return true;
  }
};

// Serviços para Cores
export const colorService = {
  // Buscar todas as cores
  async getAll(): Promise<Color[]> {
    return sampleColors;
  },

  // Buscar cores por ID de coleção
  async getByCollectionId(collectionId: string): Promise<Color[]> {
    return sampleColors.filter(color => color.collectionId === collectionId);
  },

  // Buscar uma cor pelo ID
  async getById(id: string): Promise<Color | null> {
    return sampleColors.find(color => color.id === id) || null;
  },

  // Adicionar uma nova cor (simulação)
  async add(color: Omit<Color, 'id'>): Promise<Color | null> {
    const newColor = {
      ...color,
      id: generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    return newColor;
  },

  // Atualizar uma cor (simulação)
  async update(id: string, updates: Partial<Color>): Promise<Color | null> {
    const color = await this.getById(id);
    if (!color) return null;
    
    const updatedColor = {
      ...color,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    return updatedColor;
  },

  // Excluir uma cor (simulação)
  async delete(id: string): Promise<boolean> {
    return true;
  }
};

// Serviços para Lojas
export const storeService = {
  // Buscar todas as lojas
  async getAll(): Promise<Store[]> {
    return sampleStores || [];
  },

  // Buscar uma loja pelo ID
  async getById(id: string): Promise<Store | null> {
    if (!sampleStores) return null;
    return sampleStores.find(store => store.id === id) || null;
  },

  // Adicionar uma nova loja (simulação)
  async add(store: Omit<Store, 'id'>): Promise<Store | null> {
    const newStore = {
      ...store,
      id: generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    return newStore;
  },

  // Atualizar uma loja (simulação)
  async update(id: string, updates: Partial<Store>): Promise<Store | null> {
    const store = await this.getById(id);
    if (!store) return null;
    
    const updatedStore = {
      ...store,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    return updatedStore;
  },

  // Excluir uma loja (simulação)
  async delete(id: string): Promise<boolean> {
    return true;
  }
};

// Dados simulados para banners
const sampleBanners: Banner[] = [
  {
    id: '1',
    imageUrl: 'https://picsum.photos/1200/400?random=1',
    isActive: true,
    order: 1
  },
  {
    id: '2',
    imageUrl: 'https://picsum.photos/1200/400?random=2',
    isActive: true,
    order: 2
  }
];

// Serviço para Banners
export const bannerService = {
  // Buscar todos os banners ativos
  async getActive(): Promise<Banner[]> {
    return sampleBanners.filter(banner => banner.isActive).sort((a, b) => (a.order || 0) - (b.order || 0));
  },
  
  // Buscar todos os banners
  async getAll(): Promise<Banner[]> {
    return sampleBanners;
  },

  // Buscar um banner pelo ID
  async getById(id: string): Promise<Banner | null> {
    return sampleBanners.find(banner => banner.id === id) || null;
  },

  // Adicionar um novo banner (simulação)
  async add(banner: Omit<Banner, 'id'>): Promise<Banner | null> {
    const newBanner = {
      ...banner,
      id: generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    return newBanner;
  },

  // Atualizar um banner (simulação)
  async update(id: string, updates: Partial<Banner>): Promise<Banner | null> {
    const banner = await this.getById(id);
    if (!banner) return null;
    
    const updatedBanner = {
      ...banner,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    return updatedBanner;
  },

  // Excluir um banner (simulação)
  async delete(id: string): Promise<boolean> {
    return true;
  }
};

// Dados simulados para vendedores
const sampleSellers: Seller[] = [
  {
    id: '1',
    name: 'João Silva',
    storeId: '1',
    whatsapp: '+5511999999999',
    isActive: true
  },
  {
    id: '2',
    name: 'Maria Oliveira',
    storeId: '1',
    whatsapp: '+5511988888888',
    isActive: true
  },
  {
    id: '3',
    name: 'Carlos Santos',
    storeId: '2',
    whatsapp: '+5511977777777',
    isActive: true
  }
];

// Serviço para Vendedores
export const sellerService = {
  // Buscar todos os vendedores
  async getAll(): Promise<Seller[]> {
    return sampleSellers;
  },

  // Buscar vendedores por ID de loja
  async getByStoreId(storeId: string): Promise<Seller[]> {
    return sampleSellers.filter(seller => seller.storeId === storeId);
  },

  // Buscar um vendedor pelo ID
  async getById(id: string): Promise<Seller | null> {
    return sampleSellers.find(seller => seller.id === id) || null;
  },

  // Adicionar um novo vendedor (simulação)
  async add(seller: Omit<Seller, 'id'>): Promise<Seller | null> {
    const newSeller = {
      ...seller,
      id: generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    return newSeller;
  },

  // Atualizar um vendedor (simulação)
  async update(id: string, updates: Partial<Seller>): Promise<Seller | null> {
    const seller = await this.getById(id);
    if (!seller) return null;
    
    const updatedSeller = {
      ...seller,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    return updatedSeller;
  },

  // Excluir um vendedor (simulação)
  async delete(id: string): Promise<boolean> {
    return true;
  }
};

// Aqui terminam os serviços 