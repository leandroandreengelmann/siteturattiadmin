import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useToast } from '@/components/ToastProvider';
import { AuthError } from '@supabase/supabase-js';

interface ErrorWithMessage {
  message?: string;
}

export default function Footer() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<ErrorWithMessage | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { showToast } = useToast();

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const { authService } = await import('@/services/supabaseService');
        const session = await authService.getSession();
        
        if (session && session.user) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error('Erro ao verificar sessão:', error);
        setIsLoggedIn(false);
      }
    };

    checkLogin();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!email || !password) {
      showToast('Por favor, preencha todos os campos.', 'warning');
      setIsLoading(false);
      return;
    }

    try {
      const { authService } = await import('@/services/supabaseService');
      const result = await authService.login(email, password);

      if (result.success) {
        showToast('Login realizado com sucesso!', 'success');
        setIsLoggedIn(true);
        router.push('/admin');
      } else {
        let errorMessage = 'Erro ao realizar login.';
        
        if (result.error?.message) {
          if (result.error.message.includes('Invalid login credentials')) {
            errorMessage = 'Credenciais inválidas. Verifique seu email e senha.';
          } else if (result.error.message.includes('Email not confirmed')) {
            errorMessage = 'Email não confirmado. Verifique sua caixa de entrada.';
          }
        }
        
        showToast(errorMessage, 'error');
        setError(result.error as ErrorWithMessage || { message: 'Erro desconhecido' });
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      showToast('Ocorreu um erro ao processar seu login.', 'error');
      setError({ message: 'Erro ao conectar ao serviço de autenticação' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const { authService } = await import('@/services/supabaseService');
      const result = await authService.logout();

      if (result.success) {
        showToast('Logout realizado com sucesso!', 'success');
        setIsLoggedIn(false);
        router.push('/');
      } else {
        showToast('Erro ao realizar logout.', 'error');
        console.error('Erro ao fazer logout:', result.error);
      }
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      showToast('Ocorreu um erro ao processar seu logout.', 'error');
    }
  };

  return (
    <footer className="bg-white shadow-md mt-10 p-6 rounded-lg">
      {!isLoggedIn ? (
        <div className="max-w-md mx-auto">
          <h2 className="text-xl font-semibold text-center mb-4 font-inter">Acesso Administrativo</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 font-inter">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2 font-inter"
                placeholder="seu@email.com"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 font-inter">
                Senha
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2 font-inter"
                placeholder="********"
                required
              />
            </div>
            <div className="flex items-center justify-between">
              <Link href="/recuperar-senha" className="text-sm text-blue-600 hover:text-blue-800 font-inter">
                Esqueceu a senha?
              </Link>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 font-inter ${
                isLoading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? 'Processando...' : 'Entrar'}
            </button>
            {error && (
              <p className="text-sm text-red-600 text-center font-inter">
                {error.message || 'Erro ao fazer login. Tente novamente.'}
              </p>
            )}
          </form>
        </div>
      ) : (
        <div className="text-center">
          <p className="text-gray-700 mb-4 font-inter">Você está conectado como administrador</p>
          <div className="flex justify-center space-x-4">
            <Link href="/admin" className="text-blue-600 hover:text-blue-800 font-inter">
              Painel Admin
            </Link>
            <button
              onClick={handleLogout}
              className="text-red-600 hover:text-red-800 bg-transparent border-none p-0 cursor-pointer font-inter"
            >
              Sair
            </button>
          </div>
        </div>
      )}
    </footer>
  );
} 