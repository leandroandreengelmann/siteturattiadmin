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
        highResolution: 'https://images.unsplash.com/photo-1622467827417-bbe2237067a9?q=80&w=1000&auto=format&fit=crop',
        standard: 'https://images.unsplash.com/photo-1622467827417-bbe2237067a9?q=80&w=600&auto=format&fit=crop',
        thumbnail: 'https://images.unsplash.com/photo-1622467827417-bbe2237067a9?q=80&w=150&auto=format&fit=crop',
        isMain: true
      },
      {
        id: '1-2',
        productId: '1',
        highResolution: 'https://images.unsplash.com/photo-1560749003-f4b1e17e2dff?q=80&w=1000&auto=format&fit=crop',
        standard: 'https://images.unsplash.com/photo-1560749003-f4b1e17e2dff?q=80&w=600&auto=format&fit=crop',
        thumbnail: 'https://images.unsplash.com/photo-1560749003-f4b1e17e2dff?q=80&w=150&auto=format&fit=crop',
        isMain: false
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
        highResolution: 'https://images.unsplash.com/photo-1520618821580-55aca722145a?q=80&w=1000&auto=format&fit=crop',
        standard: 'https://images.unsplash.com/photo-1520618821580-55aca722145a?q=80&w=600&auto=format&fit=crop',
        thumbnail: 'https://images.unsplash.com/photo-1520618821580-55aca722145a?q=80&w=150&auto=format&fit=crop',
        isMain: true
      },
      {
        id: '2-2',
        productId: '2',
        highResolution: 'https://images.unsplash.com/photo-1662972283662-ad209ff4b8ce?q=80&w=1000&auto=format&fit=crop',
        standard: 'https://images.unsplash.com/photo-1662972283662-ad209ff4b8ce?q=80&w=600&auto=format&fit=crop',
        thumbnail: 'https://images.unsplash.com/photo-1662972283662-ad209ff4b8ce?q=80&w=150&auto=format&fit=crop',
        isMain: false
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
        highResolution: 'https://images.unsplash.com/photo-1605152276897-4f618f831968?q=80&w=1000&auto=format&fit=crop',
        standard: 'https://images.unsplash.com/photo-1605152276897-4f618f831968?q=80&w=600&auto=format&fit=crop',
        thumbnail: 'https://images.unsplash.com/photo-1605152276897-4f618f831968?q=80&w=150&auto=format&fit=crop',
        isMain: true
      },
      {
        id: '3-2',
        productId: '3',
        highResolution: 'https://images.unsplash.com/photo-1621972660772-6a0527d0c8ef?q=80&w=1000&auto=format&fit=crop',
        standard: 'https://images.unsplash.com/photo-1621972660772-6a0527d0c8ef?q=80&w=600&auto=format&fit=crop',
        thumbnail: 'https://images.unsplash.com/photo-1621972660772-6a0527d0c8ef?q=80&w=150&auto=format&fit=crop',
        isMain: false
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
        highResolution: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=1000&auto=format&fit=crop',
        standard: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=600&auto=format&fit=crop',
        thumbnail: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=150&auto=format&fit=crop',
        isMain: true
      },
      {
        id: '4-2',
        productId: '4',
        highResolution: 'https://images.unsplash.com/photo-1568620930916-a6085cb5f348?q=80&w=1000&auto=format&fit=crop',
        standard: 'https://images.unsplash.com/photo-1568620930916-a6085cb5f348?q=80&w=600&auto=format&fit=crop',
        thumbnail: 'https://images.unsplash.com/photo-1568620930916-a6085cb5f348?q=80&w=150&auto=format&fit=crop',
        isMain: false
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
        highResolution: 'https://images.unsplash.com/photo-1583163433310-d5637c486d5b?q=80&w=1000&auto=format&fit=crop',
        standard: 'https://images.unsplash.com/photo-1583163433310-d5637c486d5b?q=80&w=600&auto=format&fit=crop',
        thumbnail: 'https://images.unsplash.com/photo-1583163433310-d5637c486d5b?q=80&w=150&auto=format&fit=crop',
        isMain: true
      },
      {
        id: '5-2',
        productId: '5',
        highResolution: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=1000&auto=format&fit=crop',
        standard: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=600&auto=format&fit=crop',
        thumbnail: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=150&auto=format&fit=crop',
        isMain: false
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
        highResolution: 'https://images.unsplash.com/photo-1516156008625-3a9d6067fab5?q=80&w=1000&auto=format&fit=crop',
        standard: 'https://images.unsplash.com/photo-1516156008625-3a9d6067fab5?q=80&w=600&auto=format&fit=crop',
        thumbnail: 'https://images.unsplash.com/photo-1516156008625-3a9d6067fab5?q=80&w=150&auto=format&fit=crop',
        isMain: true
      },
      {
        id: '6-2',
        productId: '6',
        highResolution: 'https://images.unsplash.com/photo-1505409628601-edc9af17fda6?q=80&w=1000&auto=format&fit=crop',
        standard: 'https://images.unsplash.com/photo-1505409628601-edc9af17fda6?q=80&w=600&auto=format&fit=crop',
        thumbnail: 'https://images.unsplash.com/photo-1505409628601-edc9af17fda6?q=80&w=150&auto=format&fit=crop',
        isMain: false
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
        highResolution: 'https://images.unsplash.com/photo-1587582345426-bf07d322d2d2?q=80&w=1000&auto=format&fit=crop',
        standard: 'https://images.unsplash.com/photo-1587582345426-bf07d322d2d2?q=80&w=600&auto=format&fit=crop',
        thumbnail: 'https://images.unsplash.com/photo-1587582345426-bf07d322d2d2?q=80&w=150&auto=format&fit=crop',
        isMain: true
      },
      {
        id: '7-2',
        productId: '7',
        highResolution: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=1000&auto=format&fit=crop',
        standard: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=600&auto=format&fit=crop',
        thumbnail: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=150&auto=format&fit=crop',
        isMain: false
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
        highResolution: 'https://images.unsplash.com/photo-1560419255-6b4be12d405d?q=80&w=1000&auto=format&fit=crop',
        standard: 'https://images.unsplash.com/photo-1560419255-6b4be12d405d?q=80&w=600&auto=format&fit=crop',
        thumbnail: 'https://images.unsplash.com/photo-1560419255-6b4be12d405d?q=80&w=150&auto=format&fit=crop',
        isMain: true
      },
      {
        id: '8-2',
        productId: '8',
        highResolution: 'https://images.unsplash.com/photo-1617713964059-fa8ec4e1ed7a?q=80&w=1000&auto=format&fit=crop',
        standard: 'https://images.unsplash.com/photo-1617713964059-fa8ec4e1ed7a?q=80&w=600&auto=format&fit=crop',
        thumbnail: 'https://images.unsplash.com/photo-1617713964059-fa8ec4e1ed7a?q=80&w=150&auto=format&fit=crop',
        isMain: false
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
        highResolution: 'https://images.unsplash.com/photo-1590075865003-e28dcc66484f?q=80&w=1000&auto=format&fit=crop',
        standard: 'https://images.unsplash.com/photo-1590075865003-e28dcc66484f?q=80&w=600&auto=format&fit=crop',
        thumbnail: 'https://images.unsplash.com/photo-1590075865003-e28dcc66484f?q=80&w=150&auto=format&fit=crop',
        isMain: true
      },
      {
        id: '9-2',
        productId: '9',
        highResolution: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=1000&auto=format&fit=crop',
        standard: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=600&auto=format&fit=crop',
        thumbnail: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=150&auto=format&fit=crop',
        isMain: false
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
        highResolution: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=1000&auto=format&fit=crop',
        standard: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=600&auto=format&fit=crop',
        thumbnail: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=150&auto=format&fit=crop',
        isMain: true
      },
      {
        id: '10-2',
        productId: '10',
        highResolution: 'https://images.unsplash.com/photo-1626837540639-89e56f29001d?q=80&w=1000&auto=format&fit=crop',
        standard: 'https://images.unsplash.com/photo-1626837540639-89e56f29001d?q=80&w=600&auto=format&fit=crop',
        thumbnail: 'https://images.unsplash.com/photo-1626837540639-89e56f29001d?q=80&w=150&auto=format&fit=crop',
        isMain: false
      }
    ],
    description: 'Tinta acrílica premium para paredes internas e externas.',
    isPromotion: true,
  },
  // Novos produtos em promoção
  {
    id: '11',
    name: 'Serra Circular Elétrica 1800W',
    price: 399.90,
    promoPrice: 349.90,
    installments: 10,
    images: [
      {
        id: '11-1',
        productId: '11',
        highResolution: 'https://images.unsplash.com/photo-1586864387789-628af9feed72?q=80&w=1000&auto=format&fit=crop',
        standard: 'https://images.unsplash.com/photo-1586864387789-628af9feed72?q=80&w=600&auto=format&fit=crop',
        thumbnail: 'https://images.unsplash.com/photo-1586864387789-628af9feed72?q=80&w=150&auto=format&fit=crop',
        isMain: true
      },
      {
        id: '11-2',
        productId: '11',
        highResolution: 'https://images.unsplash.com/photo-1572981739426-e70c3da4be4d?q=80&w=1000&auto=format&fit=crop',
        standard: 'https://images.unsplash.com/photo-1572981739426-e70c3da4be4d?q=80&w=600&auto=format&fit=crop',
        thumbnail: 'https://images.unsplash.com/photo-1572981739426-e70c3da4be4d?q=80&w=150&auto=format&fit=crop',
        isMain: false
      }
    ],
    description: 'Serra circular elétrica potente para cortes precisos em madeiras e derivados.',
    isPromotion: true,
  },
  {
    id: '12',
    name: 'Kit Ferramentas Manuais 150 Peças',
    price: 299.90,
    promoPrice: 249.90,
    installments: 8,
    images: [
      {
        id: '12-1',
        productId: '12',
        highResolution: 'https://images.unsplash.com/photo-1581166397057-235af2b3c6dd?q=80&w=1000&auto=format&fit=crop',
        standard: 'https://images.unsplash.com/photo-1581166397057-235af2b3c6dd?q=80&w=600&auto=format&fit=crop',
        thumbnail: 'https://images.unsplash.com/photo-1581166397057-235af2b3c6dd?q=80&w=150&auto=format&fit=crop',
        isMain: true
      },
      {
        id: '12-2',
        productId: '12',
        highResolution: 'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?q=80&w=1000&auto=format&fit=crop',
        standard: 'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?q=80&w=600&auto=format&fit=crop',
        thumbnail: 'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?q=80&w=150&auto=format&fit=crop',
        isMain: false
      }
    ],
    description: 'Kit completo com 150 ferramentas para diversos tipos de trabalhos e reparos domésticos.',
    isPromotion: true,
  },
  {
    id: '13',
    name: 'Impermeabilizante para Lajes 18kg',
    price: 189.90,
    promoPrice: 159.90,
    images: [
      {
        id: '13-1',
        productId: '13',
        highResolution: 'https://images.unsplash.com/photo-1582539971836-e3bd448fc8e0?q=80&w=1000&auto=format&fit=crop',
        standard: 'https://images.unsplash.com/photo-1582539971836-e3bd448fc8e0?q=80&w=600&auto=format&fit=crop',
        thumbnail: 'https://images.unsplash.com/photo-1582539971836-e3bd448fc8e0?q=80&w=150&auto=format&fit=crop',
        isMain: true
      },
      {
        id: '13-2',
        productId: '13',
        highResolution: 'https://images.unsplash.com/photo-1518640467707-6811f4a6ab73?q=80&w=1000&auto=format&fit=crop',
        standard: 'https://images.unsplash.com/photo-1518640467707-6811f4a6ab73?q=80&w=600&auto=format&fit=crop',
        thumbnail: 'https://images.unsplash.com/photo-1518640467707-6811f4a6ab73?q=80&w=150&auto=format&fit=crop',
        isMain: false
      }
    ],
    description: 'Impermeabilizante de alta qualidade para lajes, terraços e áreas expostas à umidade.',
    isPromotion: true,
  },
  {
    id: '14',
    name: 'Painel LED Sobrepor 24W',
    price: 79.90,
    promoPrice: 64.90,
    images: [
      {
        id: '14-1',
        productId: '14',
        highResolution: 'https://images.unsplash.com/photo-1592890288564-76628a30a657?q=80&w=1000&auto=format&fit=crop',
        standard: 'https://images.unsplash.com/photo-1592890288564-76628a30a657?q=80&w=600&auto=format&fit=crop',
        thumbnail: 'https://images.unsplash.com/photo-1592890288564-76628a30a657?q=80&w=150&auto=format&fit=crop',
        isMain: true
      },
      {
        id: '14-2',
        productId: '14',
        highResolution: 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?q=80&w=1000&auto=format&fit=crop',
        standard: 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?q=80&w=600&auto=format&fit=crop',
        thumbnail: 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?q=80&w=150&auto=format&fit=crop',
        isMain: false
      }
    ],
    description: 'Painel LED de sobrepor com luz branca neutra, ideal para iluminação de ambientes internos.',
    isPromotion: true,
  },
  {
    id: '15',
    name: 'Furadeira de Impacto 850W',
    price: 249.90,
    promoPrice: 199.90,
    installments: 6,
    images: [
      {
        id: '15-1',
        productId: '15',
        highResolution: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?q=80&w=1000&auto=format&fit=crop',
        standard: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?q=80&w=600&auto=format&fit=crop',
        thumbnail: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?q=80&w=150&auto=format&fit=crop',
        isMain: true
      },
      {
        id: '15-2',
        productId: '15',
        highResolution: 'https://images.unsplash.com/photo-1599707254554-027aeb4deacd?q=80&w=1000&auto=format&fit=crop',
        standard: 'https://images.unsplash.com/photo-1599707254554-027aeb4deacd?q=80&w=600&auto=format&fit=crop',
        thumbnail: 'https://images.unsplash.com/photo-1599707254554-027aeb4deacd?q=80&w=150&auto=format&fit=crop',
        isMain: false
      }
    ],
    description: 'Furadeira de impacto potente para perfurações em concreto, madeira e metal.',
    isPromotion: true,
  },
  // Novos produtos em destaque (não promoção)
  {
    id: '16',
    name: 'Piso Cerâmico 60x60cm (Caixa com 2,5m²)',
    price: 89.90,
    promoPrice: 79.90,
    images: [
      {
        id: '16-1',
        productId: '16',
        highResolution: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?q=80&w=1000&auto=format&fit=crop',
        standard: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?q=80&w=600&auto=format&fit=crop',
        thumbnail: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?q=80&w=150&auto=format&fit=crop',
        isMain: true
      },
      {
        id: '16-2',
        productId: '16',
        highResolution: 'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?q=80&w=1000&auto=format&fit=crop',
        standard: 'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?q=80&w=600&auto=format&fit=crop',
        thumbnail: 'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?q=80&w=150&auto=format&fit=crop',
        isMain: false
      }
    ],
    description: 'Piso cerâmico acetinado de alta qualidade para ambientes internos e externos.',
    isPromotion: true,
  },
  {
    id: '17',
    name: 'Escada Extensível Alumínio 2x8 Degraus',
    price: 399.90,
    installments: 10,
    images: [
      {
        id: '17-1',
        productId: '17',
        highResolution: 'https://images.unsplash.com/photo-1541123437800-1bb1317badc2?q=80&w=1000&auto=format&fit=crop',
        standard: 'https://images.unsplash.com/photo-1541123437800-1bb1317badc2?q=80&w=600&auto=format&fit=crop',
        thumbnail: 'https://images.unsplash.com/photo-1541123437800-1bb1317badc2?q=80&w=150&auto=format&fit=crop',
        isMain: true
      },
      {
        id: '17-2',
        productId: '17',
        highResolution: 'https://images.unsplash.com/photo-1569154888810-955f3f76521a?q=80&w=1000&auto=format&fit=crop',
        standard: 'https://images.unsplash.com/photo-1569154888810-955f3f76521a?q=80&w=600&auto=format&fit=crop',
        thumbnail: 'https://images.unsplash.com/photo-1569154888810-955f3f76521a?q=80&w=150&auto=format&fit=crop',
        isMain: false
      }
    ],
    description: 'Escada extensível em alumínio, leve e resistente, ideal para trabalhos em altura.',
    isPromotion: false,
  },
  {
    id: '18',
    name: 'Porcelanato Polido 80x80cm (Caixa com 2,0m²)',
    price: 149.90,
    installments: 5,
    images: [
      {
        id: '18-1',
        productId: '18',
        highResolution: 'https://images.unsplash.com/photo-1516455590571-18256e5bb9ff?q=80&w=1000&auto=format&fit=crop',
        standard: 'https://images.unsplash.com/photo-1516455590571-18256e5bb9ff?q=80&w=600&auto=format&fit=crop',
        thumbnail: 'https://images.unsplash.com/photo-1516455590571-18256e5bb9ff?q=80&w=150&auto=format&fit=crop',
        isMain: true
      },
      {
        id: '18-2',
        productId: '18',
        highResolution: 'https://images.unsplash.com/photo-1615529151169-7b1ff50dc7f2?q=80&w=1000&auto=format&fit=crop',
        standard: 'https://images.unsplash.com/photo-1615529151169-7b1ff50dc7f2?q=80&w=600&auto=format&fit=crop',
        thumbnail: 'https://images.unsplash.com/photo-1615529151169-7b1ff50dc7f2?q=80&w=150&auto=format&fit=crop',
        isMain: false
      }
    ],
    description: 'Porcelanato polido de alta durabilidade e brilho intenso para ambientes sofisticados.',
    isPromotion: false,
  },
  {
    id: '19',
    name: 'Torneira para Cozinha com Bica Móvel',
    price: 129.90,
    images: [
      {
        id: '19-1',
        productId: '19',
        highResolution: 'https://images.unsplash.com/photo-1585909695284-32d2985ac9c0?q=80&w=1000&auto=format&fit=crop',
        standard: 'https://images.unsplash.com/photo-1585909695284-32d2985ac9c0?q=80&w=600&auto=format&fit=crop',
        thumbnail: 'https://images.unsplash.com/photo-1585909695284-32d2985ac9c0?q=80&w=150&auto=format&fit=crop',
        isMain: true
      },
      {
        id: '19-2',
        productId: '19',
        highResolution: 'https://images.unsplash.com/photo-1584461772442-bc3f850c2e64?q=80&w=1000&auto=format&fit=crop',
        standard: 'https://images.unsplash.com/photo-1584461772442-bc3f850c2e64?q=80&w=600&auto=format&fit=crop',
        thumbnail: 'https://images.unsplash.com/photo-1584461772442-bc3f850c2e64?q=80&w=150&auto=format&fit=crop',
        isMain: false
      }
    ],
    description: 'Torneira para cozinha com bica móvel, acabamento cromado e design moderno.',
    isPromotion: false,
  },
  {
    id: '20',
    name: 'Lâmpada LED Bulbo 9W',
    price: 9.90,
    images: [
      {
        id: '20-1',
        productId: '20',
        highResolution: 'https://images.unsplash.com/photo-1553288569-8d3c4223a264?q=80&w=1000&auto=format&fit=crop',
        standard: 'https://images.unsplash.com/photo-1553288569-8d3c4223a264?q=80&w=600&auto=format&fit=crop',
        thumbnail: 'https://images.unsplash.com/photo-1553288569-8d3c4223a264?q=80&w=150&auto=format&fit=crop',
        isMain: true
      },
      {
        id: '20-2',
        productId: '20',
        highResolution: 'https://images.unsplash.com/photo-1550319943-daaf26d56ad5?q=80&w=1000&auto=format&fit=crop',
        standard: 'https://images.unsplash.com/photo-1550319943-daaf26d56ad5?q=80&w=600&auto=format&fit=crop',
        thumbnail: 'https://images.unsplash.com/photo-1550319943-daaf26d56ad5?q=80&w=150&auto=format&fit=crop',
        isMain: false
      }
    ],
    description: 'Lâmpada LED bulbo econômica com luz branca fria para iluminação residencial e comercial.',
    isPromotion: false,
  },
  {
    id: '21',
    name: 'Lavadora de Alta Pressão 1800W',
    price: 549.90,
    installments: 12,
    images: [
      {
        id: '21-1',
        productId: '21',
        highResolution: 'https://images.unsplash.com/photo-1563456161-e6e6e88e2772?q=80&w=1000&auto=format&fit=crop',
        standard: 'https://images.unsplash.com/photo-1563456161-e6e6e88e2772?q=80&w=600&auto=format&fit=crop',
        thumbnail: 'https://images.unsplash.com/photo-1563456161-e6e6e88e2772?q=80&w=150&auto=format&fit=crop',
        isMain: true
      },
      {
        id: '21-2',
        productId: '21',
        highResolution: 'https://images.unsplash.com/photo-1542556398-95fb5b9f787d?q=80&w=1000&auto=format&fit=crop',
        standard: 'https://images.unsplash.com/photo-1542556398-95fb5b9f787d?q=80&w=600&auto=format&fit=crop',
        thumbnail: 'https://images.unsplash.com/photo-1542556398-95fb5b9f787d?q=80&w=150&auto=format&fit=crop',
        isMain: false
      }
    ],
    description: 'Lavadora de alta pressão potente para limpeza rápida e eficiente de áreas externas.',
    isPromotion: false,
  },
  {
    id: '22',
    name: 'Conjunto de Chaves de Fenda 18 Peças',
    price: 89.90,
    images: [
      {
        id: '22-1',
        productId: '22',
        highResolution: 'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?q=80&w=1000&auto=format&fit=crop',
        standard: 'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?q=80&w=600&auto=format&fit=crop',
        thumbnail: 'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?q=80&w=150&auto=format&fit=crop',
        isMain: true
      },
      {
        id: '22-2',
        productId: '22',
        highResolution: 'https://images.unsplash.com/photo-1426927308491-6380b6a9936f?q=80&w=1000&auto=format&fit=crop',
        standard: 'https://images.unsplash.com/photo-1426927308491-6380b6a9936f?q=80&w=600&auto=format&fit=crop',
        thumbnail: 'https://images.unsplash.com/photo-1426927308491-6380b6a9936f?q=80&w=150&auto=format&fit=crop',
        isMain: false
      }
    ],
    description: 'Conjunto de chaves de fenda e phillips com diversas bitolas para manutenções em geral.',
    isPromotion: false,
  },
  {
    id: '23',
    name: 'Porta Sanfonada PVC 80x210cm',
    price: 119.90,
    images: [
      {
        id: '23-1',
        productId: '23',
        highResolution: 'https://images.unsplash.com/photo-1558442097-e19dae35c13b?q=80&w=1000&auto=format&fit=crop',
        standard: 'https://images.unsplash.com/photo-1558442097-e19dae35c13b?q=80&w=600&auto=format&fit=crop',
        thumbnail: 'https://images.unsplash.com/photo-1558442097-e19dae35c13b?q=80&w=150&auto=format&fit=crop',
        isMain: true
      },
      {
        id: '23-2',
        productId: '23',
        highResolution: 'https://images.unsplash.com/photo-1601055903647-ddf1ee9b0a33?q=80&w=1000&auto=format&fit=crop',
        standard: 'https://images.unsplash.com/photo-1601055903647-ddf1ee9b0a33?q=80&w=600&auto=format&fit=crop',
        thumbnail: 'https://images.unsplash.com/photo-1601055903647-ddf1ee9b0a33?q=80&w=150&auto=format&fit=crop',
        isMain: false
      }
    ],
    description: 'Porta sanfonada em PVC de fácil instalação, ideal para closets, lavanderia e despensa.',
    isPromotion: false,
  },
  {
    id: '24',
    name: 'Cuba de Pia em Inox 50x40cm',
    price: 179.90,
    images: [
      {
        id: '24-1',
        productId: '24',
        highResolution: 'https://images.unsplash.com/photo-1575111565627-96fa2dcc8d1e?q=80&w=1000&auto=format&fit=crop',
        standard: 'https://images.unsplash.com/photo-1575111565627-96fa2dcc8d1e?q=80&w=600&auto=format&fit=crop',
        thumbnail: 'https://images.unsplash.com/photo-1575111565627-96fa2dcc8d1e?q=80&w=150&auto=format&fit=crop',
        isMain: true
      },
      {
        id: '24-2',
        productId: '24',
        highResolution: 'https://images.unsplash.com/photo-1552243010-3e7d71a0c38a?q=80&w=1000&auto=format&fit=crop',
        standard: 'https://images.unsplash.com/photo-1552243010-3e7d71a0c38a?q=80&w=600&auto=format&fit=crop',
        thumbnail: 'https://images.unsplash.com/photo-1552243010-3e7d71a0c38a?q=80&w=150&auto=format&fit=crop',
        isMain: false
      }
    ],
    description: 'Cuba de pia em aço inox de alta qualidade para cozinhas residenciais e comerciais.',
    isPromotion: false,
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
