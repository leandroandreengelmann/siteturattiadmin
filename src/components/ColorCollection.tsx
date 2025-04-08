'use client';

import { ColorCollection } from '@/data/types';
import Image from 'next/image';
import Link from 'next/link';

interface ColorCollectionProps {
  collections: ColorCollection[];
}

export default function ColorCollections({ collections }: ColorCollectionProps) {
  if (!collections || collections.length === 0) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Nossas Coleções de Cores</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {collections.map((collection) => (
          <Link 
            key={collection.id}
            href={`/collections/${collection.id}`} 
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            <div 
              className="h-40 w-full bg-cover bg-center" 
              style={{ 
                backgroundColor: collection.representativeColor || '#f0f0f0',
                backgroundImage: collection.imageUrl ? `url(${collection.imageUrl})` : 'none'
              }}
            />
            
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{collection.name}</h3>
              {collection.description && (
                <p className="text-sm text-gray-600 mb-3">{collection.description}</p>
              )}
              <div className="flex items-center text-blue-700">
                <span className="text-sm">Ver detalhes</span>
                <svg 
                  className="w-4 h-4 ml-1" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
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
        ))}
      </div>
    </div>
  );
} 