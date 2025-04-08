"use client";

import { useState } from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import StoreSelector from './StoreSelector';

interface ContactSellerButtonProps {
  buttonText?: string;
  className?: string;
  prefilledText?: string;
}

export default function ContactSellerButton({ 
  buttonText = 'Fale com um Vendedor', 
  className = '',
  prefilledText
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
        className={`flex items-center justify-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-300 ${className}`}
      >
        <FaWhatsapp className="mr-2" />
        <span>{buttonText}</span>
      </button>
      
      {showSelector && <StoreSelector onClose={closeSelector} />}
    </>
  );
} 