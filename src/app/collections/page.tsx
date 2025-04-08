import ColorCollectionCard from '@/components/ColorCollectionCard';
import { collectionService } from '@/services/supabaseService';
import { ColorCollection } from '@/data/types';

// Configurações para evitar cache na Vercel
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

async function getCollections() {
  const collections = await collectionService.getAll();
  return collections;
}

export default async function CollectionsPage() {
  const colorCollections = await getCollections();
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Cores Suvinil</h1>
      
      <p className="text-gray-600 mb-8 max-w-3xl">
        Explore nossa ampla seleção de cores Suvinil para transformar qualquer ambiente. 
        Clique em uma coleção para ver todas as cores disponíveis.
      </p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {colorCollections.map((collection) => (
          <ColorCollectionCard key={collection.id} collection={collection} />
        ))}
      </div>
    </div>
  );
}
