"use client";

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import ContactSellerButton from './ContactSellerButton';
import { productService } from '@/services/supabaseService';
import { Product } from '@/data/types';

export default function ContactSellerButtonClient() {
  const params = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [prefilledText, setPrefilledText] = useState('');

  useEffect(() => {
    const loadProduct = async () => {
      if (params.id) {
        const productId = Array.isArray(params.id) ? params.id[0] : params.id;
        const productData = await productService.getById(productId);
        if (productData) {
          setProduct(productData);
          setPrefilledText(`Olá, tenho interesse no produto: ${productData.name} (ID: ${productData.id})`);
        }
      }
    };

    loadProduct();
  }, [params.id]);

  return (
    <ContactSellerButton 
      buttonText="Falar com vendedor" 
      className="flex-1 shadow-md text-sm md:text-base font-medium"
      prefilledText={prefilledText}
    />
  );
} 