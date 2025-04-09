// Data models for Turatti store

// Product image model
export interface ProductImage {
  id?: string;
  productId?: string;
  highResolution: string; // URL para imagem em alta resolução
  standard: string;      // URL para imagem em tamanho padrão para exibição
  thumbnail: string;     // URL para miniatura
  isMain?: boolean;      // Indica se é a imagem principal do produto
  createdAt?: string;
  updatedAt?: string;
}

// Product model
export interface Product {
  id: string;
  name: string;
  price: number;
  promoPrice?: number;
  images: ProductImage[]; // Array de imagens substituindo o campo image anterior
  description: string;
  isPromotion: boolean;
  installments?: number;  // Número de parcelas disponíveis para o produto
  sellerName?: string;   // Nome do vendedor do produto
  sellerPhone?: string;  // Número de telefone do vendedor
  createdAt?: string;
  updatedAt?: string;
}

// Banner model
export interface Banner {
  id: string;
  imageUrl: string;     // URL para a imagem do banner
  isActive: boolean;    // Indica se o banner está ativo
  order?: number;       // Ordem de exibição para múltiplos banners
  createdAt?: string;
  updatedAt?: string;
}

// Color Collection model
export interface ColorCollection {
  id: string;
  name: string;
  representativeColor?: string;
  imageUrl?: string;
  description: string;
  createdAt?: string;
  updatedAt?: string;
}

// Color model
export interface Color {
  id: string;
  name: string;
  collectionId?: string;
  hexCode?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Store model
export interface Store {
  id: string;
  name: string;
  city: string;
  phone: string;
  hours?: string;
  iconUrl?: string;     // URL para o ícone da loja
  isActive?: boolean;   // Indica se a loja está ativa
  createdAt?: string;
  updatedAt?: string;
}

// Seller model (Vendedor)
export interface Seller {
  id: string;
  name: string;
  storeId: string;      // ID da loja a qual o vendedor está associado
  whatsapp: string;     // Número do WhatsApp do vendedor (com código do país)
  isActive?: boolean;   // Indica se o vendedor está ativo
  createdAt?: string;
  updatedAt?: string;
}
