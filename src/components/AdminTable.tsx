import React, { ReactNode } from 'react';

interface Column {
  header: string;
  key: string;
  align?: 'left' | 'center' | 'right';
  render?: (value: any, row: any) => ReactNode;
}

interface AdminTableProps {
  columns: Column[];
  data: any[];
  actions?: {
    onEdit?: (row: any) => void;
    onDelete?: (row: any) => void;
    custom?: (row: any) => ReactNode;
  };
  emptyText?: string;
}

export default function AdminTable({
  columns,
  data,
  actions,
  emptyText = 'Nenhum registro encontrado.',
}: AdminTableProps) {
  const getColumnAlignment = (align?: string) => {
    switch (align) {
      case 'center': return 'text-center';
      case 'right': return 'text-right';
      default: return 'text-left';
    }
  };

  return (
    <div className="hidden md:block overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column, index) => (
              <th 
                key={index}
                className={`px-6 py-3 ${getColumnAlignment(column.align)} text-xs font-medium text-gray-500 uppercase tracking-wider`}
              >
                {column.header}
              </th>
            ))}
            {actions && (
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            )}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.length > 0 ? (
            data.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-gray-50 transition-colors">
                {columns.map((column, colIndex) => (
                  <td 
                    key={`${rowIndex}-${colIndex}`}
                    className={`px-6 py-4 whitespace-nowrap ${getColumnAlignment(column.align)}`}
                  >
                    <div className="text-sm text-gray-900">
                      {column.render ? column.render(row[column.key], row) : row[column.key]}
                    </div>
                  </td>
                ))}
                
                {actions && (
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {actions.custom && actions.custom(row)}
                    
                    {actions.onEdit && (
                      <button
                        onClick={() => actions.onEdit && actions.onEdit(row)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        Editar
                      </button>
                    )}
                    
                    {actions.onDelete && (
                      <button
                        onClick={() => actions.onDelete && actions.onDelete(row)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Excluir
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length + (actions ? 1 : 0)} className="px-6 py-4 text-center text-sm text-gray-500">
                {emptyText}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
} 