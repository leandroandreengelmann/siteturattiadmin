"use client";

import { useState } from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import StoreSellerModal from './StoreSellerModal';

export default function ContactSellerSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  
  return (
    <div className="container mx-auto mt-6 mb-8 px-4 sm:px-6 flex justify-center">
      <button 
        onClick={handleOpenModal}
        className="flex items-center justify-center px-6 py-3 bg-green-600 hover:bg-green-700 active:bg-green-800 text-white rounded-lg transition-all duration-300 shadow-sm hover:shadow-md text-lg"
      >
        <FaWhatsapp className="mr-2 text-xl" />
        Falar com um vendedor
      </button>
      
      <StoreSellerModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  );
} 