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
