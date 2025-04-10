'use client';

import { useState, useEffect } from 'react';
import { Color, ColorCollection } from '@/data/types';
import { useToast } from '@/components/ToastProvider';
import { colorService, colorCollectionService } from '@/services/localDataService';
import AdminPageLayout from '@/components/AdminPageLayout';
import AdminFormContainer from '@/components/AdminFormContainer';
import FormField from '@/components/FormField';
import AdminItemCard from '@/components/AdminItemCard';
import AdminTable from '@/components/AdminTable';

export default function AdminColorsPage() {
  const [colorsList, setColorsList] = useState<Color[]>([]);
  const [collections, setCollections] = useState<ColorCollection[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentColor, setCurrentColor] = useState<Color | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { showToast } = useToast();
  
  // Form state
  const [name, setName] = useState('');
  const [collectionId, setCollectionId] = useState('');
  const [hexCode, setHexCode] = useState('');
  
  // Carregar cores e coleções
  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        // Carregar cores e coleções do serviço local
        const colorsData = await colorService.getAll();
        setColorsList(colorsData);
        
        const collectionsData = await colorCollectionService.getAll();
        setCollections(collectionsData);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        showToast('Erro ao carregar dados', 'error');
      } finally {
        setIsLoading(false);
      }
    }
    
    loadData();
  }, []);
  
  // Set form data when editing a color
  useEffect(() => {
    if (currentColor) {
      setName(currentColor.name);
      setCollectionId(currentColor.collectionId || '');
      setHexCode(currentColor.hexCode || '#000000');
    }
  }, [currentColor]);
  
  const handleAddNew = () => {
    setIsEditing(true);
    setCurrentColor(null);
    resetForm();
  };
  
  const handleEdit = (color: Color) => {
    setIsEditing(true);
    setCurrentColor(color);
  };
  
  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta cor?')) {
      try {
        const success = await colorService.delete(id);
        
        if (success) {
          const deletedColor = colorsList.find(c => c.id === id);
          setColorsList(colorsList.filter(c => c.id !== id));
          // Mostrar toast de sucesso
          if (deletedColor) {
            showToast(`Cor "${deletedColor.name}" excluída com sucesso!`, 'success');
          } else {
            showToast('Cor excluída com sucesso!', 'success');
          }
        } else {
          // Mostrar toast de erro
          showToast('Erro ao excluir cor. Tente novamente.', 'error');
        }
      } catch (error) {
        console.error('Erro ao excluir cor:', error);
        // Mostrar toast de erro
        showToast('Ocorreu um erro ao excluir a cor. Tente novamente.', 'error');
      }
    }
  };
  
  const resetForm = () => {
    setName('');
    setCollectionId(collections.length > 0 ? collections[0].id : '');
    setHexCode('#000000');
  };
  
  const handleCancel = () => {
    setIsEditing(false);
    setCurrentColor(null);
    resetForm();
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSubmitting(true);
      
      if (currentColor) {
        // Atualizar cor existente
        const updates: Partial<Color> = {
          name,
          collectionId,
          hexCode,
        };
        
        console.log('Enviando atualização de cor:', updates);
        
        const updatedColor = await colorService.update(currentColor.id, updates);
        
        if (updatedColor) {
          // Atualizar a lista local
          setColorsList(colorsList.map(c => 
            c.id === currentColor.id ? { ...c, ...updates } : c
          ));
          console.log('Cor atualizada com sucesso');
          
          // Mostrar toast de sucesso
          showToast(`Cor "${name}" atualizada com sucesso!`, 'success');
        } else {
          // Mostrar toast de erro
          showToast('Erro ao atualizar cor. Tente novamente.', 'error');
        }
      } else {
        // Adicionar nova cor
        const newColor = {
          name,
          collectionId,
          hexCode,
        };
        
        console.log('Enviando nova cor:', newColor);
        
        const addedColor = await colorService.add(newColor);
        
        if (addedColor) {
          console.log('Cor adicionada com sucesso:', addedColor);
          setColorsList([...colorsList, addedColor]);
          
          // Mostrar toast de sucesso
          showToast(`Cor "${name}" adicionada com sucesso!`, 'success');
        } else {
          // Mostrar toast de erro
          showToast('Erro ao adicionar cor. Tente novamente.', 'error');
        }
      }
      
      setIsEditing(false);
      setCurrentColor(null);
      resetForm();
    } catch (error) {
      console.error('Erro ao salvar cor:', error);
      // Mostrar toast de erro
      showToast('Ocorreu um erro inesperado. Tente novamente.', 'error');
    } finally {
      setSubmitting(false);
    }
  };
  
  // Get collection name by ID
  const getCollectionName = (id: string | undefined) => {
    if (!id) return 'Desconhecida';
    const collection = collections.find(c => c.id === id);
    return collection ? collection.name : 'Desconhecida';
  };
  
  // Preparar opções de coleções para o select
  const collectionOptions = collections.map(collection => ({
    value: collection.id,
    label: collection.name
  }));
  
  // Configuração das colunas da tabela
  const columns = [
    {
      header: 'Cor',
      key: 'hexCode',
      render: (value: string) => (
        <div 
          className="h-8 w-8 rounded-full border border-gray-200"
          style={{ backgroundColor: value || '#CCCCCC' }}
        />
      )
    },
    {
      header: 'Nome',
      key: 'name'
    },
    {
      header: 'Coleção',
      key: 'collectionId',
      render: (value: string) => getCollectionName(value)
    },
    {
      header: 'Código Hex',
      key: 'hexCode'
    }
  ];
  
  // Renderização da página
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto"></div>
      </div>
    );
  }
  
  return (
    <AdminPageLayout 
      title="Gerenciar Cores"
      actionButton={{
        label: "Adicionar Nova Cor",
        onClick: handleAddNew,
        show: !isEditing
      }}
    >
      {isEditing ? (
        <AdminFormContainer
          title={currentColor ? 'Editar Cor' : 'Nova Cor'}
          onCancel={handleCancel}
          onSubmit={handleSubmit}
          submitLabel={currentColor ? 'Atualizar' : 'Salvar'}
          isSubmitting={submitting}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <FormField
              type="text"
              id="name"
              label="Nome da Cor"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            
            <FormField
              type="select"
              id="collectionId"
              label="Coleção"
              value={collectionId}
              onChange={(e) => setCollectionId(e.target.value)}
              options={collectionOptions}
              emptyOption="Selecione uma coleção"
              required
            />
            
            <FormField
              type="color"
              id="hexCode"
              label="Código Hexadecimal"
              value={hexCode}
              onChange={(e) => setHexCode(e.target.value)}
              required
            />
          </div>
        </AdminFormContainer>
      ) : (
        <>
          {/* Exibição em tabela para desktop */}
          <AdminTable
            columns={columns}
            data={colorsList}
            actions={{
              onEdit: handleEdit,
              onDelete: (color) => handleDelete(color.id)
            }}
            emptyText="Nenhuma cor cadastrada."
          />
          
          {/* Exibição em cards para mobile */}
          <div className="md:hidden grid grid-cols-1 sm:grid-cols-2 gap-6">
            {colorsList.map((color) => (
              <AdminItemCard
                key={color.id}
                title={color.name}
                subtitle={`Coleção: ${getCollectionName(color.collectionId)}`}
                content={
                  <div className="flex items-center mt-2">
                    <div 
                      className="h-12 w-12 rounded-lg border border-gray-200 flex-shrink-0 shadow-sm mr-3"
                      style={{ backgroundColor: color.hexCode || '#CCCCCC' }}
                    />
                    <div className="text-base font-mono">{color.hexCode}</div>
                  </div>
                }
                onEdit={() => handleEdit(color)}
                onDelete={() => handleDelete(color.id)}
              />
            ))}
            
            {colorsList.length === 0 && (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-500">Nenhuma cor cadastrada.</p>
              </div>
            )}
          </div>
        </>
      )}
    </AdminPageLayout>
  );
}
