'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Banner } from '@/data/types';
import { useToast } from '@/components/ToastProvider';
import { bannerService } from '@/services/localDataService';

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentBanner, setCurrentBanner] = useState<Banner | null>(null);
  const [isActive, setIsActive] = useState(true);
  const [order, setOrder] = useState(0);
  const [imageUrl, setImageUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const router = useRouter();
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Carregar banners ao iniciar
  useEffect(() => {
    loadBanners();
  }, []);

  // Carregar banners do serviço local
  const loadBanners = async () => {
    try {
      setLoading(true);
      const data = await bannerService.getAll();
      setBanners(data);
    } catch (error) {
      console.error('Erro ao carregar banners:', error);
      showToast('Erro ao carregar banners', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Limpar formulário
  const resetForm = () => {
    setCurrentBanner(null);
    setIsActive(true);
    setOrder(0);
    setImageUrl('');
    setSelectedFile(null);
    setPreviewUrl('');
  };

  // Editar banner existente
  const editBanner = (banner: Banner) => {
    setCurrentBanner(banner);
    setIsActive(banner.isActive);
    setOrder(banner.order || 0);
    setImageUrl(banner.imageUrl);
    setPreviewUrl(banner.imageUrl);
  };

  // Deletar banner
  const handleDelete = async (banner: Banner) => {
    if (!banner.id) return;
    
    if (window.confirm(`Tem certeza que deseja excluir este banner?`)) {
      try {
        const success = await bannerService.delete(banner.id);
        
        if (success) {
          showToast('Banner excluído com sucesso!', 'success');
          loadBanners();
          resetForm();
        } else {
          showToast('Erro ao excluir banner', 'error');
        }
      } catch (error) {
        console.error('Erro ao excluir banner:', error);
        showToast('Erro ao excluir banner', 'error');
      }
    }
  };

  // Manipular seleção de arquivo
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setSelectedFile(file);
    
    // Criar URL para preview
    const fileUrl = URL.createObjectURL(file);
    setPreviewUrl(fileUrl);
  };

  // Submeter formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!previewUrl && !imageUrl) {
      showToast('É necessário selecionar uma imagem', 'error');
      return;
    }

    try {
      setSubmitting(true);
      
      // Criar objeto do banner
      const bannerData: Omit<Banner, 'id'> = {
        imageUrl: selectedFile ? previewUrl : imageUrl,
        isActive,
        order: Number(order) || 0
      };
      
      // Atualizar ou criar banner
      if (currentBanner?.id) {
        const updatedBanner = await bannerService.update(currentBanner.id, bannerData);
        if (updatedBanner) {
          showToast('Banner atualizado com sucesso!', 'success');
        } else {
          showToast('Erro ao atualizar banner', 'error');
        }
      } else {
        const newBanner = await bannerService.add(bannerData);
        if (newBanner) {
          showToast('Banner criado com sucesso!', 'success');
        } else {
          showToast('Erro ao criar banner', 'error');
        }
      }
      
      // Recarregar lista e limpar formulário
      loadBanners();
      resetForm();
    } catch (error) {
      console.error('Erro ao salvar banner:', error);
      showToast('Erro ao salvar banner', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 font-inter">Gerenciamento de Banners</h1>
        <Link 
          href="/admin"
          className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-md transition duration-300 font-inter"
        >
          Voltar ao painel
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Formulário */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 font-inter">
            {currentBanner ? 'Editar Banner' : 'Adicionar Novo Banner'}
          </h2>
          
          <form onSubmit={handleSubmit}>
            {/* Imagem Preview */}
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2 font-inter">
                Imagem do Banner
              </label>
              {previewUrl ? (
                <div className="relative h-48 mb-2 rounded overflow-hidden">
                  <Image
                    src={previewUrl}
                    alt="Preview do banner"
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="h-48 bg-gray-200 flex items-center justify-center rounded mb-2">
                  <span className="text-gray-500 font-inter">Nenhuma imagem selecionada</span>
                </div>
              )}
              
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                ref={fileInputRef}
                className="hidden"
              />
              
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-inter mt-2"
              >
                Selecionar Imagem
              </button>
            </div>
            
            {/* Status e Ordem */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Status</label>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="isActive" className="ml-2 text-gray-700">
                    Banner Ativo
                  </label>
                </div>
              </div>
              
              <div>
                <label htmlFor="order" className="block text-gray-700 font-medium mb-2 font-inter">
                  Ordem de Exibição
                </label>
                <input
                  type="number"
                  id="order"
                  min="0"
                  value={order}
                  onChange={(e) => setOrder(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-inter"
                />
              </div>
            </div>
            
            {/* Botões de Ação */}
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition duration-300 font-inter"
              >
                Cancelar
              </button>
              
              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300 font-inter disabled:opacity-70"
              >
                {submitting ? 'Salvando...' : 'Salvar Banner'}
              </button>
            </div>
          </form>
        </div>
        
        {/* Lista de Banners */}
        <div>
          <h2 className="text-xl font-semibold mb-4 font-inter">Banners Existentes</h2>
          
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
            </div>
          ) : banners.length === 0 ? (
            <div className="bg-white p-6 rounded-lg shadow-md text-center text-gray-500 font-inter">
              Nenhum banner cadastrado.
            </div>
          ) : (
            <div className="space-y-4">
              {banners.map((banner) => (
                <div key={banner.id} className="bg-white p-4 rounded-lg shadow-md">
                  <div className="flex flex-col sm:flex-row items-center">
                    <div className="relative h-24 w-36 flex-shrink-0 mb-4 sm:mb-0 sm:mr-4">
                      <Image
                        src={banner.imageUrl}
                        alt="Banner"
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                    
                    <div className="flex-grow">
                      <div className="flex flex-wrap gap-2 mb-2">
                        <span className={`px-2 py-0.5 text-xs rounded ${banner.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'} font-inter`}>
                          {banner.isActive ? 'Ativo' : 'Inativo'}
                        </span>
                        <span className="px-2 py-0.5 text-xs rounded bg-blue-100 text-blue-800 font-inter">
                          Ordem: {banner.order || 0}
                        </span>
                      </div>
                      
                      <div className="flex justify-end mt-2 space-x-2">
                        <button
                          onClick={() => editBanner(banner)}
                          className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition duration-300 font-inter"
                        >
                          Editar
                        </button>
                        
                        <button
                          onClick={() => handleDelete(banner)}
                          className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition duration-300 font-inter"
                        >
                          Excluir
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 