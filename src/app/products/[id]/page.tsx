'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product, ProductImage } from '@/data/types';
import ContactSellerButtonClient from '@/components/ContactSellerButtonClient';

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<ProductImage | null>(null);
  const [imageLoading, setImageLoading] = useState(true);
  
  useEffect(() => {
    async function loadProduct() {
      try {
        const { productService } = await import('@/services/supabaseService');
        const productData = await productService.getById(productId);
        setProduct(productData);
        
        // Definir a imagem inicial (principal ou primeira)
        if (productData && productData.images && productData.images.length > 0) {
          const mainImage = productData.images.find(img => img.isMain) || productData.images[0];
          setSelectedImage(mainImage);
        }
      } catch (error) {
        console.error('Erro ao carregar produto:', error);
      } finally {
        setLoading(false);
      }
    }
    
    loadProduct();
  }, [productId]);
  
  // Função para trocar a imagem selecionada
  const handleSelectImage = (image: ProductImage) => {
    setImageLoading(true);
    setSelectedImage(image);
  };

  // Calcular o desconto percentual se for uma promoção
  const calculateDiscount = () => {
    if (product?.isPromotion && product?.promoPrice && product?.price > 0) {
      return Math.round(((product.price - product.promoPrice) / product.price) * 100);
    }
    return 0;
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-700"></div>
      </div>
    );
  }
  
  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-sm p-8 text-center max-w-md">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Produto não encontrado</h2>
          <p className="text-gray-600 mb-6">O produto que você está procurando pode ter sido removido ou não está disponível.</p>
          <Link 
            href="/products"
            className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded-lg inline-flex items-center transition duration-300"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Ver todos os produtos
          </Link>
        </div>
      </div>
    );
  }
  
  // URL da imagem atual (selecionada ou principal ou primeira)
  const currentImageUrl = selectedImage?.standard || 
    (product.images && product.images.length > 0 ? 
      (product.images.find(img => img.isMain)?.standard || product.images[0].standard) : 
      '/images/placeholder.jpg');
  
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <Link 
            href="/products"
            className="text-blue-700 hover:text-blue-900 transition-colors flex items-center font-medium"
          >
            <svg 
              className="w-5 h-5 mr-1" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M10 19l-7-7m0 0l7-7m-7 7h18" 
              />
            </svg>
            Voltar para produtos
          </Link>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            {/* Product Images - Left Side */}
            <div className="p-4 md:p-8 md:border-r border-gray-100">
              <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-gray-50 mb-4">
                {imageLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-700"></div>
                  </div>
                )}
                <Image
                  src={currentImageUrl}
                  alt={product.name}
                  fill
                  className="object-contain"
                  onLoadingComplete={() => setImageLoading(false)}
                />
                
                {/* Discount badge */}
                {product.isPromotion && calculateDiscount() > 0 && (
                  <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm font-bold shadow-sm z-10">
                    {calculateDiscount()}% OFF
                  </div>
                )}
              </div>
              
              {/* Thumbnails gallery */}
              {product.images && product.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto py-2 scrollbar-hide">
                  {product.images.map((image, index) => (
                    <div 
                      key={index}
                      className={`relative w-20 h-20 rounded-md cursor-pointer transition-all duration-200 ${
                        selectedImage?.id === image.id 
                          ? 'ring-2 ring-blue-600 ring-offset-2' 
                          : 'opacity-70 hover:opacity-100'
                      }`}
                      onClick={() => handleSelectImage(image)}
                    >
                      <Image
                        src={image.thumbnail || image.standard}
                        alt={`${product.name} - imagem ${index + 1}`}
                        fill
                        className="object-contain rounded-md"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Product Details - Right Side */}
            <div className="p-4 md:p-8">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">{product.name}</h1>
              
              <div className="mb-6 flex items-center">
                {/* Price display */}
                <div className="flex flex-col">
                  {/* Show promotional price if available */}
                  {product.isPromotion && product.promoPrice ? (
                    <>
                      <span className="text-blue-600 text-3xl font-bold">
                        R$ {product.promoPrice.toFixed(2).replace('.', ',')}
                      </span>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="line-through text-sm text-gray-500">
                          R$ {product.price.toFixed(2).replace('.', ',')}
                        </span>
                        {calculateDiscount() > 0 && (
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-lg">
                            Economia de {calculateDiscount()}%
                          </span>
                        )}
                      </div>
                    </>
                  ) : (
                    <span className="text-blue-600 text-3xl font-bold">
                      R$ {product.price.toFixed(2).replace('.', ',')}
                    </span>
                  )}
                </div>
              </div>
              
              <div className="bg-gray-50 p-5 rounded-lg mb-8">
                <h2 className="text-lg font-semibold text-gray-800 mb-3">Descrição</h2>
                <p className="text-gray-700 whitespace-pre-line">{product.description}</p>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-500 uppercase">Precisa de ajuda?</h3>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <ContactSellerButtonClient />
                  
                  <button 
                    onClick={() => router.push('/products')}
                    className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded-lg text-center transition duration-300 flex items-center justify-center flex-1 shadow-sm"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                    </svg>
                    Ver outros produtos
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
