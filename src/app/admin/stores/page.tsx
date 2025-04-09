'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useToast } from '@/components/ToastProvider';
import { Store } from '@/data/types';
import { storeService } from '@/services/localDataService';

export default function AdminStoresPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [storesList, setStoresList] = useState<Store[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentStore, setCurrentStore] = useState<Store | null>(null);
  
  // Dados do formulário
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [phone, setPhone] = useState('');
  const [hours, setHours] = useState('');
  const [isActive, setIsActive] = useState(true);
  
  useEffect(() => {
    async function init() {
      try {
        // Carregar lojas
        const stores = await storeService.getAll();
        setStoresList(stores);
      } catch (error) {
        console.error('Erro ao inicializar a página de lojas:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    init();
  }, []);

  // Adicionar nova loja
  const handleAddNew = () => {
    setIsEditing(true);
    setCurrentStore(null);
    resetForm();
  };

  // Editar loja existente
  const handleEdit = (store: Store) => {
    setCurrentStore(store);
    setName(store.name);
    setCity(store.city);
    setPhone(store.phone || '');
    setHours(store.hours || '');
    setIsActive(store.isActive !== false);
    setIsEditing(true);
  };

  // Excluir loja
  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta loja?')) {
      try {
        const success = await storeService.delete(id);
        
        if (success) {
          setStoresList(storesList.filter(s => s.id !== id));
          showToast('Loja excluída com sucesso!', 'success');
        } else {
          showToast('Erro ao excluir loja. Tente novamente.', 'error');
        }
      } catch (error) {
        console.error('Erro ao excluir loja:', error);
        showToast('Ocorreu um erro inesperado. Tente novamente.', 'error');
      }
    }
  };

  // Resetar formulário
  const resetForm = () => {
    setName('');
    setCity('');
    setPhone('');
    setHours('');
    setIsActive(true);
  };

  // Cancelar edição
  const handleCancel = () => {
    setIsEditing(false);
    setCurrentStore(null);
    resetForm();
  };

  // Submeter formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const storeData = {
        name,
        city,
        phone,
        hours,
        isActive
      };
      
      if (currentStore) {
        // Atualizar loja existente
        const updatedStore = await storeService.update(currentStore.id, storeData);
        
        if (updatedStore) {
          // Atualizar a lista local
          setStoresList(storesList.map(s => 
            s.id === currentStore.id ? { ...s, ...storeData } : s
          ));
          
          showToast(`Loja "${name}" atualizada com sucesso!`, 'success');
        } else {
          showToast('Erro ao atualizar loja. Tente novamente.', 'error');
        }
      } else {
        // Adicionar nova loja
        const newStore = await storeService.add(storeData);
        
        if (newStore) {
          setStoresList([...storesList, newStore]);
          showToast(`Loja "${name}" adicionada com sucesso!`, 'success');
        } else {
          showToast('Erro ao adicionar loja. Tente novamente.', 'error');
        }
      }
      
      setIsEditing(false);
      setCurrentStore(null);
      resetForm();
    } catch (error) {
      console.error('Erro ao salvar loja:', error);
      showToast('Ocorreu um erro inesperado. Tente novamente.', 'error');
    }
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
                <label className="block text-gray-700 mb-2" htmlFor="phone">
                  Telefone *
                </label>
                <input
                  type="tel"
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
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
              
              <div className="md:col-span-2">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={() => setIsActive(!isActive)}
                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="ml-2 text-gray-700">Loja em funcionamento</span>
                </label>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {storesList.map((store) => (
            <div key={store.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-5">
                <h3 className="text-lg font-semibold text-gray-800">{store.name}</h3>
                <p className="text-sm text-gray-600 mt-2">{store.city}</p>
                
                {store.phone && (
                  <p className="text-sm text-gray-600 mt-1">
                    <span className="font-medium">Telefone:</span> {store.phone}
                  </p>
                )}
                
                {store.hours && (
                  <p className="text-sm text-gray-600 mt-1">
                    <span className="font-medium">Horário:</span> {store.hours}
                  </p>
                )}
                
                <div className="mt-3">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    store.isActive !== false
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {store.isActive !== false ? 'Em funcionamento' : 'Fechada'}
                  </span>
                </div>
                
                <div className="flex justify-between mt-4 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => handleEdit(store)}
                    className="inline-flex items-center px-3 py-1.5 border border-blue-700 text-sm font-medium rounded-md text-blue-700 bg-white hover:bg-blue-100 focus:outline-none"
                  >
                    <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Editar
                  </button>
                  
                  <button
                    onClick={() => handleDelete(store.id)}
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
          
          {storesList.length === 0 && (
            <div className="col-span-full text-center py-8">
              <p className="text-gray-500">Nenhuma loja cadastrada.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
