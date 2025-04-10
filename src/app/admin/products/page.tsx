"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Product } from "@/data/types";
import { useToast } from '@/components/ToastProvider';
import AdminPageLayout from '@/components/AdminPageLayout';
import AdminFormContainer from '@/components/AdminFormContainer';
import FormField from '@/components/FormField';
import AdminItemCard from '@/components/AdminItemCard';
import AdminTable from '@/components/AdminTable';
import { Package, Pencil, Trash2 } from 'lucide-react';
import { formatCurrency } from "@/lib/utils";

// Função simulada para buscar produtos
const fetchProducts = async (): Promise<Product[]> => {
  // Simula atraso na rede
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Retorna dados simulados de produtos
  return [
    {
      id: "1",
      name: "Tinta Acrílica Premium",
      price: 159.90,
      promoPrice: 139.90,
      images: ["/images/produtos/tinta-premium.jpg"],
      description: "Tinta acrílica premium com alta cobertura e durabilidade",
      isPromotion: true,
      active: true,
      stock: 120,
      sellerName: "Loja Centro",
    },
    {
      id: "2",
      name: "Esmalte Sintético Standard",
      price: 89.90,
      images: ["/images/produtos/esmalte-standard.jpg"],
      description: "Esmalte sintético de secagem rápida, ideal para madeiras e metais",
      isPromotion: false,
      active: true,
      stock: 85,
      sellerName: "Loja Tatuapé",
    },
    {
      id: "3",
      name: "Primer Antiferrugem",
      price: 72.50,
      promoPrice: 65.90,
      images: ["/images/produtos/primer.jpg"],
      description: "Primer antiferrugem para superfícies metálicas",
      isPromotion: true,
      active: false,
      stock: 45,
      sellerName: "Loja Zona Sul",
    },
    {
      id: "4",
      name: "Textura Rústica",
      price: 127.80,
      images: ["/images/produtos/textura-rustica.jpg"],
      description: "Textura rústica para paredes internas e externas",
      isPromotion: false,
      active: true,
      stock: 38,
      sellerName: "Loja Zona Oeste",
    },
    {
      id: "5",
      name: "Kit Pintura Completo",
      price: 219.90,
      promoPrice: 189.90,
      images: ["/images/produtos/kit-pintura.jpg"],
      description: "Kit completo com tinta, rolo, bandeja e fita crepe",
      isPromotion: true,
      active: true,
      stock: 25,
      sellerName: "Loja Centro",
    }
  ];
};

export default function ProductsPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [submitting, setSubmitting] = useState(false);
  
  // Dados do formulário
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [promoPrice, setPromoPrice] = useState('');
  const [description, setDescription] = useState('');
  const [isPromotion, setIsPromotion] = useState(false);
  const [active, setActive] = useState(true);
  const [stock, setStock] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  
  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      try {
        const data = await fetchProducts();
        setProductsList(data);
      } catch (error) {
        console.error("Erro ao carregar produtos:", error);
        showToast('Erro ao carregar produtos', 'error');
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, [showToast]);

  // Adicionar novo produto
  const handleAddNew = () => {
    setIsEditing(true);
    setCurrentProduct(null);
    resetForm();
  };

  // Editar produto existente
  const handleEdit = (product: Product) => {
    setCurrentProduct(product);
    setName(product.name);
    setPrice(product.price.toString());
    setPromoPrice(product.promoPrice?.toString() || '');
    setDescription(product.description || '');
    setIsPromotion(product.isPromotion === true);
    setActive(product.active === true);
    setStock(product.stock?.toString() || '');
    
    // Definir preview da imagem se existir
    if (product.images && product.images.length > 0) {
      const image = product.images[0];
      if (typeof image === 'string') {
        setImagePreview(image);
      } else {
        setImagePreview(image.standard);
      }
    } else {
      setImagePreview(null);
    }
    
    setImageFile(null);
    setIsEditing(true);
  };

  // Excluir produto
  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
      try {
        // Simulação de exclusão no frontend
        setProductsList(prev => prev.filter(product => product.id !== id));
        showToast('Produto excluído com sucesso!', 'success');
      } catch (error) {
        console.error("Erro ao excluir produto:", error);
        showToast('Ocorreu um erro inesperado. Tente novamente.', 'error');
      }
    }
  };

  // Resetar formulário
  const resetForm = () => {
    setName('');
    setPrice('');
    setPromoPrice('');
    setDescription('');
    setIsPromotion(false);
    setActive(true);
    setStock('');
    setImagePreview(null);
    setImageFile(null);
  };

  // Cancelar edição
  const handleCancel = () => {
    setIsEditing(false);
    setCurrentProduct(null);
    resetForm();
  };

  // Gerenciar upload de imagem
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validar o tipo de arquivo
    if (!file.type.startsWith('image/')) {
      showToast('Por favor, selecione uma imagem válida', 'error');
      return;
    }
    
    // Criar URL para preview
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
    setImageFile(file);
  };

  // Submeter formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      showToast('O nome do produto é obrigatório', 'error');
      return;
    }

    if (!price || isNaN(parseFloat(price)) || parseFloat(price) <= 0) {
      showToast('Informe um preço válido', 'error');
      return;
    }

    if (isPromotion && (!promoPrice || isNaN(parseFloat(promoPrice)) || parseFloat(promoPrice) <= 0)) {
      showToast('Informe um preço promocional válido', 'error');
      return;
    }
    
    try {
      setSubmitting(true);
      const productData = {
        name,
        price: parseFloat(price),
        promoPrice: promoPrice ? parseFloat(promoPrice) : undefined,
        description,
        isPromotion,
        active,
        stock: stock ? parseInt(stock) : undefined,
        images: imagePreview ? [imagePreview] : currentProduct?.images || []
      };
      
      if (currentProduct) {
        // Atualizar produto existente (simulado para frontend)
        const updatedProducts = productsList.map(p => 
          p.id === currentProduct.id ? { ...p, ...productData, id: p.id, sellerName: p.sellerName } : p
        );
        setProductsList(updatedProducts);
        showToast(`Produto "${name}" atualizado com sucesso!`, 'success');
      } else {
        // Adicionar novo produto (simulado para frontend)
        const productIds = productsList.map(p => parseInt(p.id));
        const newId = productIds.length > 0 ? (Math.max(...productIds) + 1).toString() : "1";
        const newProduct = { 
          ...productData, 
          id: newId,
          sellerName: "Loja Centro" // Valor padrão para demonstração
        };
        setProductsList([...productsList, newProduct as Product]);
        showToast(`Produto "${name}" adicionado com sucesso!`, 'success');
      }
      
      setIsEditing(false);
      setCurrentProduct(null);
      resetForm();
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
      showToast('Ocorreu um erro inesperado. Tente novamente.', 'error');
    } finally {
      setSubmitting(false);
    }
  };
  
  // Configuração das colunas da tabela
  const columns = [
    {
      header: 'Imagem',
      key: 'images',
      render: (value: any[]) => (
        <div className="relative h-10 w-10 rounded-md overflow-hidden">
          {value && value.length > 0 ? (
            <Image
              src={typeof value[0] === 'string' ? value[0] : value[0].url || '/placeholder-product.png'}
              alt="Thumbnail"
              fill
              className="object-cover"
            />
          ) : (
            <div className="bg-gray-200 h-full w-full flex items-center justify-center">
              <Package size={18} className="text-gray-400" />
            </div>
          )}
        </div>
      )
    },
    {
      header: 'Produto',
      key: 'name'
    },
    {
      header: 'Preço',
      key: 'price',
      render: (value: number, row: Product) => (
        <div>
          {row.isPromotion && row.promoPrice ? (
            <>
              <div className="text-sm line-through text-gray-500">{formatCurrency(value)}</div>
              <div className="font-medium text-green-600">{formatCurrency(row.promoPrice)}</div>
            </>
          ) : (
            <div>{formatCurrency(value)}</div>
          )}
        </div>
      )
    },
    {
      header: 'Estoque',
      key: 'stock'
    },
    {
      header: 'Status',
      key: 'active',
      render: (value: boolean) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {value ? 'Ativo' : 'Inativo'}
        </span>
      )
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
      title="Gerenciamento de Produtos"
      actionButton={{
        label: "Adicionar Novo Produto",
        onClick: handleAddNew,
        show: !isEditing
      }}
    >
      {isEditing ? (
        <AdminFormContainer
          title={currentProduct ? 'Editar Produto' : 'Novo Produto'}
          onCancel={handleCancel}
          onSubmit={handleSubmit}
          submitLabel={currentProduct ? 'Atualizar' : 'Salvar'}
          isSubmitting={submitting}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <FormField
              type="text"
              id="name"
              label="Nome do Produto"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            
            <FormField
              type="number"
              id="price"
              label="Preço"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
            
            <FormField
              type="number"
              id="stock"
              label="Estoque"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
            />
            
            <FormField
              type="checkbox"
              id="isPromotion"
              label="Em Promoção"
              checked={isPromotion}
              onChange={() => setIsPromotion(!isPromotion)}
            />
            
            {isPromotion && (
              <FormField
                type="number"
                id="promoPrice"
                label="Preço Promocional"
                value={promoPrice}
                onChange={(e) => setPromoPrice(e.target.value)}
                required
              />
            )}
            
            <FormField
              type="checkbox"
              id="active"
              label="Produto Ativo"
              checked={active}
              onChange={() => setActive(!active)}
            />
            
            <div className="col-span-2">
              <label className="block text-gray-700 font-medium mb-2">
                Imagem do Produto
              </label>
              <div className="flex items-center space-x-4">
                {imagePreview && (
                  <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-gray-200">
                    <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                  </div>
                )}
                <div className="flex-1">
                  <label className="flex flex-col items-center px-4 py-3 bg-white text-blue-600 rounded-lg border border-dashed border-blue-600 cursor-pointer hover:bg-blue-50 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm font-medium">{imagePreview ? 'Alterar imagem' : 'Adicionar imagem'}</span>
                    <input 
                      type="file" 
                      className="hidden" 
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </label>
                  <p className="mt-1 text-xs text-gray-500">PNG, JPG ou GIF (max. 2MB)</p>
                </div>
              </div>
            </div>
            
            <div className="col-span-full">
              <FormField
                type="textarea"
                id="description"
                label="Descrição"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
              />
            </div>
          </div>
        </AdminFormContainer>
      ) : (
        <>
          {/* Exibição em tabela para desktop */}
          <AdminTable
            columns={columns}
            data={productsList}
            actions={{
              onEdit: handleEdit,
              onDelete: (product) => handleDelete(product.id)
            }}
            emptyText="Nenhum produto cadastrado."
          />
          
          {/* Exibição em cards para mobile */}
          <div className="md:hidden grid grid-cols-1 sm:grid-cols-2 gap-6">
            {productsList.map((product) => (
              <AdminItemCard
                key={product.id}
                title={product.name}
                subtitle={`Preço: ${formatCurrency(product.price)}`}
                content={
                  <>
                    <div className="flex items-center mb-2">
                      {product.images && product.images.length > 0 ? (
                        <div className="relative h-14 w-14 rounded-md overflow-hidden mr-3">
                          <Image
                            src={typeof product.images[0] === 'string' ? product.images[0] : '/placeholder-product.png'}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="h-14 w-14 rounded-md bg-gray-200 flex items-center justify-center mr-3">
                          <Package size={20} className="text-gray-400" />
                        </div>
                      )}
                      <div>
                        {product.isPromotion && product.promoPrice ? (
                          <>
                            <div className="text-sm line-through text-gray-500">{formatCurrency(product.price)}</div>
                            <div className="font-medium text-green-600">{formatCurrency(product.promoPrice)}</div>
                          </>
                        ) : (
                          <div className="font-medium">{formatCurrency(product.price)}</div>
                        )}
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm line-clamp-2">{product.description}</p>
                    <div className="mt-2">
                      <span className="text-sm text-gray-600">Estoque: <strong>{product.stock || 'N/A'}</strong></span>
                    </div>
                  </>
                }
                status={{
                  label: product.active ? 'Ativo' : 'Inativo',
                  isActive: product.active === true
                }}
                customContent={
                  product.isPromotion && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-2">
                      Promoção
                    </span>
                  )
                }
                onEdit={() => handleEdit(product)}
                onDelete={() => handleDelete(product.id)}
              />
            ))}
            
            {productsList.length === 0 && (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-500">Nenhum produto cadastrado.</p>
              </div>
            )}
          </div>
        </>
      )}
    </AdminPageLayout>
  );
}
