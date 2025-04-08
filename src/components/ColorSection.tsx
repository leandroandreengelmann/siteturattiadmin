'use client';

import { ColorCollection } from '@/data/types';
import ColorCollectionCard from './ColorCollectionCard';

interface ColorSectionProps {
  collections: ColorCollection[];
}

export default function ColorSection({ collections }: ColorSectionProps) {
  return (
    <div className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Cores Suvinil</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Descubra a coleção de cores Suvinil para transformar seu ambiente. 
            Escolha entre diversas tonalidades para criar o espaço perfeito.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {collections.map((collection) => (
            <ColorCollectionCard key={collection.id} collection={collection} />
          ))}
        </div>
      </div>
    </div>
  );
}
