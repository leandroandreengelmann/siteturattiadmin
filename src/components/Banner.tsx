'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Banner as BannerType } from '@/data/types';
import { bannerService } from '@/services/supabaseService';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface BannerProps {
  banner?: BannerType;
}

export default function Banner({ banner }: BannerProps) {
  // Estado para banners
  const [banners, setBanners] = useState<BannerType[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [isChanging, setIsChanging] = useState(false);
  
  // Carregar banners do banco de dados se não for passado por prop
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        // Se um banner específico foi passado, use-o
        if (banner) {
          setBanners([banner]);
          setLoading(false);
          return;
        }
        
        // Caso contrário, busque banners ativos do banco de dados
        const activeBanners = await bannerService.getActive();
        
        if (activeBanners && activeBanners.length > 0) {
          setBanners(activeBanners);
        } else {
          // Fallback para um banner padrão se não houver nenhum no banco
          setBanners([{
            id: 'default-banner',
            title: 'Materiais de Qualidade para sua Construção',
            subtitle: 'Encontre tudo o que você precisa para sua obra ou reforma na Turatti',
            buttonText: 'Ver Produtos',
            buttonLink: '/products',
            imageUrl: 'https://images.unsplash.com/photo-1520209759809-a9bcb6cb3241?q=80&w=1000',
            isActive: true,
            order: 0
          }]);
        }
      } catch (error) {
        console.error('Erro ao buscar banners:', error);
        // Definir um banner padrão em caso de erro
        setBanners([{
          id: 'default-banner',
          title: 'Materiais de Qualidade para sua Construção',
          subtitle: 'Encontre tudo o que você precisa para sua obra ou reforma na Turatti',
          buttonText: 'Ver Produtos',
          buttonLink: '/products',
          imageUrl: 'https://images.unsplash.com/photo-1520209759809-a9bcb6cb3241?q=80&w=1000',
          isActive: true,
          order: 0
        }]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBanners();
  }, [banner]);
  
  // Alternar para o próximo banner automaticamente a cada 5 segundos
  useEffect(() => {
    if (banners.length <= 1) return;
    
    const interval = setInterval(() => {
      changeBanner((prevIndex) => (prevIndex + 1) % banners.length);
    }, 7000); // Aumentado para 7 segundos para melhor visualização
    
    return () => clearInterval(interval);
  }, [banners.length]);
  
  // Função para mudar o banner com animação de transição
  const changeBanner = useCallback((getNextIndex: (current: number) => number) => {
    setIsChanging(true);
    
    // Aguarda a animação de fade out
    setTimeout(() => {
      setCurrentIndex(getNextIndex);
      // Aguarda um pouco antes de iniciar o fade in
      setTimeout(() => {
        setIsChanging(false);
      }, 50);
    }, 300);
  }, []);
  
  // Funções para navegação manual
  const goToPrevBanner = useCallback(() => {
    changeBanner((prevIndex) => prevIndex === 0 ? banners.length - 1 : prevIndex - 1);
  }, [banners.length, changeBanner]);
  
  const goToNextBanner = useCallback(() => {
    changeBanner((prevIndex) => (prevIndex + 1) % banners.length);
  }, [banners.length, changeBanner]);
  
  const handleImageError = () => {
    setImageError(true);
  };

  // Conteúdo padrão quando não há banner
  const renderDefaultContent = () => (
    <div className="absolute inset-0 bg-gradient-to-r from-blue-800 to-blue-600 z-0"></div>
  );

  // Conteúdo quando estamos carregando
  if (loading) {
    return (
      <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-800 to-blue-600 animate-pulse z-0"></div>
      </div>
    );
  }
  
  // Não há banners disponíveis
  if (banners.length === 0) {
    return (
      <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] overflow-hidden">
        {renderDefaultContent()}
      </div>
    );
  }

  const currentBanner = banners[currentIndex];

  return (
    <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] overflow-hidden">
      {/* Banner Image */}
      {currentBanner && currentBanner.imageUrl && !imageError ? (
        <>
          <Image
            src={currentBanner.imageUrl}
            alt={currentBanner.title || "Banner promocional"}
            fill
            priority
            className={`object-cover z-0 transition-opacity duration-700 ${isChanging ? 'opacity-0' : 'opacity-100'}`}
            onError={handleImageError}
          />
          
          {/* Navigation arrows (apenas se houver mais de um banner) */}
          {banners.length > 1 && (
            <>
              <button 
                onClick={goToPrevBanner}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-30 hover:bg-opacity-50 text-white p-2 rounded-full transition-all duration-300 hover:scale-110"
                aria-label="Banner anterior"
              >
                <ArrowLeft size={24} />
              </button>
              <button 
                onClick={goToNextBanner}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-30 hover:bg-opacity-50 text-white p-2 rounded-full transition-all duration-300 hover:scale-110"
                aria-label="Próximo banner"
              >
                <ArrowRight size={24} />
              </button>
              
              {/* Indicators */}
              <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
                {banners.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => changeBanner(() => index)}
                    className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                      index === currentIndex 
                        ? 'bg-white scale-110 w-5' 
                        : 'bg-white bg-opacity-50 hover:bg-opacity-75 hover:scale-105'
                    }`}
                    aria-label={`Ir para banner ${index + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </>
      ) : (
        renderDefaultContent()
      )}
    </div>
  );
}
