'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';

interface ImageCarouselProps {
  images: string[];
  autoPlay?: boolean;
  interval?: number;
}

export default function ImageCarousel({ 
  images, 
  autoPlay = true, 
  interval = 5000 
}: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  // Usando useCallback para corrigir o problema de dependência
  const goToNext = useCallback(() => {
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    
    // Reset transition state after animation completes
    setTimeout(() => {
      setIsTransitioning(false);
    }, 500);
  }, [images.length]);
  
  const goToPrev = useCallback(() => {
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
    
    // Reset transition state after animation completes
    setTimeout(() => {
      setIsTransitioning(false);
    }, 500);
  }, [images.length]);
  
  // Auto play effect
  useEffect(() => {
    if (!autoPlay) return;
    
    const timer = setInterval(() => {
      goToNext();
    }, interval);
    
    return () => clearInterval(timer);
  }, [autoPlay, interval, goToNext]); // Agora incluímos goToNext nas dependências
  
  // Se não houver imagens, não renderize nada
  if (!images || images.length === 0) {
    return null;
  }
  
  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Controls */}
      <button
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/70 p-2 rounded-full"
        onClick={goToPrev}
        aria-label="Imagem anterior"
      >
        <svg 
          className="w-6 h-6" 
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
        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/70 p-2 rounded-full"
        onClick={goToNext}
        aria-label="Próxima imagem"
      >
        <svg 
          className="w-6 h-6" 
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
      
      {/* Images */}
      <div 
        className={`flex transition-transform duration-500 ease-in-out h-full w-full ${
          isTransitioning ? 'opacity-75' : 'opacity-100'
        }`}
        style={{ 
          transform: `translateX(-${currentIndex * 100}%)`,
          width: `${images.length * 100}%` 
        }}
      >
        {images.map((src, index) => (
          <div 
            key={index} 
            className="relative w-full h-full"
            style={{ width: `${100 / images.length}%` }}
          >
            {/* Usando Image em vez de img */}
            <div className="relative w-full h-full">
              <Image
                src={src}
                alt={`Slide ${index + 1}`}
                fill
                sizes="100vw"
                style={{ objectFit: 'cover' }}
                priority={index === 0}
              />
            </div>
          </div>
        ))}
      </div>
      
      {/* Indicators */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
          {images.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full ${
                index === currentIndex ? 'bg-white' : 'bg-white/50'
              }`}
              onClick={() => {
                setIsTransitioning(true);
                setCurrentIndex(index);
                setTimeout(() => setIsTransitioning(false), 500);
              }}
              aria-label={`Ir para slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
} 