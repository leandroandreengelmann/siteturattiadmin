"use client";

import { useState } from 'react';
import { FaWhatsapp, FaStore } from 'react-icons/fa';
import StoreSelector from './StoreSelector';

interface ContactSellerButtonProps {
  buttonText?: string;
  className?: string;
  prefilledText?: string;
  compact?: boolean;
}

export default function ContactSellerButton({ 
  buttonText = 'Fale com um Vendedor', 
  className = '',
  prefilledText,
  compact = false
}: ContactSellerButtonProps) {
  const [showSelector, setShowSelector] = useState(false);

  const openSelector = () => {
    setShowSelector(true);
  };

  const closeSelector = () => {
    setShowSelector(false);
  };

  return (
    <>
      <button
        onClick={openSelector}
        className={`flex items-center justify-center ${compact ? '' : 'px-4 py-3'} bg-green-600 hover:bg-green-700 active:bg-green-800 text-white rounded-lg transition-all duration-300 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${className}`}
        aria-label="Selecionar loja para falar com um vendedor"
      >
        <div className={`flex items-center ${compact ? 'space-x-1' : 'space-x-2'}`}>
          {!compact && <FaStore className="mr-1 text-lg" />}
          <span className="font-medium">{buttonText}</span>
          <FaWhatsapp className={`${compact ? 'ml-1' : 'ml-2'} ${compact ? 'text-base' : 'text-xl'}`} />
        </div>
      </button>
      
      {showSelector && <StoreSelector onClose={closeSelector} prefilledText={prefilledText} />}
    </>
  );
} 