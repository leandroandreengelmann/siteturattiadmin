'use client';

import { useState } from 'react';
import { Color } from '@/data/types';
import Image from 'next/image';

interface ColorDetailPageProps {
  color: Color;
}

export default function ColorDetailPage({ color }: ColorDetailPageProps) {
  // Removi o useState do activeTab que estava causando o erro
  // const [activeTab, setActiveTab] = useState('details');
  
  if (!color) {
    return (
      <div className="container mx-auto px-4 py-12">
        <p className="text-lg text-gray-600">Cor não encontrada.</p>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="md:flex">
          {/* Preview da cor */}
          <div className="md:w-1/3 p-6">
            <div 
              className="w-full h-64 rounded-lg shadow-inner" 
              style={{ backgroundColor: color.hexCode }}
            />
            <div className="mt-4 text-center">
              <p className="text-lg font-semibold text-gray-800">{color.name}</p>
              <p className="text-sm text-gray-600">{color.hexCode}</p>
            </div>
          </div>
          
          {/* Informações da cor */}
          <div className="md:w-2/3 p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">{color.name}</h1>
            
            <div className="mt-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Detalhes</h3>
              <div className="space-y-2">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600">Código Hex</span>
                  <span className="font-medium">{color.hexCode}</span>
                </div>
                
                {color.collectionId && (
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-gray-600">Coleção</span>
                    <span className="font-medium">Coleção #{color.collectionId}</span>
                  </div>
                )}
                
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600">Data de Adição</span>
                  <span className="font-medium">
                    {color.createdAt && new Date(color.createdAt).toLocaleDateString('pt-BR')}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Sugestões de Combinações</h3>
              <div className="grid grid-cols-3 gap-3">
                <div 
                  className="h-16 rounded-md shadow-sm" 
                  style={{ backgroundColor: '#f0f0f0' }}
                />
                <div 
                  className="h-16 rounded-md shadow-sm" 
                  style={{ backgroundColor: '#e0e0e0' }}
                />
                <div 
                  className="h-16 rounded-md shadow-sm" 
                  style={{ backgroundColor: '#d0d0d0' }}
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Aplicações da cor - usando Image em vez de img */}
        <div className="p-6 border-t">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Aplicações Sugeridas</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="relative h-48 bg-gray-100 rounded-md overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                Aplicação de exemplo
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 