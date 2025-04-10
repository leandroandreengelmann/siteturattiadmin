'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Banner } from '@/data/types';
import { useToast } from '@/components/ToastProvider';
import { bannerService } from '@/services/localDataService';
import AdminPageLayout from '@/components/AdminPageLayout';
import AdminFormContainer from '@/components/AdminFormContainer';
import FormField from '@/components/FormField';
import AdminItemCard from '@/components/AdminItemCard';
import AdminTable from '@/components/AdminTable';

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
  const [isEditing, setIsEditing] = useState(false);

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

  // Adicionar novo banner
  const handleAddNew = () => {
    setCurrentBanner(null);
    setIsActive(true);
    setOrder(0);
    setImageUrl('');
    setSelectedFile(null);
    setPreviewUrl('');
    setIsEditing(true);
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

  // Cancelar edição
  const handleCancel = () => {
    setIsEditing(false);
    resetForm();
  };

  // Editar banner existente
  const handleEdit = (banner: Banner) => {
    setCurrentBanner(banner);
    setIsActive(banner.isActive);
    setOrder(banner.order || 0);
    setImageUrl(banner.imageUrl);
    setPreviewUrl(banner.imageUrl);
    setIsEditing(true);
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
      setIsEditing(false);
    } catch (error) {
      console.error('Erro ao salvar banner:', error);
      showToast('Erro ao salvar banner', 'error');
    } finally {
      setSubmitting(false);
    }
  };
  
  // Componente de imagem do banner
  const BannerImageField = () => (
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
          <span className="text-gray-500">Nenhuma imagem selecionada</span>
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
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded mt-2"
      >
        Selecionar Imagem
      </button>
    </div>
  );

  // Configuração das colunas da tabela
  const columns = [
    {
      header: 'Imagem',
      key: 'imageUrl',
      render: (value: string) => (
        <div className="relative h-16 w-32">
          <Image
            src={value}
            alt="Banner"
            fill
            className="object-cover rounded"
          />
        </div>
      )
    },
    {
      header: 'Ordem',
      key: 'order'
    },
    {
      header: 'Status',
      key: 'isActive',
      render: (value: boolean) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {value ? 'Ativo' : 'Inativo'}
        </span>
      )
    }
  ];

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto"></div>
      </div>
    );
  }

  return (
    <AdminPageLayout 
      title="Gerenciamento de Banners"
      actionButton={{
        label: "Adicionar Novo Banner",
        onClick: handleAddNew,
        show: !isEditing
      }}
    >
      {isEditing ? (
        <AdminFormContainer
          title={currentBanner ? 'Editar Banner' : 'Novo Banner'}
          onCancel={handleCancel}
          onSubmit={handleSubmit}
          submitLabel={currentBanner ? 'Atualizar' : 'Salvar'}
          isSubmitting={submitting}
        >
          <BannerImageField />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <FormField
              type="number"
              id="order"
              label="Ordem de Exibição"
              value={order}
              onChange={(e) => setOrder(parseInt(e.target.value) || 0)}
              min={0}
            />
            
            <FormField
              type="checkbox"
              id="isActive"
              label="Banner Ativo"
              checked={isActive}
              onChange={() => setIsActive(!isActive)}
            />
          </div>
        </AdminFormContainer>
      ) : (
        <>
          {/* Exibição em tabela para desktop */}
          <AdminTable
            columns={columns}
            data={banners}
            actions={{
              onEdit: handleEdit,
              onDelete: handleDelete
            }}
            emptyText="Nenhum banner cadastrado."
          />
          
          {/* Exibição em cards para mobile */}
          <div className="md:hidden grid grid-cols-1 sm:grid-cols-2 gap-6">
            {banners.map((banner) => (
              <AdminItemCard
                key={banner.id}
                title={`Banner #${banner.order || 0}`}
                content={
                  <div className="relative h-32 w-full mb-2">
                    <Image
                      src={banner.imageUrl}
                      alt="Banner"
                      fill
                      className="object-cover rounded"
                    />
                  </div>
                }
                status={{
                  label: banner.isActive ? 'Ativo' : 'Inativo',
                  isActive: banner.isActive
                }}
                onEdit={() => handleEdit(banner)}
                onDelete={() => handleDelete(banner)}
              />
            ))}
            
            {banners.length === 0 && (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-500">Nenhum banner cadastrado.</p>
              </div>
            )}
          </div>
        </>
      )}
    </AdminPageLayout>
  );
} 