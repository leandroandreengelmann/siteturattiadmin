'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SystemStatusPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [status, setStatus] = useState({
    database: { status: 'carregando', color: 'gray' },
    storage: { status: 'carregando', color: 'gray' },
    api: { status: 'carregando', color: 'gray' },
    server: { status: 'online', color: 'green' },
  });
  const router = useRouter();

  // Verificar autenticação e carregar status
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Verificar autenticação
        const { authService } = await import('@/services/supabaseService');
        const session = await authService.getSession();
        
        if (!session) {
          router.push('/');
          return;
        }
        
        setIsAuthenticated(true);
        
        // Simular verificação de status dos serviços
        // Em uma implementação real, você pode verificar cada serviço com chamadas reais
        setTimeout(() => {
          setStatus({
            database: { status: 'online', color: 'green' },
            storage: { status: 'online', color: 'green' },
            api: { status: 'online', color: 'green' },
            server: { status: 'online', color: 'green' },
          });
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
        router.push('/');
      }
    };
    
    checkAuth();
  }, [router]);
  
  if (!isAuthenticated) {
    return (
      <div className="p-6 text-center">
        <p>Verificando autenticação...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Status do Sistema</h1>
          <p className="text-gray-600">Monitoramento da saúde e disponibilidade dos serviços</p>
        </div>
        <Link 
          href="/admin"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
        >
          Voltar ao Painel
        </Link>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="border-b border-gray-200 px-6 py-4 bg-gray-50">
          <h2 className="font-semibold text-gray-700">Status dos Serviços</h2>
        </div>
        
        <div className="divide-y divide-gray-200">
          {Object.entries(status).map(([service, { status: serviceStatus, color }]) => (
            <div key={service} className="px-6 py-4 flex justify-between items-center">
              <div>
                <h3 className="font-medium capitalize">{service}</h3>
                <p className="text-sm text-gray-500">
                  {service === 'database' && 'Banco de dados Supabase'}
                  {service === 'storage' && 'Armazenamento de arquivos'}
                  {service === 'api' && 'API de comunicação'}
                  {service === 'server' && 'Servidor Next.js'}
                </p>
              </div>
              <div className={`px-3 py-1 rounded-full bg-${color}-100 text-${color}-800 text-sm font-medium`}>
                {serviceStatus}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-8 bg-white rounded-lg shadow-md overflow-hidden">
        <div className="border-b border-gray-200 px-6 py-4 bg-gray-50">
          <h2 className="font-semibold text-gray-700">Informações do Sistema</h2>
        </div>
        
        <div className="divide-y divide-gray-200">
          <div className="px-6 py-4 flex justify-between">
            <span className="text-gray-600">Versão</span>
            <span className="font-medium">1.0.0</span>
          </div>
          <div className="px-6 py-4 flex justify-between">
            <span className="text-gray-600">Ambiente</span>
            <span className="font-medium">Produção</span>
          </div>
          <div className="px-6 py-4 flex justify-between">
            <span className="text-gray-600">Última verificação</span>
            <span className="font-medium">{new Date().toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
} 