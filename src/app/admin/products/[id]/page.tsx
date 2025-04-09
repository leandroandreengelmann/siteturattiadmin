'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Product, ProductImage } from '@/data/types';
import { useToast } from '@/components/ToastProvider';
import { productService } from '@/services/localDataService';

interface ProductFormParams {
  params: {
    id: string;
  };
}

export default function EditProductPage({ params }: ProductFormParams) {
  const { id } = params;
  const router = useRouter();
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Dados do formulário
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [promoPrice, setPromoPrice] = useState('');
  const [isPromotion, setIsPromotion] = useState(false);
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<ProductImage[]>([]);
  
  // Estado do formulário
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  
  // Carregar dados do produto
  useEffect(() => {
    async function loadProduct() {
      try {
        setLoading(true);
        const product = await productService.getById(id);
        
        if (!product) {
          showToast('Produto não encontrado', 'error');
          router.push('/admin/products');
          return;
        }
        
        // Preencher formulário com dados do produto
        setName(product.name);
        setPrice(product.price.toString());
        setPromoPrice(product.promoPrice?.toString() || '');
        setIsPromotion(product.isPromotion);
        setDescription(product.description);
        setImages(product.images || []);
        
        // Criar previews para imagens existentes
        const previews = product.images.map(img => img.standard);
        setPreviewUrls(previews);
      } catch (error) {
        console.error('Erro ao carregar produto:', error);
        showToast('Erro ao carregar dados do produto', 'error');
      } finally {
        setLoading(false);
      }
    }
    
    loadProduct();
  }, [id, router, showToast]);
  
  // Manipular seleção de arquivos
  const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const filesArray = Array.from(files);
    setSelectedFiles(prev => [...prev, ...filesArray]);
    
    // Criar URLs para preview
    const newPreviews = filesArray.map(file => URL.createObjectURL(file));
    setPreviewUrls(prev => [...prev, ...newPreviews]);
  };
  
  // Remover imagem
  const handleRemoveImage = (index: number) => {
    // Se for uma imagem nova (do preview)
    if (index >= images.length) {
      const previewIndex = index - images.length;
      const newSelectedFiles = [...selectedFiles];
      newSelectedFiles.splice(previewIndex, 1);
      setSelectedFiles(newSelectedFiles);
      
      const newPreviews = [...previewUrls];
      newPreviews.splice(index, 1);
      setPreviewUrls(newPreviews);
    } else {
      // Se for uma imagem existente
      const newImages = [...images];
      newImages.splice(index, 1);
      setImages(newImages);
      
      const newPreviews = [...previewUrls];
      newPreviews.splice(index, 1);
      setPreviewUrls(newPreviews);
    }
  };
  
  // Submeter formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !price) {
      showToast('Preencha todos os campos obrigatórios', 'error');
      return;
    }
    
    try {
      setSubmitting(true);
      
      // Criar novas imagens a partir dos arquivos selecionados
      const newProductImages: ProductImage[] = selectedFiles.map(file => {
        const url = URL.createObjectURL(file);
        return {
          highResolution: url,
          standard: url,
          thumbnail: url,
          isMain: false
        };
      });
      
      // Combinar imagens existentes com novas imagens
      const allImages = [...images, ...newProductImages];
      
      // Se não houver imagens, definir pelo menos uma imagem padrão
      if (allImages.length === 0) {
        allImages.push({
          highResolution: 'https://picsum.photos/800/600',
          standard: 'https://picsum.photos/400/300',
          thumbnail: 'https://picsum.photos/200/150',
          isMain: true
        });
      }
      
      // Atualizar produto
      const updatedProduct = await productService.update(id, {
        name,
        price: parseFloat(price),
        promoPrice: promoPrice ? parseFloat(promoPrice) : undefined,
        isPromotion,
        description,
        images: allImages
      });
      
      if (updatedProduct) {
        showToast('Produto atualizado com sucesso!', 'success');
        router.push('/admin/products');
      } else {
        showToast('Erro ao atualizar produto', 'error');
      }
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
      showToast('Erro ao atualizar produto', 'error');
    } finally {
      setSubmitting(false);
    }
  };
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto"></div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <Link href="/admin/products" className="text-blue-700 hover:underline mb-2 inline-block">
            &larr; Voltar para Produtos
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">Editar Produto</h1>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <form onSubmit={handleSubmit}>
          {/* Seção de imagens */}
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">
              Imagens do Produto
            </label>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-4">
              {previewUrls.map((url, index) => (
                <div key={index} className="relative h-32 w-full rounded-md overflow-hidden border border-gray-200">
                  <Image
                    src={url}
                    alt={`Imagem ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    title="Remover imagem"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
              
              <div 
                className="h-32 w-full border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center cursor-pointer hover:bg-gray-50"
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span className="text-sm text-gray-500 mt-1 block">Adicionar</span>
                </div>
              </div>
            </div>
            
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFilesChange}
              ref={fileInputRef}
              className="hidden"
            />
          </div>
          
          {/* Informações do produto */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
                Nome do Produto*
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label htmlFor="price" className="block text-gray-700 font-medium mb-2">
                Preço (R$)*
              </label>
              <input
                type="number"
                id="price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                step="0.01"
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <div className="flex items-center mb-2">
                <input
                  type="checkbox"
                  id="isPromotion"
                  checked={isPromotion}
                  onChange={(e) => setIsPromotion(e.target.checked)}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="isPromotion" className="ml-2 block text-gray-700 font-medium">
                  Em Promoção
                </label>
              </div>
              {isPromotion && (
                <>
                  <label htmlFor="promoPrice" className="block text-gray-700 font-medium mb-2">
                    Preço Promocional (R$)*
                  </label>
                  <input
                    type="number"
                    id="promoPrice"
                    value={promoPrice}
                    onChange={(e) => setPromoPrice(e.target.value)}
                    step="0.01"
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required={isPromotion}
                  />
                </>
              )}
            </div>
          </div>
          
          <div className="mt-6">
            <label htmlFor="description" className="block text-gray-700 font-medium mb-2">
              Descrição do Produto*
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            ></textarea>
          </div>
          
          <div className="flex justify-end mt-6 space-x-4">
            <Link
              href="/admin/products"
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition duration-300"
            >
              Cancelar
            </Link>
            
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300 disabled:opacity-50"
            >
              {submitting ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 