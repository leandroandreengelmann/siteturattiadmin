"use client";

import { useState } from 'react';
import { FaWhatsapp, FaPhone } from 'react-icons/fa';
import Link from 'next/link';

interface ContactSellerButtonProps {
  buttonText?: string;
  className?: string;
  prefilledText?: string;
  compact?: boolean;
  whatsappNumber?: string;
}

/**
 * Componente para contato direto com a Turatti via WhatsApp
 */
export default function ContactSellerButton({ 
  buttonText = 'Fale com um Vendedor', 
  className = '',
  prefilledText = 'Olá, gostaria de informações sobre produtos da Turatti Materiais para Construção.',
  compact = false,
  whatsappNumber = '44999999999'
}: ContactSellerButtonProps) {
  // Formatar o número e construir a URL
  const formattedNumber = whatsappNumber.replace(/\D/g, '');
  const whatsappMessage = encodeURIComponent(prefilledText);
  const whatsappUrl = `https://wa.me/${formattedNumber}?text=${whatsappMessage}`;
  
  return (
    <Link 
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
    >
      <button
        className={`flex items-center justify-center ${compact ? '' : 'px-4 py-3'} bg-green-600 hover:bg-green-700 active:bg-green-800 text-white rounded-lg transition-all duration-300 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${className}`}
        aria-label="Falar com vendedor via WhatsApp"
      >
        <div className={`flex items-center ${compact ? 'space-x-1' : 'space-x-2'}`}>
          <span className="font-medium">{buttonText}</span>
          <FaWhatsapp className={`${compact ? 'text-base' : 'text-xl'}`} />
        </div>
      </button>
    </Link>
  );
} 