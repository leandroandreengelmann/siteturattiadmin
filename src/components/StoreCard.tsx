"use client";

import Image from 'next/image';
import { Store } from '@/data/types';

interface StoreCardProps {
  store: Store;
  onClick: (store: Store) => void;
}

export default function StoreCard({ store, onClick }: StoreCardProps) {
  return (
    <div 
      className="bg-white rounded-lg shadow-md p-4 cursor-pointer hover:shadow-xl transition-shadow duration-300 flex flex-col items-center"
      onClick={() => onClick(store)}
    >
      <div className="w-16 h-16 mb-2 relative overflow-hidden rounded-full">
        {store.iconUrl ? (
          <Image
            src={store.iconUrl}
            alt={`Loja ${store.name}`}
            fill
            sizes="64px"
            className="object-cover"
          />
        ) : (
          <div className="bg-gray-200 w-full h-full flex items-center justify-center rounded-full">
            <span className="text-gray-500 text-xl">{store.name.charAt(0)}</span>
          </div>
        )}
      </div>
      <h3 className="text-center font-medium text-gray-800">{store.name}</h3>
      <p className="text-sm text-gray-600 text-center">{store.city}</p>
    </div>
  );
} 