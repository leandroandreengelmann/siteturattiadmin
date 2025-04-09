'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Banner as BannerType } from '@/data/types';
import { bannerService } from '@/services/localDataService';

interface BannerProps {
  banner?: BannerType;
}

export default function Banner({ banner }: BannerProps) {
  const [currentBanner, setCurrentBanner] = useState<BannerType | null>(null);
  const [isLoading, setIsLoading] = useState(!banner);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Se o banner já foi fornecido via props, não precisamos buscá-lo
    if (banner) {
      setCurrentBanner(banner);
      setIsLoading(false);
      return;
    }

    // Caso contrário, buscar do serviço local
    async function fetchBanner() {
      try {
        setIsLoading(true);
        setError(null);
        
        const banners = await bannerService.getActive();
        
        if (banners && banners.length > 0) {
          setCurrentBanner(banners[0]);
        } else {
          setError('Nenhum banner ativo encontrado');
        }
      } catch (err) {
        console.error('Erro ao buscar banner:', err);
        setError('Erro ao carregar banner');
      } finally {
        setIsLoading(false);
      }
    }

    fetchBanner();
  }, [banner]);

  // Fallback banner quando não há dados
  const fallbackImageUrl = 'https://picsum.photos/1200/400?grayscale&blur=2';

  // Usar a imagem do banner atual ou a imagem fallback
  const imageUrl = currentBanner?.imageUrl || fallbackImageUrl;

  return (
    <div className="relative w-full h-[300px] md:h-[400px] overflow-hidden">
      <Image
        src={imageUrl}
        alt="Banner"
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />
    </div>
  );
}
