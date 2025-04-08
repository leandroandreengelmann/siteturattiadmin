'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function StatusPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirecionar para a página de status no painel admin após um pequeno delay
    const redirectTimer = setTimeout(() => {
      router.push('/admin/status');
    }, 1500);

    return () => clearTimeout(redirectTimer);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Status do Sistema</h1>
        <p className="mb-4">Esta página foi movida para o painel administrativo.</p>
        <p className="text-gray-600">Redirecionando para área administrativa...</p>
        <div className="mt-6 w-12 h-12 border-t-4 border-blue-600 border-solid rounded-full animate-spin mx-auto"></div>
      </div>
    </div>
  );
} 