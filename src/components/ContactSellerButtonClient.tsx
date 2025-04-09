"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Product } from "@/data/types";
import { productService } from "@/services/localDataService";
import { MessageSquare } from "lucide-react";

interface ContactSellerButtonClientProps {
  productId: string;
}

// Interface estendida para incluir os campos do vendedor
interface ProductWithSellerInfo extends Product {
  sellerPhone?: string;
  sellerName?: string;
}

export default function ContactSellerButtonClient({ productId }: ContactSellerButtonClientProps) {
  const [product, setProduct] = useState<ProductWithSellerInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const fetchedProduct = await productService.getById(productId);
        setProduct(fetchedProduct);
        setError(null);
      } catch (err) {
        console.error('Erro ao buscar produto:', err);
        setError('Não foi possível carregar as informações do produto');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  if (loading) {
    return <div className="animate-pulse bg-gray-200 h-12 rounded-md w-full"></div>;
  }

  if (error || !product) {
    return (
      <div className="text-sm text-red-500">
        {error || 'Informações de contato indisponíveis'}
      </div>
    );
  }

  // Determinar informações de contato
  const sellerPhone = product.sellerPhone || '44999999999';
  const sellerName = product.sellerName || 'Turatti Materiais para Construção';
  const productName = product.name;
  
  // Formatar número para WhatsApp (remover caracteres não numéricos)
  const whatsappNumber = sellerPhone.replace(/\D/g, '');
  
  // Construir mensagem para WhatsApp
  const whatsappMessage = encodeURIComponent(
    `Olá ${sellerName}, estou interessado no produto "${productName}" (ID: ${productId}) anunciado no site da Turatti. Poderia me fornecer mais informações?`
  );
  
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <div className="w-full mt-4">
      <Link href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="w-full">
        <button className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg flex items-center justify-center gap-2 transition-colors duration-300">
          <MessageSquare size={18} />
          WhatsApp
        </button>
      </Link>
    </div>
  );
} 