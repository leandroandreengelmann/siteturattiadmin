'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useToast } from '@/components/ToastProvider';
import { Product } from '@/data/types';
import { productService } from '@/services/localDataService';

export default function AdminProductsPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    async function init() {
      try {
        // Carregar produtos
        const products = await productService.getAll();
        setProductsList(products);
      } catch (error) {
        console.error('Erro ao inicializar a página de produtos:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    init();
  }, []);

  // Navegar para a página de edição do produto
  const handleEdit = (productId: string) => {
    router.push(`/admin/products/${productId}`);
  };

  // Excluir produto
  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
      try {
        const success = await productService.delete(id);
        
        if (success) {
          setProductsList(productsList.filter(p => p.id !== id));
          showToast('Produto excluído com sucesso!', 'success');
        } else {
          showToast('Erro ao excluir produto. Tente novamente.', 'error');
        }
      } catch (error) {
        console.error('Erro ao excluir produto:', error);
        showToast('Ocorreu um erro inesperado. Tente novamente.', 'error');
      }
    }
  };

  // Navegar para página de adicionar novo produto
  const handleAddNew = () => {
    router.push('/admin/products/new');
  };
  
  // Renderização da página
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto"></div>
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
        
        <button
          onClick={handleAddNew}
          className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-md transition duration-300"
        >
          Adicionar Novo Produto
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Produto
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Preço
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Promoção
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {productsList.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0 mr-3">
                        {product.images && product.images.length > 0 ? (
                          <img 
                            className="h-10 w-10 rounded-full object-cover"
                            src={product.images[0].thumbnail || product.images[0].standard} 
                            alt={product.name}
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                        <div className="text-sm text-gray-500">ID: {product.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">R$ {product.price.toFixed(2)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {product.isPromotion ? (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Sim - R$ {product.promoPrice?.toFixed(2) || 0}
                      </span>
                    ) : (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                        Não
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEdit(product.id)}
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
              
              {productsList.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                    Nenhum produto cadastrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
