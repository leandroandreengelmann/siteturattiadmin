'use client';

import { useState, useEffect, useCallback } from 'react';
import { Product } from '@/data/types';
import ProductCard from './ProductCard';

interface ProductCarouselProps {
  products: Product[];
  title: string;
}

export default function ProductCarousel({ products, title }: ProductCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [touchStartX, setTouchStartX] = useState(0);

  // Update items per page based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setItemsPerPage(1);
      } else if (window.innerWidth < 768) {
        setItemsPerPage(2);
      } else if (window.innerWidth < 1024) {
        setItemsPerPage(3);
      } else if (window.innerWidth < 1280) {
        setItemsPerPage(4);
      } else {
        setItemsPerPage(5);
      }
    };

    // Set initial value
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Clean up
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const totalPages = Math.ceil(products.length / itemsPerPage);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? totalPages - 1 : prevIndex - 1
    );
  }, [totalPages]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prevIndex) => 
      prevIndex === totalPages - 1 ? 0 : prevIndex + 1
    );
  }, [totalPages]);

  // Mobile touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    
    // Swipe left (next)
    if (diff > 50) {
      handleNext();
    }
    // Swipe right (prev)
    else if (diff < -50) {
      handlePrev();
    }
  };

  // Set up keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePrev, handleNext]);

  const visibleProducts = products.slice(
    currentIndex * itemsPerPage,
    currentIndex * itemsPerPage + itemsPerPage
  );

  return (
    <div className="py-8 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <div className="w-1 h-8 bg-blue-600 mr-3"></div>
            <h2 className="text-2xl font-bold text-blue-600">
              {title}
            </h2>
          </div>
          
          <div className="flex space-x-2">
            <button 
              onClick={handlePrev}
              className="p-2 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-600 transition duration-300"
              aria-label="Anterior"
            >
              <svg 
                className="w-5 h-5" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M15 19l-7-7 7-7" 
                />
              </svg>
            </button>
            
            <button 
              onClick={handleNext}
              className="p-2 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-600 transition duration-300"
              aria-label="Próximo"
            >
              <svg 
                className="w-5 h-5" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M9 5l7 7-7 7" 
                />
              </svg>
            </button>
          </div>
        </div>
        
        <div 
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {visibleProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        
        {/* Pagination dots */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-6 space-x-2">
            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  currentIndex === index 
                    ? 'bg-blue-600' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Ir para página ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
