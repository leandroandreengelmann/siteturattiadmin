'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useToast } from '@/components/ToastProvider';
import { ColorCollection } from '@/data/types';
import { colorCollectionService } from '@/services/localDataService';

export default function AdminCollectionsPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [collectionsList, setCollectionsList] = useState<ColorCollection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCollection, setCurrentCollection] = useState<ColorCollection | null>(null);
  
  // Dados do formulário
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [representativeColor, setRepresentativeColor] = useState('#3b82f6');
  
  useEffect(() => {
    async function init() {
      try {
        // Carregar coleções de cores
        const collections = await colorCollectionService.getAll();
        setCollectionsList(collections);
      } catch (error) {
        console.error('Erro ao inicializar a página de coleções:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    init();
  }, []);

  // Adicionar nova coleção
  const handleAddNew = () => {
    setIsEditing(true);
    setCurrentCollection(null);
    resetForm();
  };

  // Editar coleção existente
  const handleEdit = (collection: ColorCollection) => {
    setCurrentCollection(collection);
    setName(collection.name);
    setDescription(collection.description || '');
    setRepresentativeColor(collection.representativeColor || '#3b82f6');
    setIsEditing(true);
  };

  // Excluir coleção
  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta coleção?')) {
      try {
        const success = await colorCollectionService.delete(id);
        
        if (success) {
          setCollectionsList(collectionsList.filter(c => c.id !== id));
          showToast('Coleção excluída com sucesso!', 'success');
        } else {
          showToast('Erro ao excluir coleção. Tente novamente.', 'error');
        }
      } catch (error) {
        console.error('Erro ao excluir coleção:', error);
        showToast('Ocorreu um erro inesperado. Tente novamente.', 'error');
      }
    }
  };

  // Resetar formulário
  const resetForm = () => {
    setName('');
    setDescription('');
    setRepresentativeColor('#3b82f6');
  };

  // Cancelar edição
  const handleCancel = () => {
    setIsEditing(false);
    setCurrentCollection(null);
    resetForm();
  };

  // Submeter formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (currentCollection) {
        // Atualizar coleção existente
        const updates = {
          name,
          representativeColor,
          description,
        };
        
        console.log('Enviando atualização:', updates);
        
        const success = await colorCollectionService.update(currentCollection.id, updates);
        
        if (success) {
          // Atualizar a lista local
          setCollectionsList(collectionsList.map(c => 
            c.id === currentCollection.id ? { ...c, ...updates } : c
          ));
          console.log('Coleção atualizada com sucesso');
          
          // Mostrar toast de sucesso
          showToast(`Coleção "${name}" atualizada com sucesso!`, 'success');
        } else {
          // Mostrar toast de erro
          showToast('Erro ao atualizar coleção. Tente novamente.', 'error');
        }
      } else {
        // Adicionar nova coleção
        const newCollection = {
          name,
          representativeColor,
          description,
        };
        
        console.log('Enviando nova coleção:', newCollection);
        
        const addedCollection = await colorCollectionService.add(newCollection);
        
        if (addedCollection) {
          console.log('Coleção adicionada com sucesso:', addedCollection);
          setCollectionsList([...collectionsList, addedCollection]);
          
          // Mostrar toast de sucesso
          showToast(`Coleção "${name}" adicionada com sucesso!`, 'success');
        } else {
          // Mostrar toast de erro
          showToast('Erro ao adicionar coleção. Tente novamente.', 'error');
        }
      }
      
      setIsEditing(false);
      setCurrentCollection(null);
      resetForm();
    } catch (error) {
      console.error('Erro ao salvar coleção:', error);
      // Mostrar toast de erro
      showToast('Ocorreu um erro inesperado. Tente novamente.', 'error');
    }
  };
  
  // Manipulação do campo representativeColor
  const handleRepresentativeColorChange = (value: string) => {
    console.log('Nova cor representativa:', value);
    setRepresentativeColor(value);
  };
  
  // Renderização da página
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto"></div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <div>
          <Link href="/admin" className="text-blue-700 hover:underline mb-2 inline-block">
            &larr; Voltar para o Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-800">Gerenciar Coleções de Cores</h1>
        </div>
        
        {!isEditing && (
          <button
            onClick={handleAddNew}
            className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-md transition duration-300"
          >
            Adicionar Nova Coleção
          </button>
        )}
      </div>
      
      {isEditing ? (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            {currentCollection ? 'Editar Coleção' : 'Nova Coleção'}
          </h2>
          
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-gray-700 mb-2" htmlFor="name">
                  Nome da Coleção *
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2" htmlFor="representativeColor">
                  Cor Representativa *
                </label>
                <div className="flex items-center">
                  <input
                    type="color"
                    id="representativeColor"
                    value={representativeColor}
                    onChange={(e) => handleRepresentativeColorChange(e.target.value)}
                    className="w-12 h-10 border border-gray-300 rounded-md mr-2"
                  />
                  <input
                    type="text"
                    value={representativeColor}
                    onChange={(e) => handleRepresentativeColorChange(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="#RRGGBB"
                    pattern="^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$"
                    required
                  />
                </div>
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-gray-700 mb-2" htmlFor="description">
                  Descrição *
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition duration-300"
              >
                Cancelar
              </button>
              
              <button
                type="submit"
                className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-md transition duration-300"
              >
                {currentCollection ? 'Atualizar' : 'Salvar'}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {collectionsList.map((collection) => (
            <div key={collection.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div 
                className="h-32 w-full" 
                style={{ backgroundColor: collection.representativeColor || '#CCCCCC' }}
              />
              
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{collection.name}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{collection.description}</p>
                
                <div className="flex justify-between pt-2 mt-2 border-t border-gray-100">
                  <button
                    onClick={() => handleEdit(collection)}
                    className="inline-flex items-center px-3 py-1.5 border border-blue-700 text-sm font-medium rounded-md text-blue-700 bg-white hover:bg-blue-100 focus:outline-none"
                  >
                    <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Editar
                  </button>
                  
                  <button
                    onClick={() => handleDelete(collection.id)}
                    className="inline-flex items-center px-3 py-1.5 border border-red-600 text-sm font-medium rounded-md text-red-600 bg-white hover:bg-red-50 focus:outline-none"
                  >
                    <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Excluir
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          {collectionsList.length === 0 && (
            <div className="col-span-full text-center py-8">
              <p className="text-gray-500">Nenhuma coleção cadastrada.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
