'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Store } from '@/data/types';

export default function Footer() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [stores, setStores] = useState<Store[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  useEffect(() => {
    async function loadStores() {
      try {
        const { storeService } = await import('@/services/supabaseService');
        const storeData = await storeService.getAll();
        setStores(storeData);
      } catch (error) {
        console.error('Erro ao carregar lojas:', error);
      }
    }
    
    loadStores();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginError('');
    
    try {
      // Validar inputs
      if (!username || !password) {
        setLoginError('Usuário e senha são obrigatórios');
        setIsLoading(false);
        return;
      }
      
      // Importar o serviço de autenticação do Supabase
      const { authService } = await import('@/services/supabaseService');
      
      // Formatar o email baseado no nome de usuário
      const email = username.includes('@') ? username : `${username}@turatti.com`;
      
      console.log('Tentando login com Supabase:', { email });
      
      // Tentar fazer login com o Supabase
      const { success, error } = await authService.login(email, password);
      
      if (success) {
        console.log('Login com Supabase bem-sucedido');
        window.location.href = '/admin';
      } else {
        console.error('Erro no login com Supabase:', error);
        if (error?.message) {
          setLoginError(
            error.message.includes('Invalid login credentials') 
              ? 'Credenciais inválidas. Verifique seu usuário e senha.' 
              : `Erro no login: ${error.message}`
          );
        } else {
          setLoginError('Erro ao fazer login. Tente novamente.');
        }
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      setLoginError('Ocorreu um erro inesperado. Tente novamente mais tarde.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Store Information */}
          <div>
            <h3 className="text-xl font-bold mb-4">Nossas Lojas</h3>
            <div className="space-y-4">
              {stores.map((store) => (
                <div key={store.id} className="mb-2">
                  <h4 className="font-semibold">{store.name}</h4>
                  <p>{store.city}</p>
                  <p>{store.phone}</p>
                  <p>{store.hours}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4">Links Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="hover:text-blue-300">
                  Início
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-blue-300">
                  Produtos
                </Link>
              </li>
              <li>
                <Link href="/collections" className="hover:text-blue-300">
                  Cores Suvinil
                </Link>
              </li>
            </ul>
          </div>

          {/* Admin Login */}
          <div>
            <h3 className="text-xl font-bold mb-4">Área Administrativa</h3>
            <button
              onClick={() => setShowLoginModal(true)}
              className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-md transition duration-300"
            >
              Login Administrativo
            </button>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-4 text-center">
          <p>&copy; {new Date().getFullYear()} Turatti Materiais para Construção. Todos os direitos reservados.</p>
          <p className="mt-2">
            <Link href="/admin" className="text-blue-700 hover:underline">
              Área Administrativa
            </Link>
            {' • '}
            <Link href="/status" className="text-blue-700 hover:underline">
              Status do Sistema
            </Link>
          </p>
        </div>
      </div>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">Login Administrativo</h3>
              <button
                onClick={() => {
                  setShowLoginModal(false);
                  setLoginError('');
                  setUsername('');
                  setPassword('');
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            {loginError && (
              <div className="mb-4 p-2 bg-red-100 text-red-700 rounded border border-red-300">
                {loginError}
              </div>
            )}
            <form onSubmit={handleLogin}>
              <div className="mb-4">
                <label htmlFor="username" className="block text-gray-700 mb-2">
                  Usuário
                </label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="mb-4">
                <label htmlFor="password" className="block text-gray-700 mb-2">
                  Senha
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="mb-4">
                <Link 
                  href="/recuperar-senha" 
                  className="text-sm text-blue-600 hover:text-blue-800"
                  onClick={() => setShowLoginModal(false)}
                >
                  Esqueceu a senha?
                </Link>
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className={`bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-md transition duration-300 ${
                    isLoading ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                  disabled={isLoading}
                >
                  {isLoading ? 'Entrando...' : 'Entrar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </footer>
  );
}
