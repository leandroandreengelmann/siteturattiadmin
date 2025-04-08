'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Seller, Store } from '@/data/types';
import { useToast } from '@/components/ToastProvider';

export default function AdminSellersPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [sellersList, setSellersList] = useState<Seller[]>([]);
  const [storesList, setStoresList] = useState<Store[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentSeller, setCurrentSeller] = useState<Seller | null>(null);
  const { showToast } = useToast();
  
  // Form state
  const [name, setName] = useState('');
  const [storeId, setStoreId] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [isActive, setIsActive] = useState(true);
  
  // Check if user is authenticated and load sellers and stores
  useEffect(() => {
    async function init() {
      try {
        // Verificar autenticação com Supabase
        const { authService, sellerService, storeService } = await import('@/services/supabaseService');
        const session = await authService.getSession();
        
        if (!session) {
          // Redirecionar para a página inicial se não estiver autenticado
          router.push('/');
          return;
        }
        
        setIsAuthenticated(true);
        
        // Carregar vendedores e lojas do Supabase em paralelo
        const [sellersData, storesData] = await Promise.all([
          sellerService.getAll(),
          storeService.getAll()
        ]);
        
        setSellersList(sellersData);
        setStoresList(storesData);
      } catch (error) {
        console.error('Erro ao verificar autenticação ou carregar dados:', error);
        router.push('/');
      }
    }
    
    init();
  }, [router]);
  
  // Set form data when editing a seller
  useEffect(() => {
    if (currentSeller) {
      setName(currentSeller.name);
      setStoreId(currentSeller.storeId);
      setWhatsapp(currentSeller.whatsapp);
      setIsActive(currentSeller.isActive !== false);
    }
  }, [currentSeller]);
  
  const handleAddNew = () => {
    setIsEditing(true);
    setCurrentSeller(null);
    resetForm();
    
    // Se houver lojas, selecionar a primeira por padrão
    if (storesList.length > 0) {
      setStoreId(storesList[0].id);
    }
  };
  
  const handleEdit = (seller: Seller) => {
    setIsEditing(true);
    setCurrentSeller(seller);
  };
  
  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este vendedor?')) {
      try {
        const { sellerService } = await import('@/services/supabaseService');
        const success = await sellerService.delete(id);
        
        if (success) {
          // Encontrar o nome do vendedor para exibir no toast
          const deletedSeller = sellersList.find(s => s.id === id);
          
          // Atualizar a lista local
          setSellersList(sellersList.filter(s => s.id !== id));
          
          // Mostrar toast de sucesso
          if (deletedSeller) {
            showToast(`Vendedor "${deletedSeller.name}" excluído com sucesso!`, 'success');
          } else {
            showToast('Vendedor excluído com sucesso!', 'success');
          }
        } else {
          // Mostrar toast de erro
          showToast('Erro ao excluir o vendedor. Tente novamente.', 'error');
        }
      } catch (error) {
        console.error('Erro ao excluir vendedor:', error);
        // Mostrar toast de erro
        showToast('Ocorreu um erro ao excluir o vendedor. Tente novamente.', 'error');
      }
    }
  };
  
  const resetForm = () => {
    setName('');
    setStoreId('');
    setWhatsapp('');
    setIsActive(true);
  };
  
  const handleCancel = () => {
    setIsEditing(false);
    setCurrentSeller(null);
    resetForm();
  };
  
  const formatWhatsApp = (input: string) => {
    // Remover tudo que não for dígito
    const numbers = input.replace(/\D/g, '');
    
    // Garantir que tenha o código do país (Brasil - 55)
    if (!numbers.startsWith('55') && numbers.length > 0) {
      return `55${numbers}`;
    }
    
    return numbers;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { sellerService } = await import('@/services/supabaseService');
      
      // Formatar o número do WhatsApp
      const formattedWhatsapp = formatWhatsApp(whatsapp);
      
      const sellerData = {
        name,
        storeId,
        whatsapp: formattedWhatsapp,
        isActive
      };
      
      if (currentSeller) {
        // Atualizar vendedor existente no Supabase
        const success = await sellerService.update(currentSeller.id, sellerData);
        
        if (success) {
          // Atualizar a lista local
          setSellersList(prevSellers => 
            prevSellers.map(s => s.id === currentSeller.id ? { ...s, ...sellerData } : s)
          );
          
          // Mostrar toast de sucesso
          showToast(`Vendedor "${name}" atualizado com sucesso!`, 'success');
        } else {
          // Mostrar toast de erro
          showToast('Erro ao atualizar o vendedor. Tente novamente.', 'error');
        }
      } else {
        // Adicionar novo vendedor no Supabase
        const newSeller = await sellerService.add(sellerData);
        
        if (newSeller) {
          // Adicionar à lista local
          setSellersList(prevSellers => [...prevSellers, newSeller]);
          
          // Mostrar toast de sucesso
          showToast(`Vendedor "${name}" adicionado com sucesso!`, 'success');
        } else {
          // Mostrar toast de erro
          showToast('Erro ao adicionar o vendedor. Tente novamente.', 'error');
        }
      }
      
      // Reset form
      setIsEditing(false);
      setCurrentSeller(null);
      resetForm();
    } catch (error) {
      console.error('Erro ao salvar vendedor:', error);
      // Mostrar toast de erro
      showToast('Ocorreu um erro ao salvar o vendedor. Tente novamente.', 'error');
    }
  };
  
  // Função para buscar o nome da loja pelo ID
  const getStoreName = (id: string) => {
    const store = storesList.find(s => s.id === id);
    return store ? store.name : 'Loja não encontrada';
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
          <h1 className="text-3xl font-bold text-gray-800">Gerenciar Vendedores</h1>
        </div>
        
        {!isEditing && (
          <button
            onClick={handleAddNew}
            className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-md transition duration-300"
            disabled={storesList.length === 0}
            title={storesList.length === 0 ? "É necessário cadastrar pelo menos uma loja primeiro" : ""}
          >
            Adicionar Novo Vendedor
          </button>
        )}
      </div>
      
      {storesList.length === 0 && !isEditing && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                Para cadastrar vendedores, você precisa primeiro cadastrar pelo menos uma loja.
              </p>
              <div className="mt-2">
                <Link 
                  href="/admin/stores" 
                  className="text-yellow-700 underline hover:text-yellow-600"
                >
                  Ir para o gerenciamento de lojas
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
      
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
                  {storesList.map(store => (
                    <option key={store.id} value={store.id}>
                      {store.name} ({store.city})
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2" htmlFor="whatsapp">
                  WhatsApp *
                </label>
                <input
                  type="text"
                  id="whatsapp"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: 5565999998888"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Formato: 55 (Brasil) + DDD + número. Ex: 5565999998888
                </p>
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2">
                  Status
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isActive" className="text-gray-700">
                    Ativo
                  </label>
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
                {currentSeller ? 'Atualizar' : 'Salvar'}
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
                  Loja
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  WhatsApp
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {sellersList.map((seller) => (
                <tr key={seller.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{seller.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{getStoreName(seller.storeId)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{seller.whatsapp}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        seller.isActive !== false
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {seller.isActive !== false ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEdit(seller)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(seller.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {sellersList.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">Nenhum vendedor cadastrado.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 