'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Product, ProductImage } from '@/data/types';
import { useToast } from '@/components/ToastProvider';
import Image from 'next/image';

export default function AdminProductsPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Form state
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [promoPrice, setPromoPrice] = useState('');
  const [description, setDescription] = useState('');
  const [isPromotion, setIsPromotion] = useState(false);
  
  // Novo estado para gerenciar múltiplas imagens
  const [productImages, setProductImages] = useState<ProductImage[]>([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  
  // Check if user is authenticated and load products
  useEffect(() => {
    async function init() {
      try {
        // Verificar autenticação com Supabase
        const { authService, productService } = await import('@/services/supabaseService');
        const session = await authService.getSession();
        
        if (!session) {
          // Redirecionar para a página inicial se não estiver autenticado
          router.push('/');
          return;
        }
        
        setIsAuthenticated(true);
        
        // Carregar produtos do Supabase
        const productsData = await productService.getAll();
        setProductsList(productsData);
      } catch (error) {
        console.error('Erro ao verificar autenticação ou carregar produtos:', error);
        router.push('/');
      }
    }
    
    init();
  }, [router]);
  
  // Set form data when editing a product
  useEffect(() => {
    if (currentProduct) {
      setName(currentProduct.name);
      setPrice(currentProduct.price.toString());
      setPromoPrice(currentProduct.promoPrice?.toString() || '');
      setDescription(currentProduct.description);
      setIsPromotion(currentProduct.isPromotion);
      setProductImages(currentProduct.images || []);
      setPreviewUrls(currentProduct.images?.map(img => img.standard) || []);
    }
  }, [currentProduct]);
  
  // Gerar previews para os arquivos selecionados
  useEffect(() => {
    // Limpar URLs antigas quando não houver arquivos
    if (selectedFiles.length === 0) {
      return;
    }
    
    // Criar URLs de preview para os novos arquivos
    const newPreviewUrls = selectedFiles.map(file => URL.createObjectURL(file));
    setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
    
    // Limpar URLs ao desmontar
    return () => {
      newPreviewUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [selectedFiles]);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      // Converter FileList para array
      const filesArray = Array.from(e.target.files);
      setSelectedFiles(prev => [...prev, ...filesArray]);
    }
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const filesArray = Array.from(e.dataTransfer.files);
      setSelectedFiles(prev => [...prev, ...filesArray]);
    }
  };
  
  const handleRemoveImage = (index: number) => {
    // Se for uma imagem já salva no banco
    if (index < productImages.length) {
      setProductImages(prev => prev.filter((_, i) => i !== index));
    }
    
    // Remover também do preview
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
    
    // Se for um arquivo recém-selecionado
    if (index >= productImages.length) {
      const newIndex = index - productImages.length;
      setSelectedFiles(prev => prev.filter((_, i) => i !== newIndex));
    }
  };
  
  const processImages = async () => {
    if (selectedFiles.length === 0) {
      return productImages; // Retornar as imagens existentes sem alterações
    }
    
    setUploadingImages(true);
    
    try {
      // Verificar se o usuário está autenticado
      const { authService, productService } = await import('@/services/supabaseService');
      const session = await authService.getSession();
      
      if (!session) {
        showToast('Sessão expirada. Por favor, faça login novamente.', 'error');
        setUploadingImages(false);
        // Direcionar para tela de login
        router.push('/admin');
        return productImages;
      }
      
      let successCount = 0;
      let failCount = 0;
      
      // Processar um arquivo por vez de forma sequencial para evitar sobrecarga
      const processedImages = [...productImages]; // Começar com as imagens existentes
      
      for (const file of selectedFiles) {
        try {
          console.log(`Processando arquivo ${successCount + failCount + 1}/${selectedFiles.length}: ${file.name}`);
          const result = await productService.processImage(file);
          
          if (result) {
            processedImages.push(result);
            successCount++;
          } else {
            failCount++;
          }
        } catch (error) {
          console.error(`Erro ao processar arquivo: ${file.name}`, error);
          failCount++;
          
          // Mostrar toast para cada erro de arquivo individual
          if (error instanceof Error) {
            // Se for erro de autenticação, tentar obter nova sessão
            if (error.message.includes('autenticado') || error.message.includes('authorization')) {
              const newSession = await authService.refreshSession();
              if (newSession) {
                showToast('Sessão renovada. Tente novamente.', 'info');
              } else {
                showToast('Sua sessão expirou. Por favor, faça login novamente.', 'error');
                router.push('/admin');
              }
              break;
            }
            showToast(`Erro: ${error.message}`, 'error');
          }
        }
      }
      
      // Verificar se pelo menos uma imagem foi processada
      if (successCount === 0) {
        showToast(`Não foi possível processar nenhuma imagem. Verifique os formatos e tamanhos.`, 'error');
      } else if (failCount > 0) {
        showToast(`${successCount} imagens processadas com sucesso. ${failCount} falhas.`, 'warning');
      } else {
        showToast(`${successCount} imagens adicionadas com sucesso!`, 'success');
      }
      
      // Definir a primeira imagem como principal se não houver imagens ainda
      if (processedImages.length > 0 && !processedImages.some(img => img.isMain)) {
        processedImages[0].isMain = true;
      }
      
      // Limpar a seleção de arquivos
      setSelectedFiles([]);
      setUploadingImages(false);
      
      return processedImages;
    } catch (error) {
      console.error('Erro ao processar imagens:', error);
      let errorMessage = 'Erro ao processar as imagens. Tente novamente.';
      
      if (error instanceof Error) {
        errorMessage = error.message;
        // Se for erro de autenticação, redirecionar para login
        if (errorMessage.includes('autenticado') || errorMessage.includes('authorization')) {
          showToast('Sua sessão expirou. Por favor, faça login novamente.', 'error');
          router.push('/admin');
        }
      }
      
      showToast(errorMessage, 'error');
      setUploadingImages(false);
      return productImages;
    }
  };
  
  const setMainImage = (index: number) => {
    // Atualizar as imagens existentes
    const updatedImages = [...productImages, ...selectedFiles.map(() => ({} as ProductImage))];
    
    // Definir isMain como false para todas as imagens
    updatedImages.forEach(img => {
      if (img.isMain !== undefined) {
        img.isMain = false;
      }
    });
    
    // Definir a imagem selecionada como principal
    if (updatedImages[index]) {
      updatedImages[index].isMain = true;
    }
    
    setProductImages(updatedImages.filter(img => Object.keys(img).length > 0) as ProductImage[]);
  };
  
  const handleAddNew = () => {
    setIsEditing(true);
    setCurrentProduct(null);
    resetForm();
  };
  
  const handleEdit = (product: Product) => {
    setIsEditing(true);
    setCurrentProduct(product);
  };
  
  // Handle product deletion
  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
      try {
        // Importar o serviço de produtos
        const { productService } = await import('@/services/supabaseService');
        
        // Excluir produto no Supabase
        const success = await productService.delete(id);
        
        if (success) {
          // Encontrar o nome do produto para exibir no toast
          const deletedProduct = productsList.find(p => p.id === id);
          
          // Atualizar a lista local
          setProductsList(productsList.filter(p => p.id !== id));
          
          // Mostrar toast de sucesso
          if (deletedProduct) {
            showToast(`Produto "${deletedProduct.name}" excluído com sucesso!`, 'success');
          } else {
            showToast('Produto excluído com sucesso!', 'success');
          }
        } else {
          // Mostrar toast de erro
          showToast('Erro ao excluir o produto. Tente novamente.', 'error');
        }
      } catch (error) {
        console.error('Erro ao excluir produto:', error);
        // Mostrar toast de erro
        showToast('Ocorreu um erro ao excluir o produto. Tente novamente.', 'error');
      }
    }
  };
  
  const resetForm = () => {
    setName('');
    setPrice('');
    setPromoPrice('');
    setDescription('');
    setIsPromotion(false);
    setProductImages([]);
    setSelectedFiles([]);
    setPreviewUrls([]);
  };
  
  const handleCancel = () => {
    setIsEditing(false);
    setCurrentProduct(null);
    resetForm();
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Verificar se há pelo menos uma imagem
      if (productImages.length === 0 && selectedFiles.length === 0) {
        showToast('Adicione pelo menos uma imagem para o produto.', 'warning');
        return;
      }
      
      // Processar as imagens primeiro
      try {
        const processedImages = await processImages();
        console.log('Imagens processadas:', processedImages);
        
        if (processedImages.length === 0) {
          showToast('Não foi possível processar as imagens. Tente novamente.', 'error');
          return;
        }
        
        // Importar o serviço de produtos
        const { productService } = await import('@/services/supabaseService');
        
        const productData = {
          name,
          price: Number(price),
          promoPrice: promoPrice ? Number(promoPrice) : undefined,
          images: processedImages,
          description,
          isPromotion
        };
        
        if (currentProduct) {
          // Atualizar produto existente no Supabase
          const success = await productService.update(currentProduct.id, productData);
          
          if (success) {
            // Atualizar a lista local
            setProductsList(prevProducts => 
              prevProducts.map(p => p.id === currentProduct.id ? { ...productData, id: currentProduct.id } : p)
            );
            
            // Mostrar toast de sucesso
            showToast(`Produto "${name}" atualizado com sucesso!`, 'success');
          } else {
            // Mostrar toast de erro
            showToast('Erro ao atualizar o produto. Tente novamente.', 'error');
          }
        } else {
          // Adicionar novo produto no Supabase
          const newProduct = await productService.add(productData);
          
          if (newProduct) {
            // Adicionar à lista local
            setProductsList(prevProducts => [...prevProducts, newProduct]);
            
            // Mostrar toast de sucesso
            showToast(`Produto "${name}" adicionado com sucesso!`, 'success');
          } else {
            // Mostrar toast de erro
            showToast('Erro ao adicionar o produto. Tente novamente.', 'error');
          }
        }
        
        // Reset form
        setIsEditing(false);
        setCurrentProduct(null);
        resetForm();
      } catch (error) {
        console.error('Erro ao processar imagens:', error);
        let errorMessage = 'Erro ao processar as imagens. Tente novamente.';
        
        if (error instanceof Error) {
          errorMessage = `Erro: ${error.message}`;
        }
        
        showToast(errorMessage, 'error');
      }
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
      // Mostrar toast de erro
      showToast('Ocorreu um erro ao salvar o produto. Tente novamente.', 'error');
    }
  };
  
  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p>Verificando autenticação...</p>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <div>
          <Link href="/admin" className="text-blue-700 hover:underline mb-2 inline-block">
            &larr; Voltar para o Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-800">Gerenciar Produtos</h1>
        </div>
        
        {!isEditing && (
          <button
            onClick={handleAddNew}
            className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-md transition duration-300"
          >
            Adicionar Novo Produto
          </button>
        )}
      </div>
      
      {isEditing ? (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            {currentProduct ? 'Editar Produto' : 'Novo Produto'}
          </h2>
          
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-gray-700 mb-2" htmlFor="name">
                  Nome do Produto *
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
                <label className="block text-gray-700 mb-2" htmlFor="price">
                  Preço Normal *
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
                <label className="block text-gray-700 mb-2" htmlFor="promoPrice">
                  Preço Promocional
                </label>
                <input
                  type="number"
                  id="promoPrice"
                  value={promoPrice}
                  onChange={(e) => setPromoPrice(e.target.value)}
                  step="0.01"
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-gray-700 mb-2">
                  Imagens do Produto *
                </label>
                
                {/* Área de Upload */}
                <div
                  className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center cursor-pointer hover:bg-gray-50 transition"
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleFileChange}
                    multiple
                    accept="image/*"
                  />
                  <div className="space-y-1 text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                      aria-hidden="true"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div className="flex text-sm text-gray-600 justify-center">
                      <p className="pl-1">Arraste imagens ou clique para selecionar</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, GIF até 10MB
                    </p>
                  </div>
                </div>
                
                {/* Prévia das imagens */}
                {previewUrls.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-700 mb-2">
                      {previewUrls.length} {previewUrls.length === 1 ? 'imagem selecionada' : 'imagens selecionadas'}
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                      {previewUrls.map((url, index) => (
                        <div key={index} className="relative group">
                          <div className={`border rounded-md overflow-hidden ${
                            productImages[index]?.isMain ? 'ring-2 ring-blue-500' : ''
                          }`}>
                            <img
                              src={url}
                              alt={`Prévia ${index + 1}`}
                              className="h-24 w-full object-cover"
                            />
                          </div>
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100">
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(index)}
                              className="p-1 bg-red-500 text-white rounded-full"
                              title="Remover imagem"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                            <button
                              type="button"
                              onClick={() => setMainImage(index)}
                              className="p-1 bg-blue-500 text-white rounded-full ml-2"
                              title="Definir como imagem principal"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </button>
                          </div>
                          {productImages[index]?.isMain && (
                            <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs px-1 py-0.5 rounded-bl-md">
                              Principal
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-gray-700 mb-2" htmlFor="description">
                  Descrição *
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPromotion}
                    onChange={() => setIsPromotion(!isPromotion)}
                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="ml-2 text-gray-700">Produto em promoção</span>
                </label>
              </div>
            </div>
            
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition duration-300"
              >
                Cancelar
              </button>
              
              <button
                type="submit"
                disabled={uploadingImages}
                className={`px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-md transition duration-300 ${
                  uploadingImages ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {uploadingImages 
                  ? 'Processando imagens...' 
                  : (currentProduct ? 'Atualizar' : 'Salvar')
                }
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Tabela para desktop */}
          <div className="hidden md:block">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Produto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Preço
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Promoção
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {productsList.map((product) => (
                  <tr key={product.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          {product.images && product.images.length > 0 ? (
                            <img
                              className="h-10 w-10 rounded-full object-cover"
                              src={product.images.find(img => img.isMain)?.thumbnail || product.images[0].thumbnail}
                              alt={product.name}
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                              <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{product.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">R$ {product.price.toFixed(2)}</div>
                      {product.promoPrice && (
                        <div className="text-sm text-red-600">R$ {product.promoPrice.toFixed(2)}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        product.isPromotion
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {product.isPromotion ? 'Sim' : 'Não'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(product)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Excluir
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Cards para mobile */}
          <div className="md:hidden">
            <div className="grid grid-cols-1 gap-4 p-4">
              {productsList.map((product) => (
                <div key={product.id} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                  <div className="flex items-center mb-3">
                    <div className="h-12 w-12 flex-shrink-0">
                      {product.images && product.images.length > 0 ? (
                        <img
                          className="h-12 w-12 rounded-lg object-cover"
                          src={product.images.find(img => img.isMain)?.thumbnail || product.images[0].thumbnail}
                          alt={product.name}
                        />
                      ) : (
                        <div className="h-12 w-12 rounded-lg bg-gray-200 flex items-center justify-center">
                          <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="text-base font-medium text-gray-900">{product.name}</div>
                      <div className="flex items-center mt-1">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          product.isPromotion
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {product.isPromotion ? 'Em promoção' : 'Preço normal'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-3 mt-1">
                    <div className="flex justify-between items-center mb-2">
                      <div>
                        <div className="text-sm text-gray-500">Preço normal:</div>
                        <div className="text-sm font-medium text-gray-900">R$ {product.price.toFixed(2)}</div>
                      </div>
                      {product.promoPrice && (
                        <div className="text-right">
                          <div className="text-sm text-gray-500">Preço promocional:</div>
                          <div className="text-sm font-medium text-red-600">R$ {product.promoPrice.toFixed(2)}</div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-3 flex justify-between border-t border-gray-200 pt-3">
                    <button
                      onClick={() => handleEdit(product)}
                      className="inline-flex items-center px-3 py-1.5 border border-blue-700 text-sm font-medium rounded-md text-blue-700 bg-white hover:bg-blue-100 focus:outline-none"
                    >
                      <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="inline-flex items-center px-3 py-1.5 border border-red-600 text-sm font-medium rounded-md text-red-600 bg-white hover:bg-red-50 focus:outline-none"
                    >
                      <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Excluir
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {productsList.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">Nenhum produto cadastrado.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
