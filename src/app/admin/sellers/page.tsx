'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useToast } from '@/components/ToastProvider';
import { Seller, Store } from '@/data/types';
import { sellerService, storeService } from '@/services/localDataService';

export default function AdminSellersPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [sellersList, setSellersList] = useState<Seller[]>([]);
  const [storesList, setStoresList] = useState<Store[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentSeller, setCurrentSeller] = useState<Seller | null>(null);
  
  // Dados do formulário
  const [name, setName] = useState('');
  const [storeId, setStoreId] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [isActive, setIsActive] = useState(true);
  
  useEffect(() => {
    async function init() {
      try {
        // Carregar vendedores e lojas
        const sellers = await sellerService.getAll();
        setSellersList(sellers);
        
        const stores = await storeService.getAll();
        setStoresList(stores);
      } catch (error) {
        console.error('Erro ao inicializar a página de vendedores:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    init();
  }, []);

  // Adicionar novo vendedor
  const handleAddNew = () => {
    setIsEditing(true);
    setCurrentSeller(null);
    resetForm();
  };

  // Editar vendedor existente
  const handleEdit = (seller: Seller) => {
    setCurrentSeller(seller);
    setName(seller.name);
    setStoreId(seller.storeId);
    setWhatsapp(seller.whatsapp);
    setIsActive(seller.isActive !== false);
    setIsEditing(true);
  };

  // Excluir vendedor
  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este vendedor?')) {
      try {
        const success = await sellerService.delete(id);
        
        if (success) {
          setSellersList(sellersList.filter(s => s.id !== id));
          showToast('Vendedor excluído com sucesso!', 'success');
        } else {
          showToast('Erro ao excluir vendedor. Tente novamente.', 'error');
        }
      } catch (error) {
        console.error('Erro ao excluir vendedor:', error);
        showToast('Ocorreu um erro inesperado. Tente novamente.', 'error');
      }
    }
  };

  // Resetar formulário
  const resetForm = () => {
    setName('');
    setStoreId('');
    setWhatsapp('');
    setIsActive(true);
  };

  // Cancelar edição
  const handleCancel = () => {
    setIsEditing(false);
    setCurrentSeller(null);
    resetForm();
  };

  // Submeter formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const sellerData = {
        name,
        storeId,
        whatsapp,
        isActive
      };
      
      if (currentSeller) {
        // Atualizar vendedor existente
        const updatedSeller = await sellerService.update(currentSeller.id, sellerData);
        
        if (updatedSeller) {
          // Atualizar a lista local
          setSellersList(sellersList.map(s => 
            s.id === currentSeller.id ? { ...s, ...sellerData } : s
          ));
          
          showToast(`Vendedor "${name}" atualizado com sucesso!`, 'success');
        } else {
          showToast('Erro ao atualizar vendedor. Tente novamente.', 'error');
        }
      } else {
        // Adicionar novo vendedor
        const newSeller = await sellerService.add(sellerData);
        
        if (newSeller) {
          setSellersList([...sellersList, newSeller]);
          showToast(`Vendedor "${name}" adicionado com sucesso!`, 'success');
        } else {
          showToast('Erro ao adicionar vendedor. Tente novamente.', 'error');
        }
      }
      
      setIsEditing(false);
      setCurrentSeller(null);
      resetForm();
    } catch (error) {
      console.error('Erro ao salvar vendedor:', error);
      showToast('Ocorreu um erro inesperado. Tente novamente.', 'error');
    }
  };
  
  // Obter nome da loja pelo ID
  const getStoreName = (id: string) => {
    const store = storesList.find(store => store.id === id);
    return store ? store.name : 'Loja não encontrada';
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
          <h1 className="text-3xl font-bold text-gray-800">Gerenciar Vendedores</h1>
        </div>
        
        {!isEditing && (
          <button
            onClick={handleAddNew}
            className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-md transition duration-300"
          >
            Adicionar Novo Vendedor
          </button>
        )}
      </div>
      
      {isEditing ? (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            {currentSeller ? 'Editar Vendedor' : 'Novo Vendedor'}
          </h2>
          
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-gray-700 mb-2" htmlFor="name">
                  Nome do Vendedor *
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
                <label className="block text-gray-700 mb-2" htmlFor="storeId">
                  Loja *
                </label>
                <select
                  id="storeId"
                  value={storeId}
                  onChange={(e) => setStoreId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Selecione uma loja</option>
                  {storesList.map((store) => (
                    <option key={store.id} value={store.id}>
                      {store.name} - {store.city}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2" htmlFor="whatsapp">
                  WhatsApp *
                </label>
                <input
                  type="tel"
                  id="whatsapp"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  placeholder="+5511999999999"
                />
              </div>
              
              <div>
                <label className="flex items-center cursor-pointer mt-8">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={() => setIsActive(!isActive)}
                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="ml-2 text-gray-700">Vendedor Ativo</span>
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
                {currentSeller ? 'Atualizar' : 'Salvar'}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sellersList.map((seller) => (
            <div key={seller.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-5">
                <h3 className="text-lg font-semibold text-gray-800">{seller.name}</h3>
                <p className="text-sm text-gray-600 mt-2">Loja: {getStoreName(seller.storeId)}</p>
                
                <p className="text-sm text-gray-600 mt-1">
                  <span className="font-medium">WhatsApp:</span> {seller.whatsapp}
                </p>
                
                <div className="mt-3">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    seller.isActive !== false
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {seller.isActive !== false ? 'Ativo' : 'Inativo'}
                  </span>
                </div>
                
                <div className="flex justify-between mt-4 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => handleEdit(seller)}
                    className="inline-flex items-center px-3 py-1.5 border border-blue-700 text-sm font-medium rounded-md text-blue-700 bg-white hover:bg-blue-100 focus:outline-none"
                  >
                    <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Editar
                  </button>
                  
                  <button
                    onClick={() => handleDelete(seller.id)}
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
          
          {sellersList.length === 0 && (
            <div className="col-span-full text-center py-8">
              <p className="text-gray-500">Nenhum vendedor cadastrado.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 