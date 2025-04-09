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
    
    // Função para limpar atributos que causam incompatibilidade de hidratação
    const cleanupHydrationAttributes = () => {
      const htmlElement = document.documentElement;
      
      // Lista de atributos que podem causar problemas de hidratação
      const problematicAttributes = ['tracking', 'data-new-gr-c-s-check-loaded', 'data-gr-ext-installed'];
      
      // Remover todos os atributos problemáticos
      problematicAttributes.forEach(attr => {
        if (htmlElement.hasAttribute(attr)) {
          console.log(`Removendo atributo conflitante: ${attr}`);
          htmlElement.removeAttribute(attr);
        }
      });
      
      // Adicionar atributo indicando que a hidratação foi concluída
      htmlElement.setAttribute('data-hydrated', 'true');
      
      // Remover classe vsc-initialized que o VSCode adiciona
      const bodyElement = document.body;
      if (bodyElement.classList.contains('vsc-initialized')) {
        bodyElement.classList.remove('vsc-initialized');
      }
    };
    
    // Executar limpeza imediatamente
    cleanupHydrationAttributes();
    
    // Também executar após um pequeno delay para capturar atributos que possam ser adicionados por extensões
    const timeoutId = setTimeout(cleanupHydrationAttributes, 100);
    
    return () => clearTimeout(timeoutId);
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