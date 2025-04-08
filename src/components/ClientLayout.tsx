'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith('/admin');
  
  // Estado para controlar o que mostrar quando carregado do lado do cliente
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    // Este código só executa no cliente para evitar problemas de hidratação
    setIsClient(true);
    
    // Remover atributos que causam incompatibilidade de hidratação
    const htmlElement = document.documentElement;
    if (htmlElement.hasAttribute('tracking')) {
      htmlElement.removeAttribute('tracking');
    }
    
    // Remover classe vsc-initialized que o VSCode adiciona
    const bodyElement = document.body;
    if (bodyElement.classList.contains('vsc-initialized')) {
      bodyElement.classList.remove('vsc-initialized');
    }
  }, []);
  
  return (
    <>
      {!isAdminPage && <Header />}
      <main className={`flex-grow ${!isAdminPage ? 'pt-16 sm:pt-16 md:pt-16' : ''}`}>
        {children}
      </main>
      {!isAdminPage && <Footer />}
    </>
  );
} 