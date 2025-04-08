import { ColorCollection, Color } from '@/data/types';
import ColorItem from '@/components/ColorItem';
import Link from 'next/link';
import { collectionService, colorService } from '@/services/supabaseService';
import { notFound } from 'next/navigation';

async function getCollectionData(id: string) {
  const collection = await collectionService.getById(id);
  if (!collection) {
    return { collection: null, colors: [] };
  }
  
  const colors = await colorService.getByCollection(id);
  return { collection, colors };
}

export default async function CollectionPage({ params }: { params: { id: string } }) {
  const collectionId = params.id;
  const { collection, colors: collectionColors } = await getCollectionData(collectionId);
  
  if (!collection) {
    notFound();
  }
  
  if (!collection) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Coleção não encontrada</h2>
        <Link 
          href="/collections"
          className="text-blue-700 hover:underline"
        >
          Voltar para coleções
        </Link>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <Link 
          href="/collections"
          className="text-blue-700 hover:underline flex items-center"
        >
          <svg 
            className="w-4 h-4 mr-1" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M15 19l-7-7 7-7" 
            />
          </svg>
          Voltar para coleções
        </Link>
      </div>
      
      <div className="flex flex-col md:flex-row items-start gap-8 mb-12">
        <div 
          className="w-full md:w-64 h-40 rounded-lg shadow-md"
          style={{ backgroundColor: collection.representativeColor }}
        />
        
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">{collection.name}</h1>
          <p className="text-gray-600 mb-6">{collection.description}</p>
        </div>
      </div>
      
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Cores nesta coleção</h2>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {collectionColors.map(color => (
          <ColorItem key={color.id} color={color} />
        ))}
      </div>
      
      {collectionColors.length === 0 && (
        <p className="text-gray-600 text-center py-8">
          Nenhuma cor encontrada nesta coleção.
        </p>
      )}
    </div>
  );
}
