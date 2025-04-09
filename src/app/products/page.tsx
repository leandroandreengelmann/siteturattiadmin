'use client';

import { useState, useEffect } from 'react';
import { Product } from '@/data/types';
import { productService } from '@/services/localDataService';
import ProductsGrid from '@/components/ProductsGrid';

export default function ProductsPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Verificar se devemos mostrar apenas promoções
  const promotionsOnly = searchParams?.promo === 'true';
  
  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        let fetchedProducts;
        
        if (promotionsOnly) {
          fetchedProducts = await productService.getPromotions();
        } else {
          fetchedProducts = await productService.getAll();
        }
        
        setProducts(fetchedProducts);
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }
    
    loadProducts();
  }, [promotionsOnly]);
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-700"></div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        {promotionsOnly ? 'Promoções' : 'Nossos Produtos'}
      </h1>
      
      <div className="mb-8">
        <p className="text-gray-600 mb-4">
          {promotionsOnly
            ? 'Confira nossos produtos em promoção com preços imperdíveis!'
            : 'Explore nossa ampla seleção de materiais para construção de alta qualidade.'}
        </p>
      </div>
      
      <ProductsGrid products={products} />
    </div>
  );
}
