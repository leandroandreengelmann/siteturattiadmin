import { Product, ColorCollection, Color, Store, ProductImage } from './types';

// Sample products data
export const products: Product[] = [
  {
    id: '1',
    name: 'Cimento Portland CP II 50kg',
    price: 39.90,
    promoPrice: 34.90,
    sellerName: 'João Silva',
    sellerPhone: '44999887766',
    installments: 3,
    images: [
      {
        id: '1-1',
        productId: '1',
        highResolution: 'https://via.placeholder.com/300x300?text=Cimento',
        standard: 'https://via.placeholder.com/300x300?text=Cimento',
        thumbnail: 'https://via.placeholder.com/150x150?text=Cimento',
        isMain: true
      }
    ],
    description: 'Cimento Portland de alta qualidade para construções residenciais e comerciais.',
    isPromotion: true,
  },
  {
    id: '2',
    name: 'Tijolo Cerâmico 8 Furos (Pacote com 100)',
    price: 199.90,
    sellerName: 'Maria Oliveira',
    sellerPhone: '44998765432',
    installments: 10,
    images: [
      {
        id: '2-1',
        productId: '2',
        highResolution: 'https://via.placeholder.com/300x300?text=Tijolo',
        standard: 'https://via.placeholder.com/300x300?text=Tijolo',
        thumbnail: 'https://via.placeholder.com/150x150?text=Tijolo',
        isMain: true
      }
    ],
    description: 'Tijolo cerâmico de 8 furos, ideal para construção de paredes e divisórias.',
    isPromotion: false,
  },
  {
    id: '3',
    name: 'Argamassa Colante AC-II 20kg',
    price: 29.90,
    promoPrice: 24.90,
    images: [
      {
        id: '3-1',
        productId: '3',
        highResolution: 'https://via.placeholder.com/300x300?text=Argamassa',
        standard: 'https://via.placeholder.com/300x300?text=Argamassa',
        thumbnail: 'https://via.placeholder.com/150x150?text=Argamassa',
        isMain: true
      }
    ],
    description: 'Argamassa colante para assentamento de revestimentos cerâmicos em áreas internas e externas.',
    isPromotion: true,
  },
  {
    id: '4',
    name: 'Areia Média (Saco 20kg)',
    price: 12.90,
    images: [
      {
        id: '4-1',
        productId: '4',
        highResolution: 'https://via.placeholder.com/300x300?text=Areia',
        standard: 'https://via.placeholder.com/300x300?text=Areia',
        thumbnail: 'https://via.placeholder.com/150x150?text=Areia',
        isMain: true
      }
    ],
    description: 'Areia média lavada para uso em argamassas, concretos e outros serviços de construção.',
    isPromotion: false,
  },
  {
    id: '5',
    name: 'Brita 1 (Saco 20kg)',
    price: 14.90,
    images: [
      {
        id: '5-1',
        productId: '5',
        highResolution: 'https://via.placeholder.com/300x300?text=Brita',
        standard: 'https://via.placeholder.com/300x300?text=Brita',
        thumbnail: 'https://via.placeholder.com/150x150?text=Brita',
        isMain: true
      }
    ],
    description: 'Brita 1 para uso em concretos e outros serviços de construção.',
    isPromotion: false,
  },
  {
    id: '6',
    name: 'Telha Cerâmica Portuguesa (Pacote com 10)',
    price: 89.90,
    promoPrice: 79.90,
    images: [
      {
        id: '6-1',
        productId: '6',
        highResolution: 'https://via.placeholder.com/300x300?text=Telha',
        standard: 'https://via.placeholder.com/300x300?text=Telha',
        thumbnail: 'https://via.placeholder.com/150x150?text=Telha',
        isMain: true
      }
    ],
    description: 'Telha cerâmica tipo portuguesa, resistente e durável para coberturas residenciais.',
    isPromotion: true,
  },
  {
    id: '7',
    name: 'Vergalhão CA-50 10mm (Barra 12m)',
    price: 49.90,
    images: [
      {
        id: '7-1',
        productId: '7',
        highResolution: 'https://via.placeholder.com/300x300?text=Vergalhao',
        standard: 'https://via.placeholder.com/300x300?text=Vergalhao',
        thumbnail: 'https://via.placeholder.com/150x150?text=Vergalhao',
        isMain: true
      }
    ],
    description: 'Vergalhão de aço CA-50 para uso em estruturas de concreto armado.',
    isPromotion: false,
  },
  {
    id: '8',
    name: 'Tubo PVC 100mm para Esgoto (Barra 6m)',
    price: 79.90,
    promoPrice: 69.90,
    images: [
      {
        id: '8-1',
        productId: '8',
        highResolution: 'https://via.placeholder.com/300x300?text=Tubo+PVC',
        standard: 'https://via.placeholder.com/300x300?text=Tubo+PVC',
        thumbnail: 'https://via.placeholder.com/150x150?text=Tubo+PVC',
        isMain: true
      }
    ],
    description: 'Tubo de PVC para sistemas de esgoto residenciais e comerciais.',
    isPromotion: true,
  },
  {
    id: '9',
    name: 'Massa Corrida PVA 18L',
    price: 69.90,
    images: [
      {
        id: '9-1',
        productId: '9',
        highResolution: 'https://via.placeholder.com/300x300?text=Massa+Corrida',
        standard: 'https://via.placeholder.com/300x300?text=Massa+Corrida',
        thumbnail: 'https://via.placeholder.com/150x150?text=Massa+Corrida',
        isMain: true
      }
    ],
    description: 'Massa corrida PVA para nivelamento e acabamento de paredes internas.',
    isPromotion: false,
  },
  {
    id: '10',
    name: 'Tinta Acrílica Suvinil 18L',
    price: 249.90,
    promoPrice: 219.90,
    installments: 12,
    images: [
      {
        id: '10-1',
        productId: '10',
        highResolution: 'https://via.placeholder.com/300x300?text=Tinta',
        standard: 'https://via.placeholder.com/300x300?text=Tinta',
        thumbnail: 'https://via.placeholder.com/150x150?text=Tinta',
        isMain: true
      }
    ],
    description: 'Tinta acrílica premium para paredes internas e externas.',
    isPromotion: true,
  },
];

// Sample color collections data
export const colorCollections: ColorCollection[] = [
  {
    id: '1',
    name: 'Amarelos',
    representativeColor: '#FFD700',
    description: 'Coleção de cores amarelas para iluminar seus ambientes.',
  },
  {
    id: '2',
    name: 'Azuis',
    representativeColor: '#1E90FF',
    description: 'Coleção de cores azuis para trazer tranquilidade e serenidade.',
  },
  {
    id: '3',
    name: 'Verdes',
    representativeColor: '#2E8B57',
    description: 'Coleção de cores verdes para conectar seu ambiente com a natureza.',
  },
  {
    id: '4',
    name: 'Vermelhos',
    representativeColor: '#DC143C',
    description: 'Coleção de cores vermelhas para ambientes vibrantes e cheios de energia.',
  },
  {
    id: '5',
    name: 'Neutros',
    representativeColor: '#D3D3D3',
    description: 'Coleção de cores neutras para ambientes elegantes e atemporais.',
  },
];

// Sample colors data
export const colors: Color[] = [
  // Amarelos
  {
    id: '1',
    name: 'Amarelo Sol',
    collectionId: '1',
    hexCode: '#FFD700',
  },
  {
    id: '2',
    name: 'Amarelo Canário',
    collectionId: '1',
    hexCode: '#FFFF00',
  },
  {
    id: '3',
    name: 'Amarelo Mostarda',
    collectionId: '1',
    hexCode: '#FFDB58',
  },
  
  // Azuis
  {
    id: '4',
    name: 'Azul Céu',
    collectionId: '2',
    hexCode: '#87CEEB',
  },
  {
    id: '5',
    name: 'Azul Marinho',
    collectionId: '2',
    hexCode: '#000080',
  },
  {
    id: '6',
    name: 'Azul Royal',
    collectionId: '2',
    hexCode: '#4169E1',
  },
  
  // Verdes
  {
    id: '7',
    name: 'Verde Esmeralda',
    collectionId: '3',
    hexCode: '#2E8B57',
  },
  {
    id: '8',
    name: 'Verde Limão',
    collectionId: '3',
    hexCode: '#32CD32',
  },
  {
    id: '9',
    name: 'Verde Oliva',
    collectionId: '3',
    hexCode: '#556B2F',
  },
  
  // Vermelhos
  {
    id: '10',
    name: 'Vermelho Cereja',
    collectionId: '4',
    hexCode: '#DC143C',
  },
  {
    id: '11',
    name: 'Vermelho Tomate',
    collectionId: '4',
    hexCode: '#FF6347',
  },
  {
    id: '12',
    name: 'Vermelho Borgonha',
    collectionId: '4',
    hexCode: '#800020',
  },
  
  // Neutros
  {
    id: '13',
    name: 'Branco Neve',
    collectionId: '5',
    hexCode: '#FFFAFA',
  },
  {
    id: '14',
    name: 'Cinza Claro',
    collectionId: '5',
    hexCode: '#D3D3D3',
  },
  {
    id: '15',
    name: 'Bege',
    collectionId: '5',
    hexCode: '#F5F5DC',
  },
];

// Sample stores data
export const stores: Store[] = [
  {
    id: '1',
    name: 'Turatti Centro',
    city: 'Cuiabá',
    phone: '(65) 3027-5865',
    hours: 'Segunda a Sexta: 8h às 18h, Sábado: 8h às 13h',
    isActive: true,
  },
  {
    id: '2',
    name: 'Turatti CPA',
    city: 'Cuiabá',
    phone: '(65) 3028-4335',
    hours: 'Segunda a Sexta: 8h às 18h, Sábado: 8h às 13h',
    isActive: true,
  },
];
