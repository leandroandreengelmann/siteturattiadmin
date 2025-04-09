'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Product } from '@/data/types';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);
  
  // Verificar se há imagem secundária disponível
  const hasSecondaryImage = product.images && product.images.length > 1;
  
  // Imagem principal e secundária (se disponível)
  const primaryImage = product.images && product.images.length > 0
    ? product.images[0].standard
    : '/placeholder-product.jpg';
    
  const secondaryImage = hasSecondaryImage 
    ? product.images[1].standard 
    : primaryImage;
  
  // Formatar preço para exibição
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };
  
  // Calcular desconto percentual (se aplicável)
  const discountPercentage = product.isPromotion && product.promoPrice 
    ? Math.round(100 - (product.promoPrice * 100 / product.price))
    : 0;
  
  // Navegar para a página do produto
  const handleClick = () => {
    router.push(`/products/${product.id}`);
  };
  
  return (
    <div 
      className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div 
        className="aspect-square overflow-hidden relative cursor-pointer"
        onClick={handleClick}
      >
        {product.isPromotion && discountPercentage > 0 && (
          <div className="absolute top-2 left-2 z-10 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-md">
            -{discountPercentage}%
          </div>
        )}
        
        <Image
          src={isHovered && hasSecondaryImage ? secondaryImage : primaryImage}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover object-center transition-all duration-300 group-hover:scale-105"
        />
        
        {/* Botão Ver produto no hover */}
        <div className={`absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 transition-opacity duration-300 ${isHovered ? 'opacity-100' : ''}`}>
          <button 
            onClick={handleClick}
            className="bg-white text-gray-900 font-medium px-4 py-2 rounded-md hover:bg-blue-600 hover:text-white transition-colors duration-200"
          >
            Ver produto
          </button>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-sm text-gray-700 font-medium truncate hover:text-blue-600 cursor-pointer mb-1" onClick={handleClick}>
          {product.name}
        </h3>
        
        <div className="mt-2 flex flex-col">
          {product.isPromotion && product.promoPrice ? (
            <>
              <div className="flex flex-col">
                <span className="text-xs text-gray-500 line-through">
                  De: {formatPrice(product.price)}
                </span>
                <div className="flex items-center space-x-2">
                  <span className="text-base font-bold text-blue-600">
                    Por: {formatPrice(product.promoPrice)}
                  </span>
                  <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-sm">
                    {discountPercentage}% OFF
                  </span>
                </div>
              </div>
              {product.installments && (
                <span className="text-xs text-gray-600 mt-1">
                  Em até {product.installments}x sem juros
                </span>
              )}
            </>
          ) : (
            <>
              <span className="text-base font-semibold text-gray-800">
                {formatPrice(product.price)}
              </span>
              {product.installments && (
                <span className="text-xs text-gray-600 mt-1">
                  Em até {product.installments}x sem juros
                </span>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
