'use client';

import { useState, useEffect } from 'react';
import { ColorCollection } from '@/data/types';
import { useToast } from '@/components/ToastProvider';
import { colorCollectionService } from '@/services/localDataService';
import { Plus, Pencil, Trash2, Search, X, FolderOpen } from 'lucide-react';
import AdminPageLayout from '@/components/AdminPageLayout';
import AdminFormContainer from '@/components/AdminFormContainer';
import FormField from '@/components/FormField';
import AdminTable from '@/components/AdminTable';
import AdminItemCard from '@/components/AdminItemCard';

export default function AdminCollectionsPage() {
  const { showToast } = useToast();
  const [collectionsList, setCollectionsList] = useState<ColorCollection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCollection, setCurrentCollection] = useState<ColorCollection | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  
  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [representativeColor, setRepresentativeColor] = useState('#3b82f6');

  useEffect(() => {
    async function init() {
      try {
        const collections = await colorCollectionService.getAll();
        setCollectionsList(collections);
      } catch (error) {
        console.error('Erro ao inicializar a página de coleções:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    init();
  }, []);
  
  useEffect(() => {
    if (currentCollection) {
      setName(currentCollection.name);
      setDescription(currentCollection.description || '');
      setRepresentativeColor(currentCollection.representativeColor || '#3b82f6');
    }
  }, [currentCollection]);

  const resetForm = () => {
    setName('');
    setDescription('');
    setRepresentativeColor('#3b82f6');
    setCurrentCollection(null);
    setErrors({});
  };

  const handleAddNew = () => {
    resetForm();
    setIsEditing(true);
  };

  const handleEdit = (collection: ColorCollection) => {
    setCurrentCollection(collection);
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta coleção? Isso pode afetar produtos associados.')) {
      try {
        const success = await colorCollectionService.delete(id);
        
        if (success) {
          setCollectionsList(collectionsList.filter(c => c.id !== id));
          showToast('Coleção excluída com sucesso!', 'success');
        } else {
          showToast('Erro ao excluir coleção. Tente novamente.', 'error');
        }
      } catch (error) {
        console.error('Erro ao excluir coleção:', error);
        showToast('Ocorreu um erro inesperado. Tente novamente.', 'error');
      }
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    resetForm();
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!name.trim()) {
      newErrors.name = 'O nome da coleção é obrigatório';
    }
    
    if (name.trim().length < 3) {
      newErrors.name = 'O nome da coleção deve ter pelo menos 3 caracteres';
    }
    
    if (!representativeColor.match(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)) {
      newErrors.representativeColor = 'Cor inválida. Use formato hexadecimal (#RRGGBB)';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setSubmitting(true);
      let success;
      
      if (currentCollection) {
        // Atualizar coleção existente
        const updates: Partial<ColorCollection> = {
          name: name.trim(),
          description: description.trim(),
          representativeColor,
        };
        
        success = await colorCollectionService.update(currentCollection.id, updates);
        if (success) {
          setCollectionsList(
            collectionsList.map(c => (c.id === currentCollection.id ? { ...c, ...updates } : c))
          );
          showToast('Coleção atualizada com sucesso!', 'success');
        }
      } else {
        // Adicionar nova coleção
        const newCollection = {
          name: name.trim(),
          description: description.trim(),
          representativeColor,
        };
        
        const addedCollection = await colorCollectionService.add(newCollection);
        if (addedCollection) {
          setCollectionsList([...collectionsList, addedCollection as ColorCollection]);
          showToast('Coleção adicionada com sucesso!', 'success');
          success = true;
        } else {
          success = false;
        }
      }
      
      if (success) {
        setIsEditing(false);
        resetForm();
      } else {
        showToast('Erro ao salvar coleção. Tente novamente.', 'error');
      }
    } catch (error) {
      console.error('Erro ao salvar coleção:', error);
      showToast('Ocorreu um erro inesperado. Tente novamente.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredCollections = collectionsList.filter(collection => 
    collection.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (collection.description && collection.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  // Configuração das colunas da tabela
  const columns = [
    {
      header: 'Cor',
      key: 'representativeColor',
      render: (value: string) => (
        <div 
          className="h-10 w-10 rounded-lg border border-gray-200"
          style={{ backgroundColor: value || '#CCCCCC' }}
        />
      )
    },
    {
      header: 'Nome',
      key: 'name'
    },
    {
      header: 'Código Hex',
      key: 'representativeColor'
    },
    {
      header: 'Descrição',
      key: 'description',
      render: (value: string) => (
        <div className="max-w-xs truncate">
          {value || <span className="text-gray-400 italic">Sem descrição</span>}
        </div>
      )
    }
  ];
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto"></div>
      </div>
    );
  }
  
  return (
    <AdminPageLayout 
      title="Gerenciar Coleções"
      actionButton={{
        label: "Adicionar Nova Coleção",
        onClick: handleAddNew,
        show: !isEditing
      }}
    >
      {/* Busca */}
      {!isEditing && (
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar coleções..."
              className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-500"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      )}
      
      {isEditing ? (
        <AdminFormContainer
          title={currentCollection ? 'Editar Coleção' : 'Nova Coleção'}
          onCancel={handleCancel}
          onSubmit={handleSubmit}
          submitLabel={currentCollection ? 'Atualizar' : 'Salvar'}
          isSubmitting={submitting}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <FormField
              type="text"
              id="name"
              label="Nome da Coleção"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              error={errors.name}
            />
            
            <FormField
              type="color"
              id="representativeColor"
              label="Cor Representativa"
              value={representativeColor}
              onChange={(e) => setRepresentativeColor(e.target.value)}
              required
              error={errors.representativeColor}
            />
            
            <FormField
              type="textarea"
              id="description"
              label="Descrição"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              gridSpan="full"
              rows={3}
            />
          </div>
        </AdminFormContainer>
      ) : (
        <>
          {/* Exibição em tabela para desktop */}
          <AdminTable
            columns={columns}
            data={filteredCollections}
            actions={{
              onEdit: handleEdit,
              onDelete: (collection) => handleDelete(collection.id)
            }}
            emptyText={
              searchTerm
                ? "Nenhuma coleção encontrada para esta busca."
                : "Nenhuma coleção cadastrada."
            }
          />
          
          {/* Exibição em cards para mobile */}
          <div className="md:hidden grid grid-cols-1 sm:grid-cols-2 gap-6">
            {filteredCollections.map((collection) => (
              <AdminItemCard
                key={collection.id}
                title={collection.name}
                content={
                  <div className="flex items-center mt-2">
                    <div 
                      className="h-12 w-12 rounded-lg border border-gray-200 flex-shrink-0 shadow-sm mr-3"
                      style={{ backgroundColor: collection.representativeColor || '#CCCCCC' }}
                    />
                    <div className="text-sm">
                      <div className="font-mono text-slate-500 mb-1">{collection.representativeColor}</div>
                      {collection.description && (
                        <div className="text-gray-600 line-clamp-2">{collection.description}</div>
                      )}
                    </div>
                  </div>
                }
                onEdit={() => handleEdit(collection)}
                onDelete={() => handleDelete(collection.id)}
              />
            ))}
            
            {filteredCollections.length === 0 && (
              <div className="col-span-full text-center py-8">
                <div className="rounded-full bg-slate-100 p-3 mb-4 inline-flex">
                  <FolderOpen className="h-6 w-6 text-slate-400" />
                </div>
                <p className="text-gray-500">
                  {searchTerm
                    ? "Nenhuma coleção encontrada para esta busca."
                    : "Nenhuma coleção cadastrada."}
                </p>
              </div>
            )}
          </div>
        </>
      )}
      
      {/* Contador de resultados */}
      {!isEditing && filteredCollections.length > 0 && (
        <div className="mt-4 text-sm text-gray-500">
          {filteredCollections.length} {filteredCollections.length === 1 ? 'coleção encontrada' : 'coleções encontradas'}
          {searchTerm && ` para "${searchTerm}"`}
        </div>
      )}
    </AdminPageLayout>
  );
}
