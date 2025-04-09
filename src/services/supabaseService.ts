// Arquivo de compatibilidade para páginas que ainda importam supabaseService
// Exporta os serviços locais com os mesmos nomes para evitar quebrar as páginas existentes

import { 
  bannerService as localBannerService,
  colorService,
  colorCollectionService,
  productService,
  storeService,
  sellerService 
} from './localDataService';
import { Banner } from '@/data/types';

// Serviço de autenticação simulado básico para manter compatibilidade
const authService = {
  getSession: async () => ({ 
    user: { email: 'admin@example.com', role: 'admin' },
    session: { expires_at: Date.now() + 86400000 }
  }),
  login: async () => ({ success: true, message: 'Login simulado' }),
  logout: async () => ({ success: true, message: 'Logout simulado' }),
  isAdmin: async () => true,
  createUser: async () => ({ success: true, message: 'Usuário criado (simulado)' }),
  isAuthenticated: async () => true,
  checkAuthStatus: async () => true
};

// Criar versão estendida do serviço de banners com funcionalidade de upload
const bannerService = {
  ...localBannerService,
  uploadBannerImage: async (file: File): Promise<string> => {
    // Simula upload retornando uma URL de placeholder
    return URL.createObjectURL(file);
  }
};

// Exporta todos os serviços
export {
  authService,
  bannerService,
  colorService as colorService,
  colorCollectionService as collectionService,
  productService,
  storeService,
  sellerService
}; 