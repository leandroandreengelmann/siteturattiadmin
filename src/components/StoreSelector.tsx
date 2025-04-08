"use client";

import { useState, useEffect } from 'react';
import { Store, Seller } from '@/data/types';
import { storeService, sellerService } from '@/services/supabaseService';
import StoreCard from './StoreCard';
import SellerCard from './SellerCard';
import { BuildingIcon, UsersIcon } from '@/components/Icons';
import { FaArrowLeft } from 'react-icons/fa';

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

  useEffect(() => {
    // Adicionar classe ao body para prevenir o scroll quando o modal estiver aberto
    document.body.style.overflow = 'hidden';
    
    const fetchStores = async () => {
      try {
        setLoading(true);
        const storesData = await storeService.getActive();
        setStores(storesData);
        setError('');
      } catch (err) {
        console.error('Erro ao carregar lojas:', err);
        setError('Não foi possível carregar as lojas. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
    
    // Cleanup function para restaurar o scroll quando o componente for desmontado
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleStoreSelect = async (store: Store) => {
    setSelectedStore(store);
    setLoading(true);
    
    try {
      const sellersData = await sellerService.getByStore(store.id);
      setSellers(sellersData);
      setError('');
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
        <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
        <div className="relative flex items-center justify-center min-h-screen p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-4">Seleção de Lojas</h2>
              <p className="text-gray-600 mb-6">
                Não há lojas disponíveis no momento. Tente novamente mais tarde.
              </p>
              {onClose && (
                <button
                  onClick={onClose}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors duration-300"
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
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      <div className="relative flex items-center justify-center min-h-screen p-4">
        <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
          {/* Cabeçalho */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              {selectedStore ? (
                <UsersIcon className="h-6 w-6 text-blue-600 mr-2" />
              ) : (
                <BuildingIcon className="h-6 w-6 text-blue-600 mr-2" />
              )}
              <h2 className="text-xl font-semibold">
                {selectedStore ? `Vendedores - ${selectedStore.name}` : 'Selecione uma Loja'}
              </h2>
            </div>
            {selectedStore ? (
              <button
                onClick={handleBackToStores}
                className="text-gray-600 hover:text-gray-800 transition-colors duration-300"
                aria-label="Voltar para seleção de lojas"
              >
                <FaArrowLeft size={18} />
              </button>
            ) : onClose ? (
              <button
                onClick={onClose}
                className="text-gray-600 hover:text-gray-800 transition-colors duration-300"
                aria-label="Fechar seleção de lojas"
              >
                &times;
              </button>
            ) : null}
          </div>

          {/* Conteúdo */}
          {loading ? (
            <div className="text-center py-8">
              <p>Carregando...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-500">{error}</p>
              <button
                onClick={selectedStore ? handleBackToStores : () => window.location.reload()}
                className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors duration-300"
              >
                {selectedStore ? 'Voltar' : 'Tentar Novamente'}
              </button>
            </div>
          ) : selectedStore ? (
            // Lista de vendedores da loja selecionada
            <div className="space-y-2">
              {sellers.length === 0 ? (
                <p className="text-center py-4 text-gray-600">
                  Não há vendedores disponíveis nesta loja.
                </p>
              ) : (
                sellers.map(seller => (
                  <SellerCard key={seller.id} seller={seller} prefilledText={prefilledText} />
                ))
              )}
            </div>
          ) : (
            // Grade de lojas para seleção
            <div className="grid grid-cols-2 gap-4">
              {stores.map(store => (
                <StoreCard key={store.id} store={store} onClick={handleStoreSelect} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 