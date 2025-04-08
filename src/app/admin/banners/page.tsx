'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Banner } from '@/data/types';
import { useToast } from '@/components/ToastProvider';

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentBanner, setCurrentBanner] = useState<Banner | null>(null);
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [buttonText, setButtonText] = useState('');
  const [buttonLink, setButtonLink] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [order, setOrder] = useState(0);
  const [imageUrl, setImageUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const router = useRouter();
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Verificar autenticação
  useEffect(() => {
    async function checkAuth() {
      try {
        const { authService } = await import('@/services/supabaseService');
        const session = await authService.getSession();
        
        if (!session) {
          router.push('/');
          return;
        }
        
        // Carregar banners
        loadBanners();
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
        showToast('Erro de autenticação', 'error');
        router.push('/');
      }
    }
    
    checkAuth();
  }, [router]);

  // Carregar banners do Supabase
  const loadBanners = async () => {
    try {
      setLoading(true);
      const { bannerService } = await import('@/services/supabaseService');
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
    setTitle('');
    setSubtitle('');
    setButtonText('');
    setButtonLink('');
    setIsActive(true);
    setOrder(0);
    setImageUrl('');
    setSelectedFile(null);
    setPreviewUrl('');
  };

  // Editar banner existente
  const editBanner = (banner: Banner) => {
    setCurrentBanner(banner);
    setTitle(banner.title);
    setSubtitle(banner.subtitle || '');
    setButtonText(banner.buttonText || '');
    setButtonLink(banner.buttonLink || '');
    setIsActive(banner.isActive);
    setOrder(banner.order || 0);
    setImageUrl(banner.imageUrl);
    setPreviewUrl(banner.imageUrl);
  };

  // Deletar banner
  const handleDelete = async (banner: Banner) => {
    if (!banner.id) return;
    
    if (window.confirm(`Tem certeza que deseja excluir o banner "${banner.title}"?`)) {
      try {
        const { bannerService } = await import('@/services/supabaseService');
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
    
    if (!title) {
      showToast('O título é obrigatório', 'error');
      return;
    }

    try {
      setSubmitting(true);
      const { bannerService } = await import('@/services/supabaseService');
      
      // Fazer upload da imagem se um novo arquivo for selecionado
      let finalImageUrl = imageUrl;
      if (selectedFile) {
        const uploadedUrl = await bannerService.uploadBannerImage(selectedFile);
        if (!uploadedUrl) {
          showToast('Erro ao fazer upload da imagem', 'error');
          setSubmitting(false);
          return;
        }
        finalImageUrl = uploadedUrl;
      }
      
      // Criar objeto do banner
      const bannerData: Omit<Banner, 'id'> = {
        title,
        subtitle: subtitle || undefined,
        buttonText: buttonText || undefined,
        buttonLink: buttonLink || undefined,
        imageUrl: finalImageUrl,
        isActive,
        order: Number(order) || 0
      };
      
      // Atualizar ou criar banner
      if (currentBanner?.id) {
        const success = await bannerService.update(currentBanner.id, bannerData);
        if (success) {
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
            <div className="mb-4">
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
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-inter"
              >
                Selecionar Imagem
              </button>
            </div>
            
            {/* Campos do Formulário */}
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2 font-inter">
                Título*
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 font-inter"
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2 font-inter">
                Subtítulo
              </label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 font-inter"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2 font-inter">
                  Texto do Botão
                </label>
                <input
                  type="text"
                  value={buttonText}
                  onChange={(e) => setButtonText(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 font-inter"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 font-medium mb-2 font-inter">
                  Link do Botão
                </label>
                <input
                  type="text"
                  value={buttonLink}
                  onChange={(e) => setButtonLink(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 font-inter"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2 font-inter">
                  Ordem
                </label>
                <input
                  type="number"
                  value={order}
                  onChange={(e) => setOrder(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 font-inter"
                  min="0"
                />
              </div>
              
              <div className="flex items-center">
                <label className="flex items-center mt-6 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="form-checkbox h-5 w-5 text-blue-600"
                  />
                  <span className="ml-2 text-gray-700 font-inter">Ativo</span>
                </label>
              </div>
            </div>
            
            {/* Botões */}
            <div className="flex justify-between mt-6">
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded font-inter"
              >
                Cancelar
              </button>
              
              <button
                type="submit"
                disabled={submitting}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-inter disabled:opacity-50"
              >
                {submitting ? 'Salvando...' : (currentBanner ? 'Atualizar' : 'Adicionar')}
              </button>
            </div>
          </form>
        </div>
        
        {/* Lista de Banners */}
        <div>
          <h2 className="text-xl font-semibold mb-4 font-inter">Banners Atuais</h2>
          
          {loading ? (
            <p className="text-gray-600 font-inter">Carregando banners...</p>
          ) : banners.length === 0 ? (
            <p className="text-gray-600 font-inter">Nenhum banner cadastrado.</p>
          ) : (
            <div className="space-y-4">
              {banners.map((banner) => (
                <div 
                  key={banner.id} 
                  className={`bg-white p-4 rounded-lg shadow-md border-l-4 ${banner.isActive ? 'border-green-500' : 'border-gray-300'}`}
                >
                  <div className="flex">
                    {/* Thumbnail */}
                    <div className="relative h-20 w-32 mr-4 rounded overflow-hidden">
                      <Image
                        src={banner.imageUrl}
                        alt={banner.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    
                    {/* Informações */}
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg font-inter">{banner.title}</h3>
                      <p className="text-sm text-gray-500 font-inter">
                        Ordem: {banner.order || 0} | 
                        {banner.isActive ? (
                          <span className="text-green-600"> Ativo</span>
                        ) : (
                          <span className="text-gray-500"> Inativo</span>
                        )}
                      </p>
                    </div>
                  </div>
                  
                  {/* Botões de ação */}
                  <div className="mt-3 flex justify-end">
                    <button
                      onClick={() => editBanner(banner)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm mr-2 font-inter"
                    >
                      Editar
                    </button>
                    
                    <button
                      onClick={() => handleDelete(banner)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm font-inter"
                    >
                      Excluir
                    </button>
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