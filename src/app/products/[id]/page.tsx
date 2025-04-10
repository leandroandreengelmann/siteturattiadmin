'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/data/types';
import { productService } from '@/services/localDataService';
import ContactSellerButtonClient from '@/components/ContactSellerButtonClient';
import { FaWhatsapp } from 'react-icons/fa';
import StoreSellerModal from '@/components/StoreSellerModal';

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageLoading, setImageLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  useEffect(() => {
    async function loadProduct() {
      try {
        setLoading(true);
        const productData = await productService.getById(productId);
        setProduct(productData);
        setError(null);
      } catch (error) {
        console.error('Erro ao carregar produto:', error);
        setError('Não foi possível carregar o produto. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    }
    
    loadProduct();
  }, [productId]);
  
  const calculateDiscount = () => {
    if (product?.isPromotion && product?.promoPrice && product?.price > 0) {
      const discount = ((product.price - product.promoPrice) / product.price) * 100;
      return Math.round(discount);
    }
    return 0;
  };
  
  // Get the image URL
  const getImageUrl = () => {
    if (!product || !product.images || product.images.length === 0) {
      return '/placeholder-product.png';
    }
    
    const image = product.images[0];
    if (typeof image === 'string') {
      return image;
    }
    
    return image.highResolution || image.standard || '/placeholder-product.png';
  };
  
  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }
  
  if (error || !product) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-50 p-6 rounded-lg text-center">
          <h2 className="text-xl font-bold text-red-600 mb-2">Erro ao carregar produto</h2>
          <p className="text-red-700">{error || 'Produto não encontrado'}</p>
          <button 
            onClick={() => router.push('/products')}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            Voltar para produtos
          </button>
        </div>
      </div>
    );
  }
  
  const imageUrl = getImageUrl();
  
  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="mb-6 flex items-center text-sm text-gray-600">
          <Link href="/" className="hover:text-blue-600">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link href="/products" className="hover:text-blue-600">
            Produtos
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-400">
            {product.name}
          </span>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            {/* Product Images - Left Side */}
            <div className="p-4 md:p-8 md:border-r border-gray-100">
              <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] rounded-lg overflow-hidden bg-gray-50 mb-4">
                {imageLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-700"></div>
                  </div>
                )}
                <Image
                  src={imageUrl}
                  alt={product.name}
                  className="object-cover"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                  onLoadingComplete={() => setImageLoading(false)}
                />
                
                {/* Discount badge */}
                {product.isPromotion && calculateDiscount() > 0 && (
                  <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm font-bold shadow-sm z-10">
                    {calculateDiscount()}% OFF
                  </div>
                )}
              </div>
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
                      {product.installments && (
                        <div className="mt-2 text-sm text-blue-600">
                          Em até {product.installments}x sem juros
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      <span className="text-blue-600 text-3xl font-bold">
                        R$ {product.price.toFixed(2).replace('.', ',')}
                      </span>
                      {product.installments && (
                        <div className="mt-2 text-sm text-blue-600">
                          Em até {product.installments}x sem juros
                        </div>
                      )}
                    </>
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
                  <button 
                    onClick={() => setIsModalOpen(true)}
                    className="bg-green-600 hover:bg-green-700 active:bg-green-800 text-white px-6 py-3 rounded-lg text-center transition duration-300 flex items-center justify-center flex-1 shadow-sm"
                  >
                    <FaWhatsapp className="mr-2 text-xl" />
                    Falar com vendedor
                  </button>
                  
                  <button 
                    onClick={() => router.push('/products')}
                    className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded-lg text-center transition duration-300 flex items-center justify-center flex-1 shadow-sm"
                  >
                    <FaWhatsapp className="mr-2 text-xl" />
                    Ver outros produtos
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <StoreSellerModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
