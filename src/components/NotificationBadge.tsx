'use client';

import { ReactNode } from 'react';

interface NotificationBadgeProps {
  count?: number;
  children: ReactNode;
  color?: 'red' | 'blue' | 'green' | 'yellow';
  size?: 'sm' | 'md' | 'lg';
  showZero?: boolean;
}

export default function NotificationBadge({
  count,
  children,
  color = 'red',
  size = 'md',
  showZero = false,
}: NotificationBadgeProps) {
  // Se não houver contagem ou for zero e showZero for falso, apenas renderiza o children
  if (count === undefined || (count === 0 && !showZero)) {
    return <>{children}</>;
  }

  // Definir classes de acordo com as propriedades
  const getColorClasses = () => {
    switch (color) {
      case 'blue':
        return 'bg-blue-600 text-white';
      case 'green':
        return 'bg-green-600 text-white';
      case 'yellow':
        return 'bg-yellow-500 text-white';
      default:
        return 'bg-red-600 text-white';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'text-xs w-4 h-4 -right-1 -top-1';
      case 'lg':
        return 'text-sm w-6 h-6 -right-2 -top-2';
      default:
        return 'text-xs w-5 h-5 -right-1.5 -top-1.5';
    }
  };

  return (
    <div className="relative inline-flex">
      {children}
      <div
        className={`${getColorClasses()} ${getSizeClasses()} font-inter font-semibold rounded-full absolute flex items-center justify-center leading-none`}
      >
        {count > 99 ? '99+' : count}
      </div>
    </div>
  );
} 