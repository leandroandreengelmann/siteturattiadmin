'use client';

import Link from 'next/link';
import { ColorCollection } from '@/data/types';

interface ColorCollectionCardProps {
  collection: ColorCollection;
}

export default function ColorCollectionCard({ collection }: ColorCollectionCardProps) {
  return (
    <Link 
      href={`/collections/${collection.id}`}
      className="block bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1"
    >
      <div 
        className="h-32 w-full" 
        style={{ backgroundColor: collection.representativeColor }}
      />
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{collection.name}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{collection.description}</p>
        
        <div className="flex items-center text-blue-700">
          <span>Ver cores</span>
          <svg 
            className="w-4 h-4 ml-1" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M9 5l7 7-7 7" 
            />
          </svg>
        </div>
      </div>
    </Link>
  );
}
