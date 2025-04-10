"use client";

import { useState } from 'react';
import { FaWhatsapp, FaPhone } from 'react-icons/fa';
import StoreSellerModal from './StoreSellerModal';

interface ContactSellerButtonProps {
  buttonText?: string;
  className?: string;
  prefilledText?: string;
  compact?: boolean;
}

/**
 * Componente para contato direto com vendedores da Turatti via modal de seleção
 */
export default function ContactSellerButton({ 
  buttonText = 'Fale com um Vendedor', 
  className = '',
  prefilledText = 'Olá, gostaria de informações sobre produtos da Turatti Materiais para Construção.',
  compact = false,
}: ContactSellerButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  
  return (
    <>
      <button
        onClick={handleOpenModal}
        className={`flex items-center justify-center ${compact ? '' : 'px-4 py-3'} bg-green-600 hover:bg-green-700 active:bg-green-800 text-white rounded-lg transition-all duration-300 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${className}`}
        aria-label="Falar com vendedor"
      >
        <div className={`flex items-center ${compact ? 'space-x-1' : 'space-x-2'}`}>
          <span className="font-medium">{buttonText}</span>
          <FaWhatsapp className={`${compact ? 'text-base' : 'text-xl'}`} />
        </div>
      </button>
      
      <StoreSellerModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </>
  );
} 