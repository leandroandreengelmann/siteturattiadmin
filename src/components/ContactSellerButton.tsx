"use client";

import { useState } from 'react';
import { FaWhatsapp, FaStore } from 'react-icons/fa';
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
        className={`flex items-center justify-center px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition duration-300 shadow-md ${className}`}
      >
        <div className="flex items-center space-x-2">
          <FaStore className="mr-2 text-lg" />
          <span className="font-medium">{buttonText}</span>
          <FaWhatsapp className="ml-1 text-xl" />
        </div>
      </button>
      
      {showSelector && <StoreSelector onClose={closeSelector} prefilledText={prefilledText} />}
    </>
  );
} 