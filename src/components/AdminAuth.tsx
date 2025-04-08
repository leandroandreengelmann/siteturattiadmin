'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Session } from '@supabase/supabase-js';
import AdminHeader from './AdminHeader';
import AdminFooter from './AdminFooter';

export default function AdminAuth({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  
  // Função para verificar a sessão e renovar quando necessário
  useEffect(() => {
    async function checkSession() {
      try {
        const { authService } = await import('@/services/supabaseService');
        
        // Verificar sessão atual
        let currentSession = await authService.getSession();
        
        // Se não houver sessão, tentar renovar
        if (!currentSession) {
          console.log('Sessão não encontrada, tentando renovar...');
          currentSession = await authService.refreshSession();
        }
        
        // Se ainda não tiver sessão após tentativa de renovação
        if (!currentSession && pathname !== '/admin') {
          console.log('Redirecionando para login...');
          router.push('/admin');
          return;
        }
        
        setSession(currentSession);
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
        if (pathname !== '/admin') {
          router.push('/admin');
        }
      } finally {
        setIsLoading(false);
      }
    }
    
    checkSession();
    
    // Configurar verificação periódica para renovar o token antes de expirar
    const intervalId = setInterval(async () => {
      try {
        const { authService } = await import('@/services/supabaseService');
        const currentSession = await authService.getSession();
        
        if (currentSession) {
          // Verificar se o token expira em menos de 5 minutos
          const expiresAt = currentSession.expires_at || 0;
          const now = Math.floor(Date.now() / 1000);
          const timeToExpire = expiresAt - now;
          
          if (timeToExpire < 300) { // 5 minutos em segundos
            console.log('Token expirando em breve, renovando...');
            const refreshedSession = await authService.refreshSession();
            setSession(refreshedSession);
          }
        }
      } catch (error) {
        console.error('Erro ao renovar sessão automaticamente:', error);
      }
    }, 60000); // Verificar a cada minuto
    
    return () => clearInterval(intervalId);
  }, [router, pathname]);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  // Se estiver na página de admin (login) e já tiver sessão, redirecionar para dashboard
  if (pathname === '/admin' && session) {
    router.push('/admin/dashboard');
    return null;
  }
  
  return (
    <>
      {/* Só mostrar cabeçalho e rodapé se tiver sessão ou estiver na página de login */}
      {(session || pathname === '/admin') && (
        <>
          <AdminHeader />
          <main className="flex-grow">{children}</main>
          <AdminFooter />
        </>
      )}
      
      {/* Caso contrário, só mostrar um loader enquanto redireciona */}
      {!session && pathname !== '/admin' && (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      )}
    </>
  );
} 