'use client';

// Importações ajustadas, removendo o Link não utilizado
import { useParams } from 'next/navigation';
import { Color } from '@/data/types';

export default function ColorCollectionDetailPage() {
  const { slug } = useParams();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Detalhes da Coleção: {slug}</h1>
      <p>Conteúdo em construção...</p>
    </div>
  );
} 