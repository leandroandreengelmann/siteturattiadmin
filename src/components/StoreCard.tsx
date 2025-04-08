"use client";

import { Store } from '@/data/types';
import { X } from 'lucide-react';

interface StoreCardProps {
  store: Store;
  onClick: (store: Store) => void;
  onClose?: () => void;
}

export default function StoreCard({ store, onClick, onClose }: StoreCardProps) {
  return (
    <div className="relative bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 min-w-[200px]">
      {onClose && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="absolute top-2 right-2 z-10 bg-white/70 backdrop-blur-sm rounded-full p-1 text-gray-500 hover:text-red-500 hover:bg-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
          aria-label="Fechar seleção de lojas"
        >
          <X size={16} />
        </button>
      )}
      <div 
        onClick={() => onClick(store)}
        className="w-full h-full p-6 flex items-center justify-center cursor-pointer hover:bg-blue-50 active:bg-blue-100 transition-colors duration-200"
        role="button"
        tabIndex={0}
        aria-label={`Selecionar loja ${store.name}`}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClick(store);
          }
        }}
      >
        <h3 className="font-semibold text-gray-800 text-center text-lg">{store.name}</h3>
      </div>
    </div>
  );
} 