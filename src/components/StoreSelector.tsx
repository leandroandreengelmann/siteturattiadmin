"use client";

import { useState, useEffect } from 'react';
import { Store, Seller } from '@/data/types';
import { storeService, sellerService } from '@/services/supabaseService';
import StoreCard from './StoreCard';
import SellerCard from './SellerCard';

interface StoreSelectorProps {
  onClose?: () => void;
  prefilledText?: string;
}

export default function StoreSelector({ onClose, prefilledText }: StoreSelectorProps) {
  const [stores, setStores] = useState<Store[]>([]);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Adicionar classe ao body para prevenir o scroll quando o modal estiver aberto
    document.body.style.overflow = 'hidden';
    
    const fetchStores = async () => {
      try {
        setLoading(true);
        const storesData = await storeService.getActive();
        
        // Verificar se os dados são válidos antes de atualizar o estado
        if (Array.isArray(storesData)) {
          setStores(storesData);
          setError('');
        } else {
          console.error('Formato de dados de lojas inválido:', storesData);
          setError('Dados de lojas em formato inválido. Por favor, tente novamente.');
        }
      } catch (err) {
        console.error('Erro ao carregar lojas:', err);
        setError('Não foi possível carregar as lojas. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
        // Adicionar um pequeno atraso para a animação
        setTimeout(() => setIsOpen(true), 100);
      }
    };

    fetchStores();
    
    // Configurar manipulador de tecla Escape
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && onClose) {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    
    // Cleanup function para restaurar o scroll e remover event listeners
    return () => {
      document.body.style.overflow = 'unset';
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  const handleStoreSelect = async (store: Store) => {
    if (!store || !store.id) {
      console.error('Tentativa de selecionar loja inválida:', store);
      setError('Loja selecionada inválida. Por favor, selecione outra loja.');
      return;
    }

    setSelectedStore(store);
    setLoading(true);
    
    try {
      const sellersData = await sellerService.getByStore(store.id);
      
      // Verificar se os dados são válidos antes de atualizar o estado
      if (Array.isArray(sellersData)) {
        setSellers(sellersData);
        setError('');
      } else {
        console.error('Formato de dados de vendedores inválido:', sellersData);
        setError('Dados de vendedores em formato inválido. Por favor, tente novamente.');
      }
    } catch (err) {
      console.error(`Erro ao carregar vendedores da loja ${store.id}:`, err);
      setError('Não foi possível carregar os vendedores. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToStores = () => {
    setSelectedStore(null);
    setSellers([]);
  };

  // View inicial - Botão para selecionar loja
  if (!selectedStore && stores.length === 0 && !loading) {
    return (
      <div className="fixed inset-0 z-50">
        <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity duration-300" onClick={onClose}></div>
        <div className="relative flex items-center justify-center min-h-screen p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full transform transition-all duration-300 scale-100 opacity-100">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-4">Seleção de Lojas</h2>
              <p className="text-gray-600 mb-6">
                Não há lojas disponíveis no momento. Tente novamente mais tarde.
              </p>
              {onClose && (
                <button
                  onClick={onClose}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2"
                >
                  Fechar
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // View principal
  return (
    <div className="fixed inset-0 z-50">
      <div 
        className={`absolute inset-0 bg-black transition-all duration-300 ${isOpen ? 'bg-opacity-60 backdrop-blur-sm' : 'bg-opacity-0'}`} 
        onClick={onClose}
      ></div>
      <div className="relative flex items-center justify-center min-h-screen p-4">
        <div 
          className={`bg-white rounded-lg shadow-xl p-6 max-w-md w-full transform transition-all duration-300 ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`} 
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="store-selector-title"
        >
          {/* Cabeçalho */}
          <div className="mb-6">
            <h2 
              id="store-selector-title"
              className="text-xl font-semibold text-center"
            >
              {selectedStore ? `Vendedores - ${selectedStore.name}` : 'Selecione uma Loja'}
            </h2>
          </div>

          {/* Conteúdo */}
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-r-transparent align-[-0.125em]" role="status">
                <span className="sr-only">Carregando...</span>
              </div>
              <p className="mt-2 text-gray-600">Carregando...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-500 mb-3">{error}</p>
              <button
                onClick={selectedStore ? handleBackToStores : () => window.location.reload()}
                className="bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
              >
                {selectedStore ? 'Voltar' : 'Tentar Novamente'}
              </button>
            </div>
          ) : selectedStore ? (
            // Lista de vendedores da loja selecionada
            <div className="space-y-3">
              {sellers.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-gray-600 mb-3">
                    Não há vendedores disponíveis nesta loja.
                  </p>
                  <button
                    onClick={handleBackToStores}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
                  >
                    Voltar para lojas
                  </button>
                </div>
              ) : (
                sellers.map(seller => (
                  <SellerCard 
                    key={seller.id} 
                    seller={seller} 
                    prefilledText={prefilledText} 
                    onBack={handleBackToStores}
                  />
                ))
              )}
            </div>
          ) : (
            // Grade de lojas para seleção
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              {stores.map(store => (
                <StoreCard 
                  key={store.id} 
                  store={store} 
                  onClick={handleStoreSelect} 
                  onClose={onClose}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 