'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ColorCollection } from '@/data/types';
import { useToast } from '@/components/ToastProvider';

export default function AdminCollectionsPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [collectionsList, setCollectionsList] = useState<ColorCollection[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCollection, setCurrentCollection] = useState<ColorCollection | null>(null);
  const { showToast } = useToast();
  
  // Form state
  const [name, setName] = useState('');
  const [representativeColor, setRepresentativeColor] = useState('');
  const [description, setDescription] = useState('');
  
  // Check if user is authenticated and load collections
  useEffect(() => {
    async function init() {
      try {
        // Verificar autenticação com Supabase
        const { authService, collectionService } = await import('@/services/supabaseService');
        const session = await authService.getSession();
        
        if (!session) {
          // Redirecionar para a página inicial se não estiver autenticado
          router.push('/');
          return;
        }
        
        setIsAuthenticated(true);
        
        // Carregar coleções do Supabase
        const collectionsData = await collectionService.getAll();
        setCollectionsList(collectionsData);
      } catch (error) {
        console.error('Erro ao verificar autenticação ou carregar coleções:', error);
        router.push('/');
      }
    }
    
    init();
  }, [router]);
  
  // Set form data when editing a collection
  useEffect(() => {
    if (currentCollection) {
      setName(currentCollection.name);
      // Garantir que usamos a propriedade em camelCase
      setRepresentativeColor(currentCollection.representativeColor || '#000000');
      setDescription(currentCollection.description);
    }
  }, [currentCollection]);
  
  const handleAddNew = () => {
    setIsEditing(true);
    setCurrentCollection(null);
    resetForm();
  };
  
  const handleEdit = (collection: ColorCollection) => {
    setIsEditing(true);
    setCurrentCollection(collection);
  };
  
  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta coleção?')) {
      try {
        const { collectionService } = await import('@/services/supabaseService');
        const success = await collectionService.delete(id);
        
        if (success) {
          // Encontrar o nome da coleção para exibir no toast
          const deletedCollection = collectionsList.find(c => c.id === id);
          setCollectionsList(collectionsList.filter(c => c.id !== id));
          
          // Mostrar toast de sucesso
          if (deletedCollection) {
            showToast(`Coleção "${deletedCollection.name}" excluída com sucesso!`, 'success');
          } else {
            showToast('Coleção excluída com sucesso!', 'success');
          }
        } else {
          // Mostrar toast de erro
          showToast('Erro ao excluir coleção. Tente novamente.', 'error');
        }
      } catch (error) {
        console.error('Erro ao excluir coleção:', error);
        // Mostrar toast de erro
        showToast('Ocorreu um erro ao excluir a coleção. Tente novamente.', 'error');
      }
    }
  };
  
  const resetForm = () => {
    setName('');
    setRepresentativeColor('#000000');
    setDescription('');
  };
  
  const handleCancel = () => {
    setIsEditing(false);
    setCurrentCollection(null);
    resetForm();
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { collectionService } = await import('@/services/supabaseService');
      
      if (currentCollection) {
        // Atualizar coleção existente
        const updates: Partial<ColorCollection> = {
          name,
          representativeColor,
          description,
        };
        
        console.log('Enviando atualização:', updates);
        
        const success = await collectionService.update(currentCollection.id, updates);
        
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
          representativeColor, // Usar camelCase para compatibilidade com o serviço
          description,
        };
        
        console.log('Enviando nova coleção:', newCollection);
        
        const addedCollection = await collectionService.add(newCollection);
        
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
  
  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p>Verificando autenticação...</p>
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
                
                <div className="flex justify-between">
                  <button
                    onClick={() => handleEdit(collection)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    Editar
                  </button>
                  
                  <button
                    onClick={() => handleDelete(collection.id)}
                    className="text-red-600 hover:text-red-900"
                  >
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
