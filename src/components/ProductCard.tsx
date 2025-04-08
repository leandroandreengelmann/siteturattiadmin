'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/data/types';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  const handleImageError = () => {
    setImageError(true);
  };

  // Obter a imagem principal ou a primeira imagem disponível
  const productImage = product.images && product.images.length > 0 
    ? product.images.find(img => img.isMain) || product.images[0] 
    : null;

  // Usar a versão thumbnail ou standard da imagem
  const imageUrl = productImage?.thumbnail || productImage?.standard || '';

  // Calcular o desconto percentual se for uma promoção
  const discountPercentage = product.isPromotion && product.promoPrice && product.price > 0
    ? Math.round(((product.price - product.promoPrice) / product.price) * 100)
    : 0;

  return (
    <div 
      className="bg-white rounded-xl shadow-sm overflow-hidden transition-all duration-300 hover:shadow-lg group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-square w-full overflow-hidden">
        {/* Exibir imagem do produto se disponível */}
        {imageUrl && imageUrl.startsWith('http') && !imageError ? (
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className={`object-contain transform duration-700 ease-out ${isHovered ? 'scale-110' : 'scale-100'}`}
            onError={handleImageError}
            loading="lazy"
            priority={false}
          />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        
        {/* Promotion badge - design moderno */}
        {product.isPromotion && discountPercentage > 0 && (
          <div className="absolute top-2 sm:top-3 right-2 sm:right-3 bg-blue-600 text-white font-medium px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-lg shadow-sm backdrop-blur-sm z-10">
            <span className="text-xs sm:text-sm font-bold">-{discountPercentage}%</span>
          </div>
        )}
      </div>
      
      <div className="p-3 sm:p-4">
        <h3 className="text-gray-800 text-sm sm:text-base font-medium mb-1.5 sm:mb-2 line-clamp-2 group-hover:text-blue-700 transition-colors duration-200">
          {product.name}
        </h3>
        
        <div className="mb-3 sm:mb-4 flex items-baseline gap-2">
          {/* Show promotional price if available */}
          {product.isPromotion && product.promoPrice ? (
            <>
              <span className="text-blue-600 text-base sm:text-lg font-bold">
                R$ {product.promoPrice.toFixed(2).replace('.', ',')}
              </span>
              <span className="line-through text-xs text-gray-500">
                R$ {product.price.toFixed(2).replace('.', ',')}
              </span>
            </>
          ) : (
            <span className="text-blue-600 text-base sm:text-lg font-bold">
              R$ {product.price.toFixed(2).replace('.', ',')}
            </span>
          )}
        </div>
        
        <Link 
          href={`/products/${product.id}`}
          className="relative block w-full py-2 sm:py-2.5 overflow-hidden group-hover:before:translate-x-0 before:-translate-x-full before:absolute before:top-0 before:left-0 before:bottom-0 before:right-0 before:bg-blue-800 before:transition-transform before:duration-500 before:ease-out rounded-lg"
        >
          <span className="relative z-10 flex items-center justify-center text-center text-xs sm:text-sm font-medium transition duration-300 group-hover:text-white text-blue-700">
            Ver detalhes
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 sm:h-4 sm:w-4 ml-1 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </span>
        </Link>
      </div>
    </div>
  );
}
