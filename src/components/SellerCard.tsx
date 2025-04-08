"use client";

import { Seller } from '@/data/types';
import { FaWhatsapp } from 'react-icons/fa';

interface SellerCardProps {
  seller: Seller;
  prefilledText?: string;
}

export default function SellerCard({ seller, prefilledText }: SellerCardProps) {
  const formatWhatsAppNumber = (whatsapp: string) => {
    // Formatar o número para o link do WhatsApp
    return whatsapp.replace(/\D/g, '');
  };

  const openWhatsApp = () => {
    const number = formatWhatsAppNumber(seller.whatsapp);
    let whatsappUrl = `https://wa.me/${number}`;
    
    // Adicionar texto pré-preenchido se fornecido
    if (prefilledText) {
      whatsappUrl += `?text=${encodeURIComponent(prefilledText)}`;
    }
    
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-3 flex justify-between items-center">
      <div>
        <h3 className="font-medium text-gray-800">{seller.name}</h3>
      </div>
      <button
        onClick={openWhatsApp}
        className="bg-green-500 hover:bg-green-600 text-white rounded-lg px-4 py-2 flex items-center transition-colors duration-300"
        aria-label={`Iniciar conversa no WhatsApp com ${seller.name}`}
      >
        <FaWhatsapp className="mr-2" />
        <span>WhatsApp</span>
      </button>
    </div>
  );
} 