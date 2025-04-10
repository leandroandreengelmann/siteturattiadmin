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

// Tipo para dados de analytics
export type VisitorData = {
  id: string;
  sessionId: string;
  timestamp: string;
  page: string;
  referrer: string;
  userAgent: string;
  device: string;
  browser: string;
  country: string;
  city: string;
  timeOnPage: number;
  scrollDepth: number;
  isNewVisitor: boolean;
  returningVisitor: boolean;
};

export type PageViewSummary = {
  page: string;
  views: number;
  uniqueVisitors: number;
  avgTimeOnPage: number;
  bounceRate: number;
};

export type VisitorStats = {
  totalVisitors: number;
  uniqueVisitors: number;
  newVisitors: number;
  returningVisitors: number;
  averageSessionDuration: number;
  bounceRate: number;
  pageViews: number;
  pagesPerSession: number;
};

export type DeviceData = {
  device: string;
  count: number;
  percentage: number;
};

export type BrowserData = {
  browser: string;
  count: number;
  percentage: number;
};

export type GeoData = {
  country: string;
  count: number;
  percentage: number;
};

export type TimeSeriesData = {
  date: string;
  visitors: number;
  pageViews: number;
};

// Lista de cidades brasileiras
const brazilianCities = [
  'São Paulo', 'Rio de Janeiro', 'Belo Horizonte', 'Brasília', 'Salvador', 
  'Fortaleza', 'Recife', 'Curitiba', 'Manaus', 'Porto Alegre'
];

// Lista de cidades do Mato Grosso
const matoGrossoCities = [
  'Cuiabá', 'Várzea Grande', 'Rondonópolis', 'Sinop', 'Tangará da Serra',
  'Cáceres', 'Sorriso', 'Lucas do Rio Verde', 'Primavera do Leste', 'Barra do Garças',
  'Alta Floresta', 'Nova Mutum', 'Campo Verde', 'Pontes e Lacerda', 'Juína',
  'Colíder', 'Guarantã do Norte', 'Juara', 'Peixoto de Azevedo', 'Poconé'
];

// Dados simulados para o serviço de analytics
const mockVisitorData: VisitorData[] = Array.from({ length: 500 }, (_, i) => {
  const devices = ['desktop', 'mobile', 'tablet'];
  const browsers = ['Chrome', 'Firefox', 'Safari', 'Edge'];
  const countries = ['Brasil', 'Portugal', 'Estados Unidos', 'Argentina', 'Espanha'];
  const brazilianCities = [
    'São Paulo', 'Rio de Janeiro', 'Belo Horizonte', 'Salvador', 'Brasília', 
    'Fortaleza', 'Recife', 'Porto Alegre', 'Curitiba', 'Manaus', 
    'Belém', 'Goiânia', 'Guarulhos', 'Campinas', 'Florianópolis',
    'Vitória', 'Campo Grande', 'Cuiabá', 'João Pessoa', 'Maceió'
  ];
  const pages = ['/', '/products', '/collections', '/about', '/contact', '/stores'];
  const referrers = ['google.com', 'facebook.com', 'instagram.com', 'direct', 'bing.com'];
  const randomDate = new Date();
  randomDate.setDate(randomDate.getDate() - Math.floor(Math.random() * 30));
  
  const country = countries[Math.floor(Math.random() * countries.length)];
  // Se o país for Brasil, use uma cidade brasileira, caso contrário deixe como "Cidade Exemplo"
  const city = country === 'Brasil' 
    ? brazilianCities[Math.floor(Math.random() * brazilianCities.length)]
    : 'Cidade Exemplo';
  
  // Para alguns visitantes do Brasil, atribuir cidades do Mato Grosso
  const isMTVisitor = country === 'Brasil' && Math.random() < 0.3; // 30% dos visitantes brasileiros serão de MT
  const finalCity = isMTVisitor 
    ? matoGrossoCities[Math.floor(Math.random() * matoGrossoCities.length)]
    : city;
  
  return {
    id: `visitor_${i}`,
    sessionId: `session_${Math.floor(i / 3)}`, // Cada visitante faz cerca de 3 visitas
    timestamp: randomDate.toISOString(),
    page: pages[Math.floor(Math.random() * pages.length)],
    referrer: referrers[Math.floor(Math.random() * referrers.length)],
    userAgent: 'Mozilla/5.0',
    device: devices[Math.floor(Math.random() * devices.length)],
    browser: browsers[Math.floor(Math.random() * browsers.length)],
    country: country,
    city: finalCity,
    timeOnPage: Math.floor(Math.random() * 300) + 10, // 10-310 segundos
    scrollDepth: Math.floor(Math.random() * 100), // 0-100%
    isNewVisitor: Math.random() > 0.7, // 30% novos, 70% recorrentes
    returningVisitor: Math.random() <= 0.7,
  };
});

// Serviço de Analytics
export const analyticsService = {
  // Obter estatísticas gerais
  getStats: async (startDate?: string, endDate?: string): Promise<VisitorStats> => {
    // Filtragem por data
    let filteredData = [...mockVisitorData];
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      filteredData = mockVisitorData.filter(
        data => {
          const date = new Date(data.timestamp);
          return date >= start && date <= end;
        }
      );
    }
    
    // Cálculo das estatísticas
    const sessions = [...new Set(filteredData.map(d => d.sessionId))];
    const uniqueVisitors = [...new Set(filteredData.map(d => d.id))];
    const newVisitors = filteredData.filter(d => d.isNewVisitor);
    const returningVisitors = filteredData.filter(d => d.returningVisitor);
    
    // Calcular duração média da sessão
    const sessionDurations: {[key: string]: number} = {};
    filteredData.forEach(data => {
      if (!sessionDurations[data.sessionId]) {
        sessionDurations[data.sessionId] = 0;
      }
      sessionDurations[data.sessionId] += data.timeOnPage;
    });
    
    const totalSessionDuration = Object.values(sessionDurations).reduce((sum, duration) => sum + duration, 0);
    const averageSessionDuration = sessions.length ? totalSessionDuration / sessions.length : 0;
    
    // Calcular taxa de rejeição (sessões com apenas uma visualização de página)
    const sessionPageCounts: {[key: string]: number} = {};
    filteredData.forEach(data => {
      if (!sessionPageCounts[data.sessionId]) {
        sessionPageCounts[data.sessionId] = 0;
      }
      sessionPageCounts[data.sessionId]++;
    });
    
    const bounceCount = Object.values(sessionPageCounts).filter(count => count === 1).length;
    const bounceRate = sessions.length ? (bounceCount / sessions.length) * 100 : 0;
    
    const pagesPerSession = sessions.length ? filteredData.length / sessions.length : 0;
    
    return {
      totalVisitors: filteredData.length,
      uniqueVisitors: uniqueVisitors.length,
      newVisitors: newVisitors.length,
      returningVisitors: returningVisitors.length,
      averageSessionDuration,
      bounceRate,
      pageViews: filteredData.length,
      pagesPerSession,
    };
  },
  
  // Obter dados de visualizações de página
  getPageViews: async (startDate?: string, endDate?: string): Promise<PageViewSummary[]> => {
    // Filtragem por data
    let filteredData = [...mockVisitorData];
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      filteredData = mockVisitorData.filter(
        data => {
          const date = new Date(data.timestamp);
          return date >= start && date <= end;
        }
      );
    }
    
    // Agrupar por página
    const pageGroups: { [key: string]: VisitorData[] } = {};
    filteredData.forEach(data => {
      if (!pageGroups[data.page]) {
        pageGroups[data.page] = [];
      }
      pageGroups[data.page].push(data);
    });
    
    // Calcular estatísticas por página
    return Object.entries(pageGroups).map(([page, visits]) => {
      const uniqueVisitors = [...new Set(visits.map(v => v.id))].length;
      const avgTimeOnPage = visits.reduce((sum, visit) => sum + visit.timeOnPage, 0) / visits.length;
      
      // Calcular taxa de rejeição por página
      const sessionIds = [...new Set(visits.map(v => v.sessionId))];
      let bounceCount = 0;
      
      sessionIds.forEach(sessionId => {
        const sessionPageViews = filteredData.filter(d => d.sessionId === sessionId);
        if (sessionPageViews.length === 1 && sessionPageViews[0].page === page) {
          bounceCount++;
        }
      });
      
      const bounceRate = sessionIds.length ? (bounceCount / sessionIds.length) * 100 : 0;
      
      return {
        page,
        views: visits.length,
        uniqueVisitors,
        avgTimeOnPage,
        bounceRate
      };
    });
  },
  
  // Obter dados de dispositivos
  getDeviceData: async (startDate?: string, endDate?: string): Promise<DeviceData[]> => {
    // Filtragem por data
    let filteredData = [...mockVisitorData];
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      filteredData = mockVisitorData.filter(
        data => {
          const date = new Date(data.timestamp);
          return date >= start && date <= end;
        }
      );
    }
    
    const deviceCounts: { [key: string]: number } = {};
    filteredData.forEach(data => {
      if (!deviceCounts[data.device]) {
        deviceCounts[data.device] = 0;
      }
      deviceCounts[data.device]++;
    });
    
    const total = filteredData.length;
    
    return Object.entries(deviceCounts).map(([device, count]) => ({
      device,
      count,
      percentage: (count / total) * 100
    }));
  },
  
  // Obter dados de navegadores
  getBrowserData: async (startDate?: string, endDate?: string): Promise<BrowserData[]> => {
    // Filtragem por data
    let filteredData = [...mockVisitorData];
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      filteredData = mockVisitorData.filter(
        data => {
          const date = new Date(data.timestamp);
          return date >= start && date <= end;
        }
      );
    }
    
    const browserCounts: { [key: string]: number } = {};
    filteredData.forEach(data => {
      if (!browserCounts[data.browser]) {
        browserCounts[data.browser] = 0;
      }
      browserCounts[data.browser]++;
    });
    
    const total = filteredData.length;
    
    return Object.entries(browserCounts).map(([browser, count]) => ({
      browser,
      count,
      percentage: (count / total) * 100
    }));
  },
  
  // Obter dados geográficos
  getGeoData: async (startDate?: string, endDate?: string): Promise<GeoData[]> => {
    // Filtragem por data
    let filteredData = [...mockVisitorData];
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      filteredData = mockVisitorData.filter(
        data => {
          const date = new Date(data.timestamp);
          return date >= start && date <= end;
        }
      );
    }
    
    const countryCounts: { [key: string]: number } = {};
    filteredData.forEach(data => {
      if (!countryCounts[data.country]) {
        countryCounts[data.country] = 0;
      }
      countryCounts[data.country]++;
    });
    
    const total = filteredData.length;
    
    return Object.entries(countryCounts).map(([country, count]) => ({
      country,
      count,
      percentage: (count / total) * 100
    }));
  },
  
  // Obter série temporal
  getTimeSeriesData: async (startDate?: string, endDate?: string, interval: 'day' | 'week' | 'month' = 'day'): Promise<TimeSeriesData[]> => {
    // Filtragem por data
    let filteredData = [...mockVisitorData];
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      filteredData = mockVisitorData.filter(
        data => {
          const date = new Date(data.timestamp);
          return date >= start && date <= end;
        }
      );
    }
    
    // Agrupar por data conforme o intervalo
    const dateGroups: { [key: string]: { visitors: Set<string>, pageViews: number } } = {};
    
    filteredData.forEach(data => {
      const date = new Date(data.timestamp);
      let dateKey: string;
      
      if (interval === 'day') {
        dateKey = date.toISOString().split('T')[0]; // YYYY-MM-DD
      } else if (interval === 'week') {
        // Obter o primeiro dia da semana (domingo)
        const firstDayOfWeek = new Date(date);
        const day = date.getDay();
        firstDayOfWeek.setDate(date.getDate() - day);
        dateKey = firstDayOfWeek.toISOString().split('T')[0];
      } else {
        // Mês: YYYY-MM
        dateKey = date.toISOString().split('T')[0].substring(0, 7);
      }
      
      if (!dateGroups[dateKey]) {
        dateGroups[dateKey] = {
          visitors: new Set(),
          pageViews: 0
        };
      }
      
      dateGroups[dateKey].visitors.add(data.id);
      dateGroups[dateKey].pageViews++;
    });
    
    // Converter para o formato final
    return Object.entries(dateGroups)
      .map(([date, data]) => ({
        date,
        visitors: data.visitors.size,
        pageViews: data.pageViews
      }))
      .sort((a, b) => a.date.localeCompare(b.date));
  },
  
  // Obter dados de referenciadores
  getReferrerData: async (startDate?: string, endDate?: string): Promise<{ referrer: string, count: number, percentage: number }[]> => {
    // Filtragem por data
    let filteredData = [...mockVisitorData];
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      filteredData = mockVisitorData.filter(
        data => {
          const date = new Date(data.timestamp);
          return date >= start && date <= end;
        }
      );
    }
    
    const referrerCounts: { [key: string]: number } = {};
    filteredData.forEach(data => {
      if (!referrerCounts[data.referrer]) {
        referrerCounts[data.referrer] = 0;
      }
      referrerCounts[data.referrer]++;
    });
    
    const total = filteredData.length;
    
    return Object.entries(referrerCounts)
      .map(([referrer, count]) => ({
        referrer,
        count,
        percentage: (count / total) * 100
      }))
      .sort((a, b) => b.count - a.count);
  },
  
  // Obter dados geográficos por cidade do Brasil
  getBrazilCityData: async (startDate?: string, endDate?: string): Promise<{ city: string, count: number, percentage: number }[]> => {
    // Filtragem por data
    let filteredData = [...mockVisitorData];
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      filteredData = mockVisitorData.filter(
        data => {
          const date = new Date(data.timestamp);
          return date >= start && date <= end;
        }
      );
    }
    
    // Filtrar apenas visitantes do Brasil
    const brazilVisitors = filteredData.filter(data => data.country === 'Brasil');
    
    const cityCounts: { [key: string]: number } = {};
    brazilVisitors.forEach(data => {
      if (!cityCounts[data.city]) {
        cityCounts[data.city] = 0;
      }
      cityCounts[data.city]++;
    });
    
    const total = brazilVisitors.length || 1; // Evitar divisão por zero
    
    return Object.entries(cityCounts)
      .map(([city, count]) => ({
        city,
        count,
        percentage: (count / total) * 100
      }))
      .sort((a, b) => b.count - a.count);
  },
  
  // Obter dispositivos usados por cidade
  getDevicesByCity: async (city: string, startDate?: string, endDate?: string): Promise<DeviceData[]> => {
    // Filtragem por data
    let filteredData = [...mockVisitorData];
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      filteredData = mockVisitorData.filter(
        data => {
          const date = new Date(data.timestamp);
          return date >= start && date <= end;
        }
      );
    }
    
    // Filtrar apenas visitantes da cidade específica no Brasil
    const cityVisitors = filteredData.filter(data => 
      data.country === 'Brasil' && data.city === city);
    
    const deviceCounts: { [key: string]: number } = {};
    cityVisitors.forEach(data => {
      if (!deviceCounts[data.device]) {
        deviceCounts[data.device] = 0;
      }
      deviceCounts[data.device]++;
    });
    
    const total = cityVisitors.length || 1; // Evitar divisão por zero
    
    return Object.entries(deviceCounts).map(([device, count]) => ({
      device,
      count,
      percentage: (count / total) * 100
    }));
  },
  
  // Obter dados de páginas visitadas por cidade
  getPageViewsByCity: async (city: string, startDate?: string, endDate?: string): Promise<PageViewSummary[]> => {
    // Filtragem por data
    let filteredData = [...mockVisitorData];
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      filteredData = mockVisitorData.filter(
        data => {
          const date = new Date(data.timestamp);
          return date >= start && date <= end;
        }
      );
    }
    
    // Filtrar apenas visitantes da cidade específica no Brasil
    const cityVisitors = filteredData.filter(data => 
      data.country === 'Brasil' && data.city === city);
    
    // Agrupar por página
    const pageGroups: { [key: string]: VisitorData[] } = {};
    cityVisitors.forEach(data => {
      if (!pageGroups[data.page]) {
        pageGroups[data.page] = [];
      }
      pageGroups[data.page].push(data);
    });
    
    // Calcular estatísticas por página
    return Object.entries(pageGroups).map(([page, visits]) => {
      const uniqueVisitors = [...new Set(visits.map(v => v.id))].length;
      const avgTimeOnPage = visits.reduce((sum, visit) => sum + visit.timeOnPage, 0) / visits.length;
      
      // Calcular taxa de rejeição por página
      const sessionIds = [...new Set(visits.map(v => v.sessionId))];
      let bounceCount = 0;
      
      sessionIds.forEach(sessionId => {
        const sessionPageViews = filteredData.filter(d => d.sessionId === sessionId);
        if (sessionPageViews.length === 1 && sessionPageViews[0].page === page) {
          bounceCount++;
        }
      });
      
      const bounceRate = sessionIds.length ? (bounceCount / sessionIds.length) * 100 : 0;
      
      return {
        page,
        views: visits.length,
        uniqueVisitors,
        avgTimeOnPage,
        bounceRate
      };
    });
  },
  
  // Obter dados geográficos por cidade do Mato Grosso
  getMatoGrossoCityData: async (startDate?: string, endDate?: string): Promise<{ city: string, count: number, percentage: number }[]> => {
    // Filtragem por data
    let filteredData = [...mockVisitorData];
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      filteredData = mockVisitorData.filter(
        data => {
          const date = new Date(data.timestamp);
          return date >= start && date <= end;
        }
      );
    }
    
    // Filtrar apenas visitantes do Brasil que estão em cidades do Mato Grosso
    const mtVisitors = filteredData.filter(data => 
      data.country === 'Brasil' && matoGrossoCities.includes(data.city));
    
    const cityCounts: { [key: string]: number } = {};
    mtVisitors.forEach(data => {
      if (!cityCounts[data.city]) {
        cityCounts[data.city] = 0;
      }
      cityCounts[data.city]++;
    });
    
    const total = mtVisitors.length || 1; // Evitar divisão por zero
    
    return Object.entries(cityCounts)
      .map(([city, count]) => ({
        city,
        count,
        percentage: (count / total) * 100
      }))
      .sort((a, b) => b.count - a.count);
  },
  
  // Obter dispositivos usados por cidade do Mato Grosso
  getDevicesByMatoGrossoCity: async (city: string, startDate?: string, endDate?: string): Promise<DeviceData[]> => {
    // Filtragem por data
    let filteredData = [...mockVisitorData];
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      filteredData = mockVisitorData.filter(
        data => {
          const date = new Date(data.timestamp);
          return date >= start && date <= end;
        }
      );
    }
    
    // Filtrar apenas visitantes da cidade específica no Mato Grosso
    const cityVisitors = filteredData.filter(data => 
      data.country === 'Brasil' && data.city === city && matoGrossoCities.includes(data.city));
    
    const deviceCounts: { [key: string]: number } = {};
    cityVisitors.forEach(data => {
      if (!deviceCounts[data.device]) {
        deviceCounts[data.device] = 0;
      }
      deviceCounts[data.device]++;
    });
    
    const total = cityVisitors.length || 1; // Evitar divisão por zero
    
    return Object.entries(deviceCounts).map(([device, count]) => ({
      device,
      count,
      percentage: (count / total) * 100
    }));
  },
  
  // Obter dados de páginas visitadas por cidade do Mato Grosso
  getPageViewsByMatoGrossoCity: async (city: string, startDate?: string, endDate?: string): Promise<PageViewSummary[]> => {
    // Filtragem por data
    let filteredData = [...mockVisitorData];
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      filteredData = mockVisitorData.filter(
        data => {
          const date = new Date(data.timestamp);
          return date >= start && date <= end;
        }
      );
    }
    
    // Filtrar apenas visitantes da cidade específica no Mato Grosso
    const cityVisitors = filteredData.filter(data => 
      data.country === 'Brasil' && data.city === city && matoGrossoCities.includes(data.city));
    
    // Agrupar por página
    const pageGroups: { [key: string]: VisitorData[] } = {};
    cityVisitors.forEach(data => {
      if (!pageGroups[data.page]) {
        pageGroups[data.page] = [];
      }
      pageGroups[data.page].push(data);
    });
    
    // Calcular estatísticas por página
    return Object.entries(pageGroups).map(([page, visits]) => {
      const uniqueVisitors = [...new Set(visits.map(v => v.id))].length;
      const avgTimeOnPage = visits.reduce((sum, visit) => sum + visit.timeOnPage, 0) / visits.length;
      
      // Calcular taxa de rejeição por página
      const sessionIds = [...new Set(visits.map(v => v.sessionId))];
      let bounceCount = 0;
      
      sessionIds.forEach(sessionId => {
        const sessionPageViews = filteredData.filter(d => d.sessionId === sessionId);
        if (sessionPageViews.length === 1 && sessionPageViews[0].page === page) {
          bounceCount++;
        }
      });
      
      const bounceRate = sessionIds.length ? (bounceCount / sessionIds.length) * 100 : 0;
      
      return {
        page,
        views: visits.length,
        uniqueVisitors,
        avgTimeOnPage,
        bounceRate
      };
    });
  },

  // Get visitor data by date range
  getVisitorData: (startDate?: string, endDate?: string) => {
    let filteredData = [...mockVisitorData];
    
    if (startDate) {
      const start = new Date(startDate);
      filteredData = filteredData.filter(item => new Date(item.timestamp) >= start);
    }
    
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999); // End of the day
      filteredData = filteredData.filter(item => new Date(item.timestamp) <= end);
    }
    
    return filteredData;
  },
};

// Aqui terminam os serviços 