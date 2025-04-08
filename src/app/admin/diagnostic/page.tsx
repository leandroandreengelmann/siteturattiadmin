'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useToast } from '@/components/ToastProvider';

export default function DiagnosticPage() {
  const [diagnosticData, setDiagnosticData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [setupStatus, setSetupStatus] = useState<any>(null);
  const [isSettingUp, setIsSettingUp] = useState(false);
  const { showToast } = useToast();

  const fetchDiagnostic = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/debug');
      const data = await response.json();
      setDiagnosticData(data);
    } catch (error) {
      console.error('Erro ao buscar diagnóstico:', error);
      showToast('Erro ao buscar diagnóstico', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const setupDatabase = async () => {
    setIsSettingUp(true);
    try {
      // Primeiro, configurar o banco de dados
      const dbResponse = await fetch('/api/setup-db');
      const dbData = await dbResponse.json();
      
      // Em seguida, configurar o armazenamento
      const storageResponse = await fetch('/api/setup-storage');
      const storageData = await storageResponse.json();
      
      // Por último, configurar a autenticação
      const authResponse = await fetch('/api/setup-auth');
      const authData = await authResponse.json();
      
      setSetupStatus({
        database: dbData,
        storage: storageData,
        auth: authData
      });
      
      if (dbData.success || authData.success || storageData.success) {
        showToast('Configuração concluída com sucesso!', 'success');
      } else {
        showToast('Erro na configuração. Verifique os detalhes.', 'error');
      }
      
      // Atualizar os dados de diagnóstico
      await fetchDiagnostic();
    } catch (error) {
      console.error('Erro ao configurar sistema:', error);
      showToast('Erro ao configurar sistema', 'error');
    } finally {
      setIsSettingUp(false);
    }
  };

  useEffect(() => {
    fetchDiagnostic();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Diagnóstico do Sistema</h1>
        <Link href="/admin" className="text-blue-700 hover:underline">
          Voltar ao Painel
        </Link>
      </div>

      <div className="grid gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Status da Conexão</h2>
          
          <div className="flex gap-4 mb-6">
            <button
              onClick={fetchDiagnostic}
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? 'Carregando...' : 'Atualizar Status'}
            </button>
            
            <button
              onClick={setupDatabase}
              disabled={isSettingUp}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
            >
              {isSettingUp ? 'Configurando...' : 'Configurar Banco de Dados'}
            </button>
          </div>
          
          {diagnosticData ? (
            <div className="space-y-4">
              <div className="p-4 border rounded-md">
                <h3 className="font-medium mb-2">Informações Gerais</h3>
                <p><span className="font-semibold">Ambiente:</span> {diagnosticData.environment}</p>
                <p><span className="font-semibold">Timestamp:</span> {new Date(diagnosticData.timestamp).toLocaleString()}</p>
                <p>
                  <span className="font-semibold">URL do Supabase:</span> {' '}
                  <code className="bg-gray-100 px-1 py-0.5 rounded">{diagnosticData.supabase.url}</code>
                </p>
                <p>
                  <span className="font-semibold">Status da Conexão:</span> {' '}
                  <span className={`px-2 py-0.5 rounded ${diagnosticData.supabase.connection === 'OK' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {diagnosticData.supabase.connection}
                  </span>
                </p>
                <p>
                  <span className="font-semibold">Autenticação:</span> {' '}
                  <span className={`px-2 py-0.5 rounded ${diagnosticData.supabase.auth === 'Autenticado' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {diagnosticData.supabase.auth}
                  </span>
                </p>
              </div>
              
              <div className="p-4 border rounded-md">
                <h3 className="font-medium mb-2">Tabelas do Banco de Dados</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tabela
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Detalhes
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {Object.entries(diagnosticData.supabase.tables).map(([tableName, tableData]: [string, any]) => (
                        <tr key={tableName}>
                          <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                            {tableName}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm">
                            <span className={`px-2 py-0.5 rounded ${tableData.exists ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                              {tableData.exists ? 'OK' : 'Erro'}
                            </span>
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                            {tableData.exists ? 
                              `Registros: ${tableData.count || 0}` : 
                              tableData.error || 'Tabela não existe'
                            }
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              {isLoading ? (
                <p>Carregando informações de diagnóstico...</p>
              ) : (
                <p>Nenhuma informação de diagnóstico disponível</p>
              )}
            </div>
          )}
        </div>
        
        {/* Resultados da configuração */}
        {setupStatus && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Resultados da Configuração</h2>
            
            <div className="space-y-4">
              {/* Resultados do banco de dados */}
              <div className="p-4 border rounded-md">
                <h3 className="font-medium mb-2">Banco de Dados</h3>
                <p>
                  <span className="font-semibold">Status:</span> {' '}
                  <span className={`px-2 py-0.5 rounded ${setupStatus.database.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {setupStatus.database.success ? 'Sucesso' : 'Erro'}
                  </span>
                </p>
                <p><span className="font-semibold">Mensagem:</span> {setupStatus.database.message}</p>
                
                {setupStatus.database.results && (
                  <div className="mt-4">
                    <h4 className="font-medium mb-2">Detalhes:</h4>
                    <div className="bg-gray-50 p-3 rounded">
                      <pre className="whitespace-pre-wrap text-xs">
                        {JSON.stringify(setupStatus.database.results, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Resultados do armazenamento */}
              {setupStatus?.storage && (
                <div className="p-4 border rounded-md">
                  <h3 className="font-medium mb-2">Armazenamento</h3>
                  <p>
                    <span className="font-semibold">Status:</span> {' '}
                    <span className={`px-2 py-0.5 rounded ${setupStatus.storage.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {setupStatus.storage.success ? 'Sucesso' : 'Erro'}
                    </span>
                  </p>
                  <p><span className="font-semibold">Mensagem:</span> {setupStatus.storage.message}</p>
                  
                  {setupStatus.storage.results && (
                    <div className="mt-4">
                      <h4 className="font-medium mb-2">Detalhes:</h4>
                      <div className="bg-gray-50 p-3 rounded">
                        <pre className="whitespace-pre-wrap text-xs">
                          {JSON.stringify(setupStatus.storage.results, null, 2)}
                        </pre>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {/* Resultados da autenticação */}
              <div className="p-4 border rounded-md">
                <h3 className="font-medium mb-2">Autenticação</h3>
                <p>
                  <span className="font-semibold">Status:</span> {' '}
                  <span className={`px-2 py-0.5 rounded ${setupStatus.auth.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {setupStatus.auth.success ? 'Sucesso' : 'Erro'}
                  </span>
                </p>
                <p><span className="font-semibold">Mensagem:</span> {setupStatus.auth.message}</p>
                
                {setupStatus.auth.user && (
                  <div className="mt-4">
                    <h4 className="font-medium mb-2">Usuário Administrador:</h4>
                    <p><span className="font-semibold">Email:</span> {setupStatus.auth.user.email}</p>
                    <p><span className="font-semibold">ID:</span> {setupStatus.auth.user.id}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        
        {/* Informações para desenvolvimento */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Informações para Desenvolvimento</h2>
          
          <div className="space-y-4">
            <div className="p-4 border rounded-md">
              <h3 className="font-medium mb-2">Credenciais do Sistema</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <span className="font-semibold">Admin:</span>{' '}
                  <code className="bg-gray-100 px-1 py-0.5 rounded">admin@turatti.com</code> / 
                  <code className="bg-gray-100 px-1 py-0.5 rounded">admin123</code>
                </li>
              </ul>
            </div>
            
            <div className="p-4 border rounded-md">
              <h3 className="font-medium mb-2">Endpoints Importantes</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <span className="font-semibold">Diagnóstico:</span>{' '}
                  <code className="bg-gray-100 px-1 py-0.5 rounded">/api/debug</code>
                </li>
                <li>
                  <span className="font-semibold">Configuração do DB:</span>{' '}
                  <code className="bg-gray-100 px-1 py-0.5 rounded">/api/setup-db</code>
                </li>
                <li>
                  <span className="font-semibold">Configuração de Storage:</span>{' '}
                  <code className="bg-gray-100 px-1 py-0.5 rounded">/api/setup-storage</code>
                </li>
                <li>
                  <span className="font-semibold">Configuração de Auth:</span>{' '}
                  <code className="bg-gray-100 px-1 py-0.5 rounded">/api/setup-auth</code>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 