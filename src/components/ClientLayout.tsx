'use client';

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