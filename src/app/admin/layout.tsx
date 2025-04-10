'use client';

import React, { PropsWithChildren, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { 
  Package, 
  Users, 
  Settings, 
  Store, 
  BarChart3, 
  Menu, 
  X, 
  Palette,
  Bell,
  LineChart
} from 'lucide-react';
import { cn } from '@/lib/utils';

const menuItems = [
  {
    title: 'Dashboard',
    href: '/admin',
    icon: BarChart3,
  },
  {
    title: 'Analytics',
    href: '/admin/analytics',
    icon: LineChart,
  },
  {
    title: 'Produtos',
    href: '/admin/products',
    icon: Package,
  },
  {
    title: 'Coleções',
    href: '/admin/collections',
    icon: Palette,
  },
  {
    title: 'Cores',
    href: '/admin/colors',
    icon: Palette,
  },
  {
    title: 'Banners',
    href: '/admin/banners',
    icon: Package,
  },
  {
    title: 'Lojas',
    href: '/admin/stores',
    icon: Store,
  },
  {
    title: 'Vendedores',
    href: '/admin/sellers',
    icon: Users,
  },
];

export default function AdminLayout({ children }: PropsWithChildren) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar para desktop */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex flex-col flex-grow bg-white border-r border-slate-200 pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4 mb-5">
            <Link href="/admin" className="flex items-center">
              <div className="relative w-8 h-8 mr-2">
                <Image
                  src="/logo-turatti-square.png"
                  alt="Turatti"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-xl font-bold text-blue-600">Turatti</span>
            </Link>
          </div>
          <div className="mt-5 flex-grow flex flex-col">
            <nav className="flex-1 px-2 space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'group flex items-center px-2 py-2.5 text-lg font-medium rounded-md transition-all',
                      isActive
                        ? 'bg-sky-50 text-sky-700'
                        : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                    )}
                  >
                    <Icon
                      className={cn(
                        'mr-3 flex-shrink-0 h-5 w-5',
                        isActive ? 'text-sky-600' : 'text-slate-500 group-hover:text-slate-600'
                      )}
                    />
                    {item.title}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="md:pl-64 flex flex-col flex-1">
        {/* Header superior */}
        <div className="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-white shadow-sm border-b border-slate-200">
          <button
            type="button"
            className="px-4 border-r border-slate-200 text-slate-500 md:hidden"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Abrir menu</span>
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>

          <div className="flex-1 flex justify-center md:justify-end space-x-2 px-4">
            <div className="flex items-center">
              <button 
                type="button" 
                className="p-2 rounded-full text-slate-500 hover:text-slate-600 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
              >
                <span className="sr-only">Ver notificações</span>
                <Bell className="h-5 w-5" aria-hidden="true" />
              </button>
              
              <div className="ml-3 relative">
                <div className="flex items-center space-x-3">
                  <div className="flex flex-col leading-tight">
                    <span className="text-lg font-medium text-slate-800">
                      Administrador
                    </span>
                    <span className="text-base text-slate-500">
                      admin@turatti.com.br
                    </span>
                  </div>
                  <Image
                    className="h-8 w-8 rounded-full bg-slate-200"
                    src="/avatars/admin.png"
                    alt="Avatar do administrador"
                    width={32}
                    height={32}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Menu móvel */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 flex z-40 md:hidden">
            <div
              className="fixed inset-0 bg-slate-600 bg-opacity-75"
              onClick={() => setMobileMenuOpen(false)}
            ></div>
            <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
              <div className="absolute top-0 right-0 -mr-12 pt-2">
                <button
                  type="button"
                  className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="sr-only">Fechar menu</span>
                  <X className="h-6 w-6 text-white" aria-hidden="true" />
                </button>
              </div>
              <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
                <div className="flex-shrink-0 flex items-center px-4">
                  <Link href="/admin" className="flex items-center">
                    <div className="relative w-8 h-8 mr-2">
                      <Image
                        src="/logo-turatti-square.png"
                        alt="Turatti"
                        fill
                        className="object-contain"
                      />
                    </div>
                    <span className="text-xl font-bold text-blue-600">Turatti</span>
                  </Link>
                </div>
                <nav className="mt-5 px-2 space-y-1">
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          'group flex items-center px-2 py-2.5 text-lg font-medium rounded-md',
                          isActive
                            ? 'bg-sky-50 text-sky-700'
                            : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                        )}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Icon
                          className={cn(
                            'mr-3 flex-shrink-0 h-5 w-5',
                            isActive ? 'text-sky-600' : 'text-slate-500 group-hover:text-slate-600'
                          )}
                        />
                        {item.title}
                      </Link>
                    );
                  })}
                </nav>
              </div>
            </div>
          </div>
        )}

        {/* Conteúdo da página */}
        <main className="flex-1">
          <div className="py-6 mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            {children}
          </div>
        </main>

        {/* Rodapé */}
        <footer className="bg-white border-t border-slate-200 mt-auto">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-center items-center text-center md:text-left">
              <div className="flex items-center">
                <div className="relative w-6 h-6 mr-2">
                  <Image 
                    src="/logo-turatti-square.png" 
                    alt="Turatti" 
                    fill 
                    className="object-contain"
                  />
                </div>
                <span className="text-lg text-slate-500">
                  © {new Date().getFullYear()} Turatti Materiais para Construção. Todos os direitos reservados.
                </span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
} 