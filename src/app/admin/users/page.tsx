'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface User {
  id: string;
  email: string;
  created_at: string;
  user_metadata: {
    name?: string;
  };
}

export default function AdminUsersPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [newUser, setNewUser] = useState({
    email: '',
    password: '',
    name: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  // Verificar autenticação e permissões
  useEffect(() => {
    async function checkAuth() {
      try {
        const { authService } = await import('@/services/supabaseService');
        const session = await authService.getSession();
        
        if (!session) {
          router.push('/');
          return;
        }
        
        setIsAuthenticated(true);
        
        // Verificar se o usuário é administrador
        const adminStatus = await authService.isAdmin();
        setIsAdmin(adminStatus);
        
        if (!adminStatus) {
          // Não tem permissão para estar nesta página
          router.push('/admin');
          return;
        }
        
        // Carregar lista de usuários
        await loadUsers();
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
        setIsLoading(false);
      }
    }
    
    checkAuth();
  }, [router]);

  // Função para carregar usuários
  async function loadUsers() {
    try {
      setIsLoading(true);
      
      // Importar o Supabase client
      const { supabase } = await import('@/lib/supabase');
      
      // Buscar usuários no Supabase
      const { data, error } = await supabase.auth.admin.listUsers();
      
      if (error) {
        throw error;
      }
      
      if (data?.users) {
        setUsers(data.users as User[]);
      }
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
      setError('Não foi possível carregar a lista de usuários.');
    } finally {
      setIsLoading(false);
    }
  }

  // Função para criar novo usuário
  async function handleCreateUser(e: React.FormEvent) {
    e.preventDefault();
    
    try {
      setError(null);
      setSuccess(null);
      setIsLoading(true);
      
      // Validar formulário
      if (!newUser.email || !newUser.password || !newUser.name) {
        setError('Todos os campos são obrigatórios.');
        setIsLoading(false);
        return;
      }
      
      // Importar o serviço de autenticação
      const { authService } = await import('@/services/supabaseService');
      
      // Criar o usuário
      const { success, error, message } = await authService.createUser(
        newUser.email,
        newUser.password,
        { name: newUser.name }
      );
      
      if (!success) {
        setError(error?.message || 'Erro ao criar usuário.');
        return;
      }
      
      // Limpar o formulário
      setNewUser({
        email: '',
        password: '',
        name: '',
      });
      
      // Exibir mensagem de sucesso
      setSuccess(message || 'Usuário criado com sucesso!');
      
      // Recarregar a lista de usuários
      await loadUsers();
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      setError('Ocorreu um erro ao criar o usuário.');
    } finally {
      setIsLoading(false);
    }
  }

  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p>Verificando permissões...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Gerenciar Usuários</h1>
        
        <Link 
          href="/admin"
          className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md transition duration-300"
        >
          Voltar ao Painel
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Lista de Usuários */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Usuários Administrativos</h2>
          
          {isLoading ? (
            <p>Carregando...</p>
          ) : error ? (
            <div className="bg-red-100 text-red-700 p-4 rounded-md mb-4">
              {error}
            </div>
          ) : (
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nome
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Criado em
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-6 py-4 text-center text-gray-500">
                        Nenhum usuário encontrado.
                      </td>
                    </tr>
                  ) : (
                    users.map((user) => (
                      <tr key={user.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {user.user_metadata?.name || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {user.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {new Date(user.created_at).toLocaleDateString('pt-BR')}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
        
        {/* Formulário de Novo Usuário */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Adicionar Novo Usuário</h2>
          
          {success && (
            <div className="bg-green-100 text-green-700 p-4 rounded-md mb-4">
              {success}
            </div>
          )}
          
          {error && (
            <div className="bg-red-100 text-red-700 p-4 rounded-md mb-4">
              {error}
            </div>
          )}
          
          <form onSubmit={handleCreateUser} className="bg-white shadow-md rounded-lg p-6">
            <div className="mb-4">
              <label htmlFor="name" className="block text-gray-700 mb-2">
                Nome Completo
              </label>
              <input
                type="text"
                id="name"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="password" className="block text-gray-700 mb-2">
                Senha
              </label>
              <input
                type="password"
                id="password"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
              />
              <p className="text-sm text-gray-500 mt-1">
                A senha deve ter pelo menos 6 caracteres.
              </p>
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                className={`bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-md transition duration-300 ${
                  isLoading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
                disabled={isLoading}
              >
                {isLoading ? 'Processando...' : 'Criar Usuário'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 