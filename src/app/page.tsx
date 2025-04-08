import Banner from '@/components/Banner';
import ProductCarousel from '@/components/ProductCarousel';
import ColorSection from '@/components/ColorSection';
import { productService, collectionService, bannerService } from '@/services/supabaseService';
import { TruckIcon, ShieldCheckIcon, HeadphonesIcon } from 'lucide-react';
import ContactSellerSection from '@/components/ContactSellerSection';

async function getData() {
  try {
    // Buscar dados em paralelo para melhor performance e tolerância a falhas
    const [
      promotionProductsPromise,
      featuredProductsPromise, 
      colorCollectionsPromise,
      bannersPromise
    ] = await Promise.allSettled([
      productService.getPromotions(),
      productService.getNonPromotions(),
      collectionService.getAll(),
      bannerService.getActive()
    ]);
    
    // Extrair resultados com fallbacks para evitar quebras
    const promotionProducts = promotionProductsPromise.status === 'fulfilled' 
      ? promotionProductsPromise.value 
      : [];
      
    const featuredProducts = featuredProductsPromise.status === 'fulfilled' 
      ? featuredProductsPromise.value 
      : [];
      
    const colorCollections = colorCollectionsPromise.status === 'fulfilled' 
      ? colorCollectionsPromise.value 
      : [];
      
    const banners = bannersPromise.status === 'fulfilled'
      ? bannersPromise.value
      : [];
    
    return {
      promotionProducts,
      featuredProducts,
      colorCollections,
      banners
    };
  } catch (error) {
    console.error('Erro ao buscar dados da página inicial:', error);
    // Retornar valores padrão para evitar quebrar a página
    return {
      promotionProducts: [],
      featuredProducts: [],
      colorCollections: [],
      banners: []
    };
  }
}

export default async function Home() {
  // Buscar dados do Supabase
  const { promotionProducts, featuredProducts, colorCollections, banners } = await getData();
  
  // Obter o primeiro banner ativo, se houver algum
  const firstBanner = banners.length > 0 ? banners[0] : undefined;
  
  return (
    <div className="min-h-screen">
      {/* Main Banner */}
      <Banner banner={firstBanner} />
      
      {/* Botão de contato com vendedor */}
      <ContactSellerSection />
      
      {/* Promotion Products Carousel - mostrar primeiro */}
      {promotionProducts.length > 0 && (
        <ProductCarousel 
          products={promotionProducts} 
          title="Promoções do Mês" 
        />
      )}
      
      {/* Featured Products Carousel */}
      {featuredProducts.length > 0 && (
        <ProductCarousel 
          products={featuredProducts} 
          title="Produtos em Destaque" 
        />
      )}
      
      {/* Colors Section */}
      <ColorSection collections={colorCollections} />

      {/* Informações adicionais */}
      <section className="bg-gray-50 py-10 lg:py-16">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="bg-white p-5 sm:p-6 rounded-xl shadow-sm flex flex-col items-center text-center">
              <TruckIcon className="h-10 w-10 text-blue-600 mb-4" />
              <h3 className="text-lg font-medium text-gray-800 mb-2">Envio Rápido</h3>
              <p className="text-gray-600 text-sm">Entregamos para todo o Brasil com rapidez e segurança.</p>
            </div>
            
            <div className="bg-white p-5 sm:p-6 rounded-xl shadow-sm flex flex-col items-center text-center">
              <ShieldCheckIcon className="h-10 w-10 text-blue-600 mb-4" />
              <h3 className="text-lg font-medium text-gray-800 mb-2">Qualidade Garantida</h3>
              <p className="text-gray-600 text-sm">Produtos de alta qualidade com garantia de satisfação.</p>
            </div>
            
            <div className="bg-white p-5 sm:p-6 rounded-xl shadow-sm flex flex-col items-center text-center">
              <HeadphonesIcon className="h-10 w-10 text-blue-600 mb-4" />
              <h3 className="text-lg font-medium text-gray-800 mb-2">Suporte ao Cliente</h3>
              <p className="text-gray-600 text-sm">Atendimento personalizado para melhor atender suas necessidades.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
