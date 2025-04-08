'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Detectar rolagem da página
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    // Verificar na montagem do componente
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  // Impedir o scroll do body quando o menu móvel está aberto
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  const headerHeight = scrolled ? '56px' : '64px';

  return (
    <header 
      className={`
        fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out
        ${scrolled 
          ? 'bg-white shadow-md py-2' 
          : 'bg-white shadow-sm py-3 md:py-4'
        }
      `}
      style={{ height: headerHeight }}
    >
      <div className="container mx-auto px-3 md:px-4 flex justify-between items-center h-full">

        {/* Logo */}
        <Link 
          href="/" 
          className="text-2xl md:text-3xl font-bold text-blue-800 transition-all duration-300 hover:opacity-80"
          aria-label="Turatti - Página Inicial"
        >
          Turatti
        </Link>

        {/* Mobile menu button */}
        <button
          className="md:hidden focus:outline-none focus:ring-2 focus:ring-blue-500 p-1 rounded z-50"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Alternar menu"
          aria-expanded={isMenuOpen}
        >
          <svg
            className="w-7 h-7 text-gray-800"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            {isMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-4 lg:space-x-6">
          <Link 
            href="/" 
            className="text-gray-700 hover:text-blue-800 font-medium transition duration-200 relative group py-2"
          >
            Início
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-800 transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link 
            href="/products" 
            className="text-gray-700 hover:text-blue-800 font-medium transition duration-200 relative group py-2"
          >
            Produtos
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-800 transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link 
            href="/collections" 
            className="text-gray-700 hover:text-blue-800 font-medium transition duration-200 relative group py-2"
          >
            Cores Suvinil
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-800 transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link 
            href="https://wa.me/5511999999999" 
            target="_blank" 
            className="bg-green-600 hover:bg-green-700 text-white px-3 lg:px-4 py-2 rounded-lg transition duration-300 flex items-center shadow-sm hover:shadow text-sm lg:text-base"
            rel="noopener noreferrer"
            aria-label="Contatar vendedor via WhatsApp"
          >
            <span className="mr-2">Fale com um vendedor</span>
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
          </Link>
        </nav>

        {/* Mobile Navigation */}
        <div 
          className={`
            fixed inset-0 bg-white md:hidden z-40 transition-transform duration-300 ease-in-out transform
            ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} 
            pt-[calc(var(--header-height))]
            shadow-lg border-r border-gray-200
          `}
          style={{ '--header-height': headerHeight } as React.CSSProperties}
        >
          <nav className="flex flex-col p-6 space-y-4 bg-white">
            <Link 
              href="/" 
              className="text-gray-700 hover:text-blue-800 py-3 font-medium text-lg border-b border-gray-100"
              onClick={() => setIsMenuOpen(false)}
            >
              Início
            </Link>
            <Link 
              href="/products" 
              className="text-gray-700 hover:text-blue-800 py-3 font-medium text-lg border-b border-gray-100"
              onClick={() => setIsMenuOpen(false)}
            >
              Produtos
            </Link>
            <Link 
              href="/collections" 
              className="text-gray-700 hover:text-blue-800 py-3 font-medium text-lg border-b border-gray-100"
              onClick={() => setIsMenuOpen(false)}
            >
              Cores Suvinil
            </Link>
            <Link 
              href="https://wa.me/5511999999999" 
              target="_blank" 
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-md text-center transition duration-300 flex items-center justify-center mt-4"
              onClick={() => setIsMenuOpen(false)}
              rel="noopener noreferrer"
            >
              <span className="mr-2">Fale com um vendedor</span>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
            </Link>
          </nav>
        </div>

        {/* Overlay para fechar o menu ao clicar fora */}
        {isMenuOpen && (
          <div 
            className="fixed inset-0 bg-black/30 z-30 md:hidden"
            onClick={() => setIsMenuOpen(false)}
            aria-hidden="true"
          />
        )}
      </div>
    </header>
  );
}
