'use client';

interface StatusBadgeProps {
  status: 'ativo' | 'inativo' | 'pendente' | 'bloqueado' | 'destaque' | 'esgotado' | 'novo';
  text?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'pill' | 'dot' | 'tag';
}

export default function StatusBadge({
  status,
  text,
  size = 'md',
  variant = 'pill',
}: StatusBadgeProps) {
  // Definir classes e textos de acordo com o status
  const getStatusConfig = () => {
    switch (status) {
      case 'ativo':
        return {
          bg: 'bg-green-100',
          text: 'text-green-800',
          border: 'border-green-200',
          dot: 'bg-green-500',
          defaultText: 'Ativo',
        };
      case 'inativo':
        return {
          bg: 'bg-gray-100',
          text: 'text-gray-800',
          border: 'border-gray-200',
          dot: 'bg-gray-500',
          defaultText: 'Inativo',
        };
      case 'pendente':
        return {
          bg: 'bg-yellow-100',
          text: 'text-yellow-800',
          border: 'border-yellow-200',
          dot: 'bg-yellow-500',
          defaultText: 'Pendente',
        };
      case 'bloqueado':
        return {
          bg: 'bg-red-100',
          text: 'text-red-800',
          border: 'border-red-200',
          dot: 'bg-red-500',
          defaultText: 'Bloqueado',
        };
      case 'destaque':
        return {
          bg: 'bg-purple-100',
          text: 'text-purple-800',
          border: 'border-purple-200',
          dot: 'bg-purple-500',
          defaultText: 'Destaque',
        };
      case 'esgotado':
        return {
          bg: 'bg-orange-100',
          text: 'text-orange-800',
          border: 'border-orange-200',
          dot: 'bg-orange-500',
          defaultText: 'Esgotado',
        };
      case 'novo':
        return {
          bg: 'bg-blue-100',
          text: 'text-blue-800',
          border: 'border-blue-200',
          dot: 'bg-blue-500',
          defaultText: 'Novo',
        };
      default:
        return {
          bg: 'bg-gray-100',
          text: 'text-gray-800',
          border: 'border-gray-200',
          dot: 'bg-gray-500',
          defaultText: 'Status',
        };
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'text-xs px-2 py-0.5';
      case 'lg':
        return 'text-sm px-3 py-1.5';
      default:
        return 'text-xs px-2.5 py-1';
    }
  };

  const statusConfig = getStatusConfig();
  const displayText = text || statusConfig.defaultText;

  // Renderização baseada na variante
  if (variant === 'dot') {
    return (
      <div className="flex items-center">
        <div className={`w-2 h-2 rounded-full mr-1.5 ${statusConfig.dot}`}></div>
        <span className={`font-inter font-medium ${statusConfig.text}`}>{displayText}</span>
      </div>
    );
  } else if (variant === 'tag') {
    return (
      <span
        className={`inline-flex items-center font-inter font-medium ${getSizeClasses()} ${
          statusConfig.bg
        } ${statusConfig.text} border ${statusConfig.border} rounded-md`}
      >
        <span className={`w-2 h-2 rounded-full mr-1.5 ${statusConfig.dot}`}></span>
        {displayText}
      </span>
    );
  } else {
    // Default: pill
    return (
      <span
        className={`inline-flex font-inter font-medium ${getSizeClasses()} ${
          statusConfig.bg
        } ${statusConfig.text} rounded-full`}
      >
        {displayText}
      </span>
    );
  }
} 