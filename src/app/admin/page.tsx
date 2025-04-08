'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useToast } from '@/components/ToastProvider';
import NotificationBadge from '@/components/NotificationBadge';
import StatusBadge from '@/components/StatusBadge';
import { BuildingIcon, UsersIcon, LifeBuoyIcon, SettingsIcon } from '@/components/Icons';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();
  const { showToast } = useToast();
  const welcomeShownRef = useRef(false);

  // Check if user is authenticated
  useEffect(() => {
    async function checkAuth() {
      try {
        // Verificar a sessão do Supabase
        const { authService } = await import('@/services/supabaseService');
        const session = await authService.getSession();
        
        if (!session) {
          // Redirecionar para a página inicial se não estiver autenticado
          router.push('/');
          return;
        }
        
        setIsAuthenticated(true);
        
        // Verificar se é o administrador principal
        const adminStatus = await authService.isAdmin();
        setIsAdmin(adminStatus);

        // Mostrar mensagem de boas-vindas apenas uma vez
        if (!welcomeShownRef.current) {
          setTimeout(() => {
            showToast('Bem-vindo ao Painel Administrativo!', 'success', 5000);
          }, 500);
          welcomeShownRef.current = true;
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
        router.push('/');
      }
    }
    
    checkAuth();
  }, [router]);
  
  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="font-inter">Verificando autenticação...</p>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 font-inter">Painel Administrativo</h1>
          <div className="mt-2 flex space-x-2">
            <StatusBadge status="ativo" text="Sistema Ativo" />
            <StatusBadge status="novo" variant="tag" />
          </div>
        </div>
        
        <button
          onClick={async () => {
            try {
              // Fazer logout via Supabase
              const { authService } = await import('@/services/supabaseService');
              const { success, error } = await authService.logout();
              
              if (error) {
                console.error('Erro ao fazer logout do Supabase:', error);
                showToast('Erro ao fazer logout.', 'error');
              } else {
                showToast('Logout realizado com sucesso!', 'info');
              }
              
              router.push('/');
            } catch (error) {
              console.error('Erro ao fazer logout:', error);
              showToast('Ocorreu um erro inesperado.', 'error');
              router.push('/');
            }
          }}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition duration-300 font-inter"
        >
          Sair
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Products Management */}
        <Link 
          href="/admin/products"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300"
        >
          <div className="flex items-center justify-center h-16 w-16 bg-blue-100 text-blue-700 rounded-full mb-4">
            <svg 
              className="w-8 h-8" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M20 7l-8-4-8 4m16 0l-8 4m-8-4l8 4m8 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2 font-inter">Produtos</h2>
          <p className="text-gray-600 font-inter">Gerenciar produtos da loja.</p>
        </Link>
        
        {/* Banner Management - Novo Card */}
        <Link 
          href="/admin/banners"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300"
        >
          <NotificationBadge count={1} color="green">
            <div className="flex items-center justify-center h-16 w-16 bg-orange-100 text-orange-700 rounded-full mb-4">
              <svg 
                className="w-8 h-8" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          </NotificationBadge>
          <h2 className="text-xl font-semibold text-gray-800 mb-2 font-inter">Banners</h2>
          <p className="text-gray-600 font-inter">Gerenciar banners da página inicial.</p>
          <div className="mt-2">
            <StatusBadge status="novo" size="sm" />
          </div>
        </Link>
        
        {/* Color Collections Management */}
        <Link 
          href="/admin/collections"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300"
        >
          <NotificationBadge count={3} color="blue">
            <div className="flex items-center justify-center h-16 w-16 bg-purple-100 text-purple-700 rounded-full mb-4">
              <svg 
                className="w-8 h-8" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                />
              </svg>
            </div>
          </NotificationBadge>
          <h2 className="text-xl font-semibold text-gray-800 mb-2 font-inter">Coleções de Cores</h2>
          <p className="text-gray-600 font-inter">Gerenciar coleções de cores Suvinil.</p>
        </Link>
        
        {/* Colors Management */}
        <Link 
          href="/admin/colors"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300"
        >
          <div className="flex items-center justify-center h-16 w-16 bg-yellow-100 text-yellow-700 rounded-full mb-4">
            <svg 
              className="w-8 h-8" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2 font-inter">Cores</h2>
          <p className="text-gray-600 font-inter">Gerenciar cores individuais.</p>
        </Link>
        
        {/* Stores Management */}
        <Link 
          href="/admin/stores"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300"
        >
          <div className="flex items-center justify-center h-16 w-16 bg-green-100 text-green-700 rounded-full mb-4">
            <svg 
              className="w-8 h-8" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2 font-inter">Lojas</h2>
          <p className="text-gray-600 font-inter">Gerenciar informações das lojas físicas.</p>
        </Link>
        
        {/* Sellers Management */}
        <Link 
          href="/admin/sellers"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300"
        >
          <NotificationBadge count={1} color="green">
            <div className="flex items-center justify-center h-16 w-16 bg-teal-100 text-teal-700 rounded-full mb-4">
              <UsersIcon className="w-8 h-8" />
            </div>
          </NotificationBadge>
          <h2 className="text-xl font-semibold text-gray-800 mb-2 font-inter">Vendedores</h2>
          <p className="text-gray-600 font-inter">Gerencie os vendedores das lojas físicas.</p>
          <div className="mt-2">
            <StatusBadge status="novo" size="sm" />
          </div>
        </Link>

        {/* User Management - Visible only for the main admin */}
        {isAdmin && (
          <Link 
            href="/admin/users"
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300"
          >
            <div className="flex items-center justify-center h-16 w-16 bg-indigo-100 text-indigo-700 rounded-full mb-4">
              <svg 
                className="w-8 h-8" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2 font-inter">Usuários</h2>
            <p className="text-gray-600 font-inter">Gerenciar usuários administrativos.</p>
            <div className="mt-2">
              <StatusBadge status="destaque" variant="dot" />
            </div>
          </Link>
        )}

        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300">
          <div className="flex items-center justify-center h-16 w-16 bg-pink-100 text-pink-700 rounded-full mb-4">
            <svg 
              className="w-8 h-8" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2 font-inter">Notificações</h2>
          <p className="text-gray-600 font-inter">Ver mensagens do sistema.</p>
          <div className="mt-4 space-y-2">
            <button 
              onClick={() => showToast('Operação realizada com sucesso!', 'success')}
              className="w-full px-3 py-1.5 bg-green-600 text-white rounded font-inter text-sm hover:bg-green-700"
            >
              Mensagem de sucesso
            </button>
            <button 
              onClick={() => showToast('Atenção: Verifique os dados inseridos.', 'warning')}
              className="w-full px-3 py-1.5 bg-yellow-500 text-white rounded font-inter text-sm hover:bg-yellow-600"
            >
              Mensagem de alerta
            </button>
            <button 
              onClick={() => showToast('Erro ao processar a solicitação.', 'error')}
              className="w-full px-3 py-1.5 bg-red-600 text-white rounded font-inter text-sm hover:bg-red-700"
            >
              Mensagem de erro
            </button>
          </div>
        </div>

        {/* Sistema e Manutenção */}
        {isAdmin && (
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300">
            <div className="flex items-center justify-center h-16 w-16 bg-gray-100 text-gray-700 rounded-full mb-4">
              <svg 
                className="w-8 h-8" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2 font-inter">Sistema</h2>
            <p className="text-gray-600 font-inter">Manutenção e configurações.</p>
            <div className="mt-4 space-y-2">
              <button 
                onClick={async () => {
                  try {
                    // Criar a tabela banners através do SQL direto
                    const { supabase } = await import('@/lib/supabase');
                    
                    // Usamos SQL direto em vez de rpc
                    const { error } = await supabase
                      .from('banners')
                      .insert({
                        id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',  // UUID fixo para o primeiro banner
                        title: 'Bem-vindo à Turatti',
                        subtitle: 'Materiais de qualidade para sua construção',
                        button_text: 'Conheça nossos produtos',
                        button_link: '/products',
                        image_url: 'https://images.unsplash.com/photo-1520209759809-a9bcb6cb3241?q=80&w=1000',
                        is_active: true,
                        order: 0,
                      })
                      .select();
                    
                    if (error) {
                      if (error.code === '42P01') {
                        // A tabela não existe, precisamos criá-la manualmente
                        // Instruir o usuário
                        showToast('A tabela banners não existe. Entre no painel Supabase para criá-la manualmente.', 'error');
                      } else {
                        throw error;
                      }
                    } else {
                      showToast('Banner inicial criado com sucesso!', 'success');
                    }
                    
                    // Limpar o cache do serviço
                    const { bannerService } = await import('@/services/supabaseService');
                    bannerService._tableCheckAttempted = false;
                    
                  } catch (error) {
                    console.error('Erro ao criar tabela banners:', error);
                    showToast('Para criar a tabela banners, acesse o Supabase e execute o SQL abaixo:', 'warning');
                    
                    // Mostrar o código SQL para criar manualmente
                    showToast(`CREATE TABLE IF NOT EXISTS public.banners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  subtitle TEXT,
  button_text TEXT,
  button_link TEXT,
  image_url TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);`, 'info', 15000);
                  }
                }}
                className="w-full px-3 py-1.5 bg-blue-600 text-white rounded font-inter text-sm hover:bg-blue-700"
              >
                Inicializar Banners
              </button>
            </div>
          </div>
        )}

        {/* Card de Vendedores */}
        <Link
          href="/admin/sellers"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300"
        >
          <NotificationBadge count={1} color="green">
            <div className="flex items-center justify-center h-16 w-16 bg-teal-100 text-teal-700 rounded-full mb-4">
              <UsersIcon className="w-8 h-8" />
            </div>
          </NotificationBadge>
          <h2 className="text-xl font-semibold text-gray-800 mb-2 font-inter">Vendedores</h2>
          <p className="text-gray-600 font-inter">Gerencie os vendedores das lojas físicas.</p>
          <div className="mt-2">
            <StatusBadge status="novo" size="sm" />
          </div>
        </Link>

        {/* Card de Diagnóstico */}
        <Link
          href="/admin/diagnostic"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300"
        >
          <div className="flex items-center justify-center h-16 w-16 bg-indigo-100 text-indigo-700 rounded-full mb-4">
            <LifeBuoyIcon className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2 font-inter">Diagnóstico</h2>
          <p className="text-gray-600 font-inter">Verifique e configure o estado do sistema.</p>
        </Link>
        
        {/* Card de Status */}
        <Link
          href="/admin/status"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300"
        >
          <div className="flex items-center justify-center h-16 w-16 bg-purple-100 text-purple-700 rounded-full mb-4">
            <SettingsIcon className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2 font-inter">Status</h2>
          <p className="text-gray-600 font-inter">Visualize o estado atual do sistema.</p>
          <div className="mt-2">
            <StatusBadge status="destaque" variant="dot" size="sm" />
          </div>
        </Link>
      </div>
    </div>
  );
}
