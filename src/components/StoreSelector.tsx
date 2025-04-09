"use client";

import { useState, useEffect } from 'react';
import { storeService, sellerService } from '@/services/localDataService';
import { Store, Seller } from '@/data/types';

interface StoreSelectorProps {
  onStoreSelect?: (storeId: string) => void;
  onSellerSelect?: (sellerId: string) => void;
  prefilledText?: string;
}

export default function StoreSelector({ onStoreSelect, onSellerSelect, prefilledText }: StoreSelectorProps) {
  const [stores, setStores] = useState<Store[]>([]);
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [selectedStoreId, setSelectedStoreId] = useState<string>('');
  const [selectedSellerId, setSelectedSellerId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Carregar todas as lojas
  useEffect(() => {
    async function loadStores() {
      try {
        setIsLoading(true);
        const storesData = await storeService.getAll();
        setStores(storesData.filter(store => store.isActive !== false));
        setError('');
      } catch (error) {
        console.error('Erro ao carregar lojas:', error);
        setError('Erro ao carregar lojas. Por favor, tente novamente.');
      } finally {
        setIsLoading(false);
      }
    }

    loadStores();
  }, []);

  // Carregar vendedores quando uma loja for selecionada
  useEffect(() => {
    async function loadSellers() {
      if (!selectedStoreId) {
        setSellers([]);
        return;
      }

      try {
        setIsLoading(true);
        const sellersData = await sellerService.getByStoreId(selectedStoreId);
        setSellers(sellersData.filter(seller => seller.isActive !== false));
        setError('');
      } catch (error) {
        console.error('Erro ao carregar vendedores:', error);
        setError('Erro ao carregar vendedores. Por favor, tente novamente.');
      } finally {
        setIsLoading(false);
      }
    }

    loadSellers();
  }, [selectedStoreId]);

  // Enviar a loja selecionada para o componente pai
  const handleStoreChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const storeId = e.target.value;
    setSelectedStoreId(storeId);
    setSelectedSellerId(''); // Resetar o vendedor selecionado
    if (onStoreSelect) {
      onStoreSelect(storeId);
    }
  };

  // Enviar o vendedor selecionado para o componente pai
  const handleSellerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sellerId = e.target.value;
    setSelectedSellerId(sellerId);
    if (onSellerSelect) {
      onSellerSelect(sellerId);
    }
  };

  if (isLoading && stores.length === 0) {
    return <div className="animate-pulse h-10 bg-gray-200 rounded"></div>;
  }

  if (error) {
    return <div className="text-red-500 text-sm">{error}</div>;
  }

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="store" className="block text-sm font-medium text-gray-700 mb-1">
          Selecione uma loja
        </label>
        <select
          id="store"
          value={selectedStoreId}
          onChange={handleStoreChange}
          className="block w-full p-2 border border-gray-300 rounded-md"
        >
          <option value="">Escolha uma loja</option>
          {stores.map((store) => (
            <option key={store.id} value={store.id}>
              {store.name} - {store.city}
            </option>
          ))}
        </select>
      </div>

      {selectedStoreId && (
        <div>
          <label htmlFor="seller" className="block text-sm font-medium text-gray-700 mb-1">
            Falar com qual vendedor?
          </label>
          <select
            id="seller"
            value={selectedSellerId}
            onChange={handleSellerChange}
            className="block w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="">Escolha um vendedor</option>
            {sellers.map((seller) => (
              <option key={seller.id} value={seller.id}>
                {seller.name}
              </option>
            ))}
          </select>
          {selectedSellerId && prefilledText && (
            <div className="mt-4 p-3 bg-blue-50 rounded-md">
              <p className="text-sm text-gray-700">
                Mensagem: <span className="font-medium">{prefilledText}</span>
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 