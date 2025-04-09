'use client';

import AdminAuth from '@/components/AdminAuth';
import { useState, useEffect } from 'react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null; // Evitar renderização no servidor para usar cores do tema
  }

  return (
    <AdminAuth>
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-gray-100">
        <div className="flex-grow flex flex-col">
          {/* Efeito de ondas decorativas no topo */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-700 z-10"></div>
          
          {/* Conteúdo principal */}
          <main className="flex-grow">
            {children}
          </main>
        </div>
        
        {/* Efeito de ondas decorativas no fundo */}
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-800 h-1 mt-auto">
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-blue-200 opacity-5" 
               style={{ clipPath: 'polygon(0 100%, 100% 100%, 100% 30%, 75% 50%, 50% 30%, 25% 50%, 0 30%)' }}>
          </div>
        </div>
      </div>
    </AdminAuth>
  );
} 