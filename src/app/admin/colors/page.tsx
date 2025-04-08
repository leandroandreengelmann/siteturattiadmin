'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Color, ColorCollection } from '@/data/types';
import { useToast } from '@/components/ToastProvider';

export default function AdminColorsPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [colorsList, setColorsList] = useState<Color[]>([]);
  const [collections, setCollections] = useState<ColorCollection[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentColor, setCurrentColor] = useState<Color | null>(null);
  const { showToast } = useToast();
  
  // Form state
  const [name, setName] = useState('');
  const [collectionId, setCollectionId] = useState('');
  const [hexCode, setHexCode] = useState('');
  
  // Check if user is authenticated and load colors
  useEffect(() => {
    async function init() {
      try {
        // Verificar autenticação com Supabase
        const { authService, colorService, collectionService } = await import('@/services/supabaseService');
        const session = await authService.getSession();
        
        if (!session) {
          // Redirecionar para a página inicial se não estiver autenticado
          router.push('/');
          return;
        }
        
        setIsAuthenticated(true);
        
        // Carregar cores e coleções do Supabase
        const colorsData = await colorService.getAll();
        setColorsList(colorsData);
        
        const collectionsData = await collectionService.getAll();
        setCollections(collectionsData);
      } catch (error) {
        console.error('Erro ao verificar autenticação ou carregar dados:', error);
        router.push('/');
      }
    }
    
    init();
  }, [router]);
  
  // Set form data when editing a color
  useEffect(() => {
    if (currentColor) {
      setName(currentColor.name);
      setCollectionId(currentColor.collectionId || '');
      setHexCode(currentColor.hexCode || '#000000');
    }
  }, [currentColor]);
  
  const handleAddNew = () => {
    setIsEditing(true);
    setCurrentColor(null);
    resetForm();
  };
  
  const handleEdit = (color: Color) => {
    setIsEditing(true);
    setCurrentColor(color);
  };
  
  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta cor?')) {
      try {
        const { colorService } = await import('@/services/supabaseService');
        const success = await colorService.delete(id);
        
        if (success) {
          const deletedColor = colorsList.find(c => c.id === id);
          setColorsList(colorsList.filter(c => c.id !== id));
          // Mostrar toast de sucesso
          if (deletedColor) {
            showToast(`Cor "${deletedColor.name}" excluída com sucesso!`, 'success');
          } else {
            showToast('Cor excluída com sucesso!', 'success');
          }
        } else {
          // Mostrar toast de erro
          showToast('Erro ao excluir cor. Tente novamente.', 'error');
        }
      } catch (error) {
        console.error('Erro ao excluir cor:', error);
        // Mostrar toast de erro
        showToast('Ocorreu um erro ao excluir a cor. Tente novamente.', 'error');
      }
    }
  };
  
  const resetForm = () => {
    setName('');
    setCollectionId(collections.length > 0 ? collections[0].id : '');
    setHexCode('#000000');
  };
  
  const handleCancel = () => {
    setIsEditing(false);
    setCurrentColor(null);
    resetForm();
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { colorService } = await import('@/services/supabaseService');
      
      if (currentColor) {
        // Atualizar cor existente
        const updates: Partial<Color> = {
          name,
          collectionId,
          hexCode,
        };
        
        console.log('Enviando atualização de cor:', updates);
        
        const success = await colorService.update(currentColor.id, updates);
        
        if (success) {
          // Atualizar a lista local
          setColorsList(colorsList.map(c => 
            c.id === currentColor.id ? { ...c, ...updates } : c
          ));
          console.log('Cor atualizada com sucesso');
          
          // Mostrar toast de sucesso
          showToast(`Cor "${name}" atualizada com sucesso!`, 'success');
        } else {
          // Mostrar toast de erro
          showToast('Erro ao atualizar cor. Tente novamente.', 'error');
        }
      } else {
        // Adicionar nova cor
        const newColor = {
          name,
          collectionId, // Corrigido: usar camelCase para compatibilidade com o serviço
          hexCode, // Corrigido: usar camelCase para compatibilidade com o serviço
        };
        
        console.log('Enviando nova cor:', newColor);
        
        const addedColor = await colorService.add(newColor);
        
        if (addedColor) {
          console.log('Cor adicionada com sucesso:', addedColor);
          setColorsList([...colorsList, addedColor]);
          
          // Mostrar toast de sucesso
          showToast(`Cor "${name}" adicionada com sucesso!`, 'success');
        } else {
          // Mostrar toast de erro
          showToast('Erro ao adicionar cor. Tente novamente.', 'error');
        }
      }
      
      setIsEditing(false);
      setCurrentColor(null);
      resetForm();
    } catch (error) {
      console.error('Erro ao salvar cor:', error);
      // Mostrar toast de erro
      showToast('Ocorreu um erro inesperado. Tente novamente.', 'error');
    }
  };
  
  // Get collection name by ID
  const getCollectionName = (id: string | undefined) => {
    if (!id) return 'Desconhecida';
    const collection = collections.find(c => c.id === id);
    return collection ? collection.name : 'Desconhecida';
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
          <h1 className="text-3xl font-bold text-gray-800">Gerenciar Cores</h1>
        </div>
        
        {!isEditing && (
          <button
            onClick={handleAddNew}
            className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-md transition duration-300"
          >
            Adicionar Nova Cor
          </button>
        )}
      </div>
      
      {isEditing ? (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            {currentColor ? 'Editar Cor' : 'Nova Cor'}
          </h2>
          
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-gray-700 mb-2" htmlFor="name">
                  Nome da Cor *
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
                <label className="block text-gray-700 mb-2" htmlFor="collectionId">
                  Coleção *
                </label>
                <select
                  id="collectionId"
                  value={collectionId}
                  onChange={(e) => setCollectionId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Selecione uma coleção</option>
                  {collections.map((collection) => (
                    <option key={collection.id} value={collection.id}>
                      {collection.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2" htmlFor="hexCode">
                  Código Hexadecimal *
                </label>
                <div className="flex items-center">
                  <input
                    type="color"
                    id="hexCode"
                    value={hexCode}
                    onChange={(e) => setHexCode(e.target.value)}
                    className="w-12 h-10 border border-gray-300 rounded-md mr-2"
                  />
                  <input
                    type="text"
                    value={hexCode}
                    onChange={(e) => setHexCode(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="#RRGGBB"
                    pattern="^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$"
                    required
                  />
                </div>
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
                {currentColor ? 'Atualizar' : 'Salvar'}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Tabela para desktop */}
          <div className="hidden md:block">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nome
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Coleção
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Código Hex
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {colorsList.map((color) => (
                  <tr key={color.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div 
                        className="h-8 w-8 rounded-full border border-gray-200"
                        style={{ backgroundColor: color.hexCode || '#CCCCCC' }}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{color.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{getCollectionName(color.collectionId)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{color.hexCode}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(color)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(color.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Excluir
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Cards para mobile */}
          <div className="md:hidden">
            <div className="grid grid-cols-1 gap-4 p-4">
              {colorsList.map((color) => (
                <div key={color.id} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                  <div className="flex items-center mb-3">
                    <div 
                      className="h-12 w-12 rounded-lg border border-gray-200 flex-shrink-0 shadow-sm"
                      style={{ backgroundColor: color.hexCode || '#CCCCCC' }}
                    />
                    <div className="ml-4 flex-1">
                      <div className="text-base font-medium text-gray-900">{color.name}</div>
                      <div className="text-sm text-gray-500">
                        Coleção: {getCollectionName(color.collectionId)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-3">
                    <div className="text-sm text-gray-500">Código Hex:</div>
                    <div className="text-sm font-mono font-medium text-gray-900">{color.hexCode}</div>
                  </div>
                  
                  <div className="mt-3 flex justify-between border-t border-gray-200 pt-3">
                    <button
                      onClick={() => handleEdit(color)}
                      className="inline-flex items-center px-3 py-1.5 border border-blue-700 text-sm font-medium rounded-md text-blue-700 bg-white hover:bg-blue-100 focus:outline-none"
                    >
                      <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(color.id)}
                      className="inline-flex items-center px-3 py-1.5 border border-red-600 text-sm font-medium rounded-md text-red-600 bg-white hover:bg-red-50 focus:outline-none"
                    >
                      <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Excluir
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {colorsList.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">Nenhuma cor cadastrada.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
