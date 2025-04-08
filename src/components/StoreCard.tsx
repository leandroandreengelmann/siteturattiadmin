"use client";

import Image from 'next/image';
import { Store } from '@/data/types';
import { BuildingIcon, ShoppingBagIcon } from '@/components/Icons';

interface StoreCardProps {
  store: Store;
  onClick: (store: Store) => void;
}

export default function StoreCard({ store, onClick }: StoreCardProps) {
  // Função para determinar a cor de fundo do ícone baseada no nome da loja
  const getIconBackgroundColor = (name: string) => {
    // Uma lista de cores que serão usadas para diferentes lojas
    const colors = [
      'bg-blue-500', // Azul
      'bg-green-500', // Verde
      'bg-purple-500', // Roxo
      'bg-yellow-500', // Amarelo
      'bg-red-500', // Vermelho
      'bg-indigo-500', // Índigo
      'bg-pink-500', // Rosa
      'bg-teal-500' // Teal
    ];
    
    // Escolher uma cor baseada na primeira letra do nome
    const letterIndex = name.charCodeAt(0) % colors.length;
    return colors[letterIndex];
  };

  // Determinar qual ícone usar com base no nome da loja
  const getStoreIcon = (name: string) => {
    // Se contém "peixoto" no nome, usa ShoppingBagIcon, caso contrário usa BuildingIcon
    return name.toLowerCase().includes('peixoto') ? 
      <ShoppingBagIcon className="w-8 h-8 text-white" /> : 
      <BuildingIcon className="w-8 h-8 text-white" />;
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-md p-4 cursor-pointer hover:shadow-xl transition-shadow duration-300 flex flex-col items-center"
      onClick={() => onClick(store)}
    >
      <div className="w-16 h-16 mb-2 relative overflow-hidden rounded-full">
        {store.iconUrl && store.iconUrl.length > 0 ? (
          <Image
            src={store.iconUrl}
            alt={`Loja ${store.name}`}
            fill
            sizes="64px"
            className="object-cover"
          />
        ) : (
          <div className={`w-full h-full flex items-center justify-center ${getIconBackgroundColor(store.name)}`}>
            {getStoreIcon(store.name)}
          </div>
        )}
      </div>
      <h3 className="text-center font-medium text-gray-800">{store.name}</h3>
      <p className="text-sm text-gray-600 text-center">{store.city}</p>
    </div>
  );
} 