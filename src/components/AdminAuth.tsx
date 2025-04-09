'use client';

import { usePathname } from 'next/navigation';
import AdminHeader from './AdminHeader';
import AdminFooter from './AdminFooter';

export default function AdminAuth({ children }: { children: React.ReactNode }) {
  // Componente simplificado sem restrições de acesso
  return (
    <>
      <AdminHeader />
      <main className="flex-grow">{children}</main>
      <AdminFooter />
    </>
  );
} 