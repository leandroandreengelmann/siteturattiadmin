'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { stores } from '@/data/sampleData';
import { Store } from '@/data/types';
import { useToast } from '@/components/ToastProvider';

export default function AdminStoresPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [storesList, setStoresList] = useState<Store[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentStore, setCurrentStore] = useState<Store | null>(null);
  const { showToast } = useToast();
  
  // Form state
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [phone, setPhone] = useState('');
  const [hours, setHours] = useState('');
  
  // Check if user is authenticated and load stores
  useEffect(() => {
    async function init() {
      try {
        // Verificar autenticação com Supabase
        const { authService, storeService } = await import('@/services/supabaseService');
        const session = await authService.getSession();
        
        if (!session) {
          // Redirecionar para a página inicial se não estiver autenticado
          router.push('/');
          return;
        }
        
        setIsAuthenticated(true);
        
        // Carregar lojas do Supabase
        const storesData = await storeService.getAll();
        setStoresList(storesData);
      } catch (error) {
        console.error('Erro ao verificar autenticação ou carregar lojas:', error);
        router.push('/');
      }
    }
    
    init();
  }, [router]);
  
  // Set form data when editing a store
  useEffect(() => {
    if (currentStore) {
      setName(currentStore.name);
      setCity(currentStore.city);
      setPhone(currentStore.phone);
      setHours(currentStore.hours || '');
    }
  }, [currentStore]);
  
  const handleAddNew = () => {
    setIsEditing(true);
    setCurrentStore(null);
    resetForm();
  };
  
  const handleEdit = (store: Store) => {
    setIsEditing(true);
    setCurrentStore(store);
  };
  
  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta loja?')) {
      try {
        const { storeService } = await import('@/services/supabaseService');
        const success = await storeService.delete(id);
        
        if (success) {
          // Encontrar o nome da loja para exibir no toast
          const deletedStore = storesList.find(s => s.id === id);
          
          // Atualizar a lista local
          setStoresList(storesList.filter(s => s.id !== id));
          
          // Mostrar toast de sucesso
          if (deletedStore) {
            showToast(`Loja "${deletedStore.name}" excluída com sucesso!`, 'success');
          } else {
            showToast('Loja excluída com sucesso!', 'success');
          }
        } else {
          // Mostrar toast de erro
          showToast('Erro ao excluir a loja. Tente novamente.', 'error');
        }
      } catch (error) {
        console.error('Erro ao excluir loja:', error);
        // Mostrar toast de erro
        showToast('Ocorreu um erro ao excluir a loja. Tente novamente.', 'error');
      }
    }
  };
  
  const resetForm = () => {
    setName('');
    setCity('');
    setPhone('');
    setHours('');
  };
  
  const handleCancel = () => {
    setIsEditing(false);
    setCurrentStore(null);
    resetForm();
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { storeService } = await import('@/services/supabaseService');
      
      const storeData = {
        name,
        city,
        phone,
        hours
      };
      
      if (currentStore) {
        // Atualizar loja existente no Supabase
        const success = await storeService.update(currentStore.id, storeData);
        
        if (success) {
          // Atualizar a lista local
          setStoresList(prevStores => 
            prevStores.map(s => s.id === currentStore.id ? { ...storeData, id: currentStore.id } : s)
          );
          
          // Mostrar toast de sucesso
          showToast(`Loja "${name}" atualizada com sucesso!`, 'success');
        } else {
          // Mostrar toast de erro
          showToast('Erro ao atualizar a loja. Tente novamente.', 'error');
        }
      } else {
        // Adicionar nova loja no Supabase
        const newStore = await storeService.add(storeData);
        
        if (newStore) {
          // Adicionar à lista local
          setStoresList(prevStores => [...prevStores, newStore]);
          
          // Mostrar toast de sucesso
          showToast(`Loja "${name}" adicionada com sucesso!`, 'success');
        } else {
          // Mostrar toast de erro
          showToast('Erro ao adicionar a loja. Tente novamente.', 'error');
        }
      }
      
      // Reset form
      setIsEditing(false);
      setCurrentStore(null);
      resetForm();
    } catch (error) {
      console.error('Erro ao salvar loja:', error);
      // Mostrar toast de erro
      showToast('Ocorreu um erro ao salvar a loja. Tente novamente.', 'error');
    }
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
          <h1 className="text-3xl font-bold text-gray-800">Gerenciar Lojas</h1>
        </div>
        
        {!isEditing && (
          <button
            onClick={handleAddNew}
            className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-md transition duration-300"
          >
            Adicionar Nova Loja
          </button>
        )}
      </div>
      
      {isEditing ? (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            {currentStore ? 'Editar Loja' : 'Nova Loja'}
          </h2>
          
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-gray-700 mb-2" htmlFor="name">
                  Nome da Loja *
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
                <label className="block text-gray-700 mb-2" htmlFor="city">
                  Cidade *
                </label>
                <input
                  type="text"
                  id="city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2" htmlFor="phone">
                  Telefone *
                </label>
                <input
                  type="text"
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="(00) 0000-0000"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2" htmlFor="hours">
                  Horário de Funcionamento
                </label>
                <input
                  type="text"
                  id="hours"
                  value={hours}
                  onChange={(e) => setHours(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Segunda a Sábado: 8h às 18h"
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
                {currentStore ? 'Atualizar' : 'Salvar'}
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
                  Nome
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cidade
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Telefone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Horário
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {storesList.map((store) => (
                <tr key={store.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{store.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{store.city}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{store.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{store.hours || '-'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEdit(store)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(store.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {storesList.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">Nenhuma loja cadastrada.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
