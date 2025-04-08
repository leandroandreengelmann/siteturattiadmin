'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface TableStatus {
  status: string;
  count?: number;
  error?: string;
}

interface StatusData {
  connection: string;
  supabase_url: string;
  tables: Record<string, TableStatus>;
  error?: string;
}

export default function StatusPage() {
  const [status, setStatus] = useState<StatusData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStatus() {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('/api/status', {
          method: 'GET',
          headers: {
            'Cache-Control': 'no-cache'
          }
        });
        
        if (!response.ok) {
          throw new Error(`Erro na resposta: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        setStatus(data);
      } catch (err) {
        console.error('Erro ao buscar status:', err);
        setError(err instanceof Error ? err.message : 'Erro desconhecido ao verificar o status');
      } finally {
        setLoading(false);
      }
    }

    fetchStatus();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Verificando conexão com o Supabase...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-red-600">Erro ao verificar status</h1>
          
          <div className="mb-8">
            <Link href="/" className="text-blue-700 hover:underline">
              ← Voltar para a página inicial
            </Link>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
            <p className="text-red-700">{error}</p>
          </div>

          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-800"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Status do Sistema</h1>
        
        <div className="mb-8">
          <Link href="/" className="text-blue-700 hover:underline">
            ← Voltar para a página inicial
          </Link>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Conexão com o Supabase</h2>
          
          {status ? (
            <>
              <div className="mb-4">
                <div className="flex items-center mb-2">
                  <span className="font-medium mr-2">Status:</span>
                  <span className={`px-2 py-1 rounded text-sm ${status.connection === 'ok' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {status.connection === 'ok' ? 'Conectado' : 'Erro'}
                  </span>
                </div>
                <div className="mb-2">
                  <span className="font-medium">URL:</span> {status.supabase_url}
                </div>
                {status.error && (
                  <div className="text-red-600">
                    <span className="font-medium">Erro:</span> {status.error}
                  </div>
                )}
              </div>

              <h3 className="text-xl font-semibold mb-3">Tabelas</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="py-2 px-4 border-b text-left">Tabela</th>
                      <th className="py-2 px-4 border-b text-left">Status</th>
                      <th className="py-2 px-4 border-b text-left">Registros</th>
                    </tr>
                  </thead>
                  <tbody>
                    {status.tables && Object.entries(status.tables).map(([tableName, tableStatus]) => (
                      <tr key={tableName} className="hover:bg-gray-50">
                        <td className="py-2 px-4 border-b">{tableName}</td>
                        <td className="py-2 px-4 border-b">
                          <span className={`px-2 py-1 rounded text-sm ${tableStatus.status === 'ok' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {tableStatus.status === 'ok' ? 'OK' : 'Erro'}
                          </span>
                        </td>
                        <td className="py-2 px-4 border-b">
                          {tableStatus.status === 'ok' 
                            ? tableStatus.count 
                            : <span className="text-red-600">{tableStatus.error}</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <div className="text-red-600">
              Não foi possível obter informações de status
            </div>
          )}
        </div>

        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Próximos Passos</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Verifique o arquivo <code className="bg-gray-100 px-1 py-0.5 rounded">SUPABASE_SETUP.md</code> para instruções detalhadas</li>
            <li>Execute <code className="bg-gray-100 px-1 py-0.5 rounded">node check-supabase.js</code> para verificar a conexão via terminal</li>
            <li>Acesse o <a href="https://app.supabase.com" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:underline">Dashboard do Supabase</a> para gerenciar seu banco de dados</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 