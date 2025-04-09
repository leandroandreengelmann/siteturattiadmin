'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  
  // Verificar rolagem
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  return (
    <header className={`sticky top-0 z-50 bg-white ${isScrolled ? 'shadow-sm' : 'border-b border-gray-100'}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/admin" className="font-semibold text-gray-800">
            Painel Administrativo
          </Link>
          
          <nav className="hidden md:flex space-x-6">
            <Link 
              href="/admin" 
              className={`text-sm ${pathname === '/admin' ? 'text-blue-600 font-medium' : 'text-gray-600 hover:text-gray-900'}`}
            >
              Dashboard
            </Link>
            <Link 
              href="/admin/products" 
              className={`text-sm ${pathname.includes('/admin/products') ? 'text-blue-600 font-medium' : 'text-gray-600 hover:text-gray-900'}`}
            >
              Produtos
            </Link>
            <Link 
              href="/admin/colors" 
              className={`text-sm ${pathname.includes('/admin/colors') ? 'text-blue-600 font-medium' : 'text-gray-600 hover:text-gray-900'}`}
            >
              Cores
            </Link>
            <Link 
              href="/admin/banners" 
              className={`text-sm ${pathname.includes('/admin/banners') ? 'text-blue-600 font-medium' : 'text-gray-600 hover:text-gray-900'}`}
            >
              Banners
            </Link>
          </nav>
          
          <div className="md:hidden">
            <button className="text-gray-600 focus:outline-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
} 