'use client';

import AdminAuth from '@/components/AdminAuth';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminAuth>
      <div className="min-h-screen flex flex-col bg-gray-50">
        {/* AdminHeader e AdminFooter são carregados dentro do AdminAuth */}
        {children}
      </div>
    </AdminAuth>
  );
} 