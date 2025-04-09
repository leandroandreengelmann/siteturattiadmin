'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { productService, colorCollectionService, colorService, storeService, bannerService, sellerService } from '@/services/localDataService';

// Define o tipo para estatísticas
type Stats = {
  products: number;
  collections: number;
  colors: number;
  stores: number;
  banners: number;
  sellers: number;
};

export default function AdminPage() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats>({
    products: 0,
    collections: 0,
    colors: 0,
    stores: 0,
    banners: 0,
    sellers: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        setLoading(true);
        
        // Carregar estatísticas básicas
        const products = await productService.getAll();
        const collections = await colorCollectionService.getAll();
        const colors = await colorService.getAll();
        const stores = await storeService.getAll();
        const banners = await bannerService.getAll();
        const sellers = await sellerService.getAll();
        
        setStats({
          products: products.length,
          collections: collections.length,
          colors: colors.length,
          stores: stores.length,
          banners: banners.length,
          sellers: sellers.length
        });
      } catch (error) {
        console.error('Erro ao carregar estatísticas:', error);
      } finally {
        setLoading(false);
      }
    }
    
    loadStats();
  }, []);

  // Cartas de menu para o dashboard
  const menuCards = [
    {
      title: 'Produtos',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      ),
      description: 'Gerencie todos os produtos da loja',
      count: stats.products,
      link: '/admin/products',
      color: 'from-blue-500 to-blue-700'
    },
    {
      title: 'Coleções',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      description: 'Administre coleções de cores',
      count: stats.collections,
      link: '/admin/collections',
      color: 'from-purple-500 to-purple-700'
    },
    {
      title: 'Cores',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
      ),
      description: 'Gerencie todas as cores disponíveis',
      count: stats.colors,
      link: '/admin/colors',
      color: 'from-indigo-500 to-indigo-700'
    },
    {
      title: 'Banners',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      description: 'Configure banners promocionais',
      count: stats.banners,
      link: '/admin/banners',
      color: 'from-pink-500 to-pink-700'
    },
    {
      title: 'Lojas',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      description: 'Gerencie dados das lojas físicas',
      count: stats.stores,
      link: '/admin/stores',
      color: 'from-green-500 to-green-700'
    },
    {
      title: 'Vendedores',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      description: 'Gerencie equipe de vendedores',
      count: stats.sellers,
      link: '/admin/sellers',
      color: 'from-amber-500 to-amber-700'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-10 text-center max-w-md mx-auto">
        <h1 className="text-2xl font-semibold text-gray-800 mb-2">Painel Administrativo</h1>
        <div className="h-1 w-20 bg-blue-600 mx-auto"></div>
      </div>
      
      {loading ? (
        <div className="flex justify-center py-16">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuCards.map((card, index) => (
            <Link href={card.link} key={index}>
              <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100">
                <div className="p-5">
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-full bg-gray-50">
                      {card.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-800">{card.title}</h3>
                      <p className="text-sm text-gray-500 mt-1">{card.count} itens</p>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
