"use client";

import { Seller } from '@/data/types';
import { FaWhatsapp } from 'react-icons/fa';
import { UserIcon } from '@/components/Icons';
import { ArrowLeft } from 'lucide-react';

interface SellerCardProps {
  seller: Seller;
  prefilledText?: string;
  onBack?: () => void;
}

export default function SellerCard({ seller, prefilledText, onBack }: SellerCardProps) {
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
    <div className="relative bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 mb-3 overflow-hidden group">
      {onBack && (
        <button
          onClick={onBack}
          className="absolute top-3 right-3 z-10 bg-white/70 backdrop-blur-sm rounded-full p-1 text-gray-500 hover:text-blue-500 hover:bg-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
          aria-label="Voltar para seleção de lojas"
        >
          <ArrowLeft size={16} />
        </button>
      )}
      <div className="p-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-4 shadow-sm">
              <UserIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-800 text-lg">{seller.name}</h3>
              <p className="text-xs text-gray-500 mt-0.5">Vendedor</p>
            </div>
          </div>
          <button
            onClick={openWhatsApp}
            className="bg-green-500 hover:bg-green-600 active:bg-green-700 text-white rounded-lg px-4 py-2.5 flex items-center transition-all duration-200 shadow-sm hover:shadow transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2"
            aria-label={`Iniciar conversa no WhatsApp com ${seller.name}`}
          >
            <FaWhatsapp className="mr-2 text-lg" />
            <span>WhatsApp</span>
          </button>
        </div>
      </div>
    </div>
  );
} 