'use client';

import React, { useState, useEffect } from 'react';
import { FaStore, FaWhatsapp, FaArrowLeft, FaTimes } from 'react-icons/fa';
import { RiMapPinLine, RiPhoneLine } from 'react-icons/ri';
import { Store, Seller } from '@/data/types';
import { storeService, sellerService } from '@/services/localDataService';

interface StoreSellerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function StoreSellerModal({ isOpen, onClose }: StoreSellerModalProps) {
  const [stores, setStores] = useState<Store[]>([]);
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<'stores' | 'sellers'>('stores');
  
  // Carregar lojas quando o modal é aberto
  useEffect(() => {
    if (isOpen) {
      loadStores();
    }
  }, [isOpen]);
  
  // Carregar vendedores quando uma loja é selecionada
  useEffect(() => {
    if (selectedStore) {
      loadSellers(selectedStore.id);
    }
  }, [selectedStore]);
  
  const loadStores = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const activeStores = await storeService.getAll();
      setStores(activeStores.filter(store => store.isActive));
    } catch (err) {
      setError('Erro ao carregar lojas. Tente novamente.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const loadSellers = async (storeId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const storeSellers = await sellerService.getByStoreId(storeId);
      setSellers(storeSellers.filter(seller => seller.isActive));
    } catch (err) {
      setError('Erro ao carregar vendedores. Tente novamente.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const formatWhatsAppUrl = (phoneNumber: string, message: string) => {
    // Garantir que o número esteja no formato internacional
    const formattedPhone = phoneNumber.startsWith('+') 
      ? phoneNumber.replace(/\D/g, '') 
      : `55${phoneNumber.replace(/\D/g, '')}`;
    
    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${formattedPhone}?text=${encodedMessage}`;
  };
  
  const handleSelectStore = (store: Store) => {
    setSelectedStore(store);
    setStep('sellers');
  };
  
  const handleBack = () => {
    setStep('stores');
    setSellers([]);
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-slate-50 to-white rounded-xl shadow-xl w-full max-w-md overflow-hidden border border-slate-100 transition-all duration-300">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 flex items-center justify-between">
          <h3 className="text-xl font-medium">
            {step === 'stores' ? 'Selecione uma Loja' : 'Selecione um Vendedor'}
          </h3>
          <button 
            onClick={onClose}
            className="text-white hover:text-blue-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-100 focus:ring-opacity-50 rounded-full p-1"
          >
            <FaTimes size={18} />
          </button>
        </div>
        
        {/* Body */}
        <div className="p-6">
          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-100 flex items-center">
              <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path>
              </svg>
              <span>{error}</span>
            </div>
          )}
          
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <>
              {step === 'stores' ? (
                <>
                  {stores.length === 0 ? (
                    <div className="text-center py-8 px-4">
                      <svg className="w-12 h-12 mx-auto text-slate-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                      </svg>
                      <p className="text-slate-500 text-lg">
                        Nenhuma loja disponível no momento.
                      </p>
                    </div>
                  ) : (
                    <ul className="space-y-3">
                      {stores.map((store) => (
                        <li key={store.id}>
                          <button
                            onClick={() => handleSelectStore(store)}
                            className="w-full flex items-center p-4 border border-slate-200 rounded-xl hover:bg-blue-50 hover:border-blue-200 transition-all duration-200 shadow-sm hover:shadow"
                          >
                            <div className="flex-shrink-0 bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-full shadow-inner">
                              <FaStore className="text-white" size={20} />
                            </div>
                            <div className="ml-4 text-left flex-1">
                              <h4 className="font-medium text-slate-800 text-lg">{store.name}</h4>
                              <div className="flex items-center text-slate-500 mt-1">
                                <RiMapPinLine className="mr-1 text-blue-500" />
                                <p>{store.city}</p>
                              </div>
                              {store.phone && (
                                <div className="flex items-center text-slate-500 mt-1">
                                  <RiPhoneLine className="mr-1 text-blue-500" />
                                  <p>{store.phone}</p>
                                </div>
                              )}
                            </div>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              ) : (
                <>
                  {selectedStore && (
                    <div className="mb-6 bg-blue-50 p-4 rounded-lg border border-blue-100">
                      <h4 className="font-medium text-blue-800 text-md mb-1">
                        {selectedStore.name}
                      </h4>
                      <p className="text-blue-600 text-sm">{selectedStore.city}</p>
                    </div>
                  )}
                  
                  {sellers.length === 0 ? (
                    <div className="text-center py-8 px-4">
                      <svg className="w-12 h-12 mx-auto text-slate-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                      </svg>
                      <p className="text-slate-500 text-lg">
                        Nenhum vendedor disponível nesta loja.
                      </p>
                    </div>
                  ) : (
                    <ul className="space-y-3">
                      {sellers.map((seller) => (
                        <li key={seller.id}>
                          <a
                            href={formatWhatsAppUrl(seller.whatsapp, `Olá ${seller.name}, gostaria de informações sobre produtos da ${selectedStore?.name || 'loja'}.`)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full flex items-center p-4 border border-slate-200 rounded-xl hover:bg-green-50 hover:border-green-200 transition-all duration-200 shadow-sm hover:shadow group"
                          >
                            <div className="flex-shrink-0 bg-gradient-to-br from-green-500 to-green-600 p-3 rounded-full shadow-inner">
                              <FaWhatsapp className="text-white" size={20} />
                            </div>
                            <div className="ml-4 text-left flex-1">
                              <h4 className="font-medium text-slate-800 text-lg group-hover:text-green-700 transition-colors">{seller.name}</h4>
                              <p className="text-slate-500 group-hover:text-green-600 transition-colors">{seller.whatsapp}</p>
                            </div>
                            <div className="bg-green-100 text-green-700 rounded-lg py-1 px-2 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                              Conversar
                            </div>
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              )}
            </>
          )}
        </div>
        
        {/* Footer */}
        <div className="bg-gradient-to-br from-slate-50 to-slate-100 px-6 py-4 border-t border-slate-200 flex justify-between">
          {step === 'sellers' ? (
            <button
              onClick={handleBack}
              className="flex items-center text-blue-600 hover:text-blue-800 transition-colors px-3 py-2 rounded-lg hover:bg-blue-50"
            >
              <FaArrowLeft className="mr-2" />
              Voltar para Lojas
            </button>
          ) : (
            <div></div>
          )}
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 rounded-lg transition-colors text-slate-700 font-medium"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
} 