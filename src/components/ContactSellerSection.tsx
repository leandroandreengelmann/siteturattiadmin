"use client";

import { useState } from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import Link from 'next/link';

export default function ContactSellerSection() {
  // Informações de contato padrão da Turatti
  const defaultPhone = "44999999999";
  const whatsappMessage = encodeURIComponent(
    "Olá, gostaria de informações sobre produtos da Turatti Materiais para Construção."
  );
  const whatsappUrl = `https://wa.me/${defaultPhone}?text=${whatsappMessage}`;
  
  return (
    <div className="container mx-auto mt-6 px-4 sm:px-6 flex justify-center">
      <Link href={whatsappUrl} target="_blank" rel="noopener noreferrer">
        <button className="flex items-center justify-center px-6 py-3 bg-green-600 hover:bg-green-700 active:bg-green-800 text-white rounded-lg transition-all duration-300 shadow-sm hover:shadow-md text-lg">
          <FaWhatsapp className="mr-2 text-xl" />
          Falar com um vendedor
        </button>
      </Link>
    </div>
  );
} 