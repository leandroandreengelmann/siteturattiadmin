'use client';

import Link from 'next/link';

export default function AdminFooter() {
  return (
    <footer className="bg-white border-t border-gray-200 py-3 px-4 text-center text-sm text-gray-600">
      <div className="container mx-auto flex flex-wrap justify-center items-center gap-2">
        <span>&copy; {new Date().getFullYear()} Turatti</span>
        <span className="hidden md:inline">|</span>
        <Link 
          href="/admin/diagnostic" 
          className="text-blue-600 hover:text-blue-800 transition-colors"
        >
          Diagnóstico
        </Link>
        <span className="hidden md:inline">|</span>
        <Link 
          href="/admin/status" 
          className="text-blue-600 hover:text-blue-800 transition-colors"
        >
          Status do Sistema
        </Link>
        <span className="hidden md:inline">|</span>
        <button 
          onClick={async () => {
            try {
              const { authService } = await import('@/services/supabaseService');
              await authService.logout();
              window.location.href = '/admin';
            } catch (error) {
              console.error('Erro ao fazer logout:', error);
            }
          }}
          className="text-red-600 hover:text-red-800 transition-colors cursor-pointer"
        >
          Sair
        </button>
      </div>
    </footer>
  );
} 