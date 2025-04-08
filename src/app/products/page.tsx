'use client';

import { useState, useEffect } from 'react';
import { Product } from '@/data/types';
import ProductCard from '@/components/ProductCard';

// Configurações para evitar cache na Vercel
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showPromotionsOnly, setShowPromotionsOnly] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Carregar produtos do Supabase
  useEffect(() => {
    async function loadProducts() {
      try {
        const { productService } = await import('@/services/supabaseService');
        
        // Evitar cache via useEffect com carga na montagem
        const productsData = await productService.getAll();
        
        setProducts(productsData);
      } catch (error) {
        console.error('Erro ao carregar produtos:', error);
      } finally {
        setLoading(false);
      }
    }
    
    loadProducts();
  }, []);
  
  // Filter products based on search term and promotions filter
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (showPromotionsOnly) {
      return matchesSearch && product.isPromotion;
    }
    
    return matchesSearch;
  });

  // Sorting products - promotions first, then by name
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    // First sort by promotion status (promotion items first)
    if (a.isPromotion && !b.isPromotion) return -1;
    if (!a.isPromotion && b.isPromotion) return 1;
    
    // Then sort by name alphabetically
    return a.name.localeCompare(b.name);
  });
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-700 to-blue-900 rounded-xl mb-8 p-8 shadow-lg">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Nossos Produtos
          </h1>
          <p className="text-blue-100 max-w-xl mb-6">
            Encontre os melhores materiais para sua construção ou reforma com qualidade e preço justo.
          </p>
          
          {/* Search and Filter - in hero section */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Buscar produtos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-0 rounded-lg bg-white/90 backdrop-blur-sm shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800"
              />
            </div>
            
            <div className="md:w-auto flex items-center">
              <label className="flex items-center cursor-pointer bg-white/20 text-white backdrop-blur-sm px-4 py-3 rounded-lg hover:bg-white/30 transition-colors duration-200">
                <input
                  type="checkbox"
                  checked={showPromotionsOnly}
                  onChange={() => setShowPromotionsOnly(!showPromotionsOnly)}
                  className="w-5 h-5 text-blue-600 border-white rounded focus:ring-blue-500 focus:ring-opacity-50"
                />
                <span className="ml-2 text-sm md:text-base">Mostrar apenas promoções</span>
              </label>
            </div>
          </div>
        </div>
        
        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-700"></div>
          </div>
        ) : (
          <>
            {/* Products Count */}
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-600">
                {sortedProducts.length} {sortedProducts.length === 1 ? 'produto encontrado' : 'produtos encontrados'}
              </p>
              
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="text-blue-700 hover:text-blue-900 flex items-center text-sm"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Limpar busca
                </button>
              )}
            </div>
            
            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
              {sortedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            
            {/* No Products Found */}
            {sortedProducts.length === 0 && (
              <div className="bg-white rounded-xl shadow-sm p-8 text-center my-8">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Nenhum produto encontrado</h3>
                <p className="text-gray-600 mb-6">Tente ajustar os critérios de busca ou filtros aplicados.</p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setShowPromotionsOnly(false);
                  }}
                  className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-2 rounded-lg transition duration-300 inline-flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Limpar filtros
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
