'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminHeader() {
  const pathname = usePathname();
  
  return (
    <header className="bg-blue-800 text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-lg font-semibold">Painel Administrativo - Turatti</h1>
        </div>
        
        <nav className="hidden md:flex space-x-4 text-sm">
          <Link 
            href="/admin" 
            className={`px-2 py-1 rounded-md ${
              pathname === '/admin' ? 'bg-blue-900 font-medium' : 'hover:bg-blue-700'
            } transition-colors`}
          >
            Dashboard
          </Link>
          <Link 
            href="/admin/products" 
            className={`px-2 py-1 rounded-md ${
              pathname?.startsWith('/admin/products') ? 'bg-blue-900 font-medium' : 'hover:bg-blue-700'
            } transition-colors`}
          >
            Produtos
          </Link>
          <Link 
            href="/admin/collections" 
            className={`px-2 py-1 rounded-md ${
              pathname?.startsWith('/admin/collections') ? 'bg-blue-900 font-medium' : 'hover:bg-blue-700'
            } transition-colors`}
          >
            Coleções
          </Link>
          <Link 
            href="/admin/banners" 
            className={`px-2 py-1 rounded-md ${
              pathname?.startsWith('/admin/banners') ? 'bg-blue-900 font-medium' : 'hover:bg-blue-700'
            } transition-colors`}
          >
            Banners
          </Link>
        </nav>
        
        <div className="flex items-center md:hidden">
          <button className="text-white p-1 focus:outline-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Indicador de ambiente para debug */}
      {process.env.NODE_ENV === 'development' && (
        <div className="bg-yellow-500 text-black text-xs text-center py-0.5">
          Ambiente de Desenvolvimento
        </div>
      )}
    </header>
  );
} 