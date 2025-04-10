import React, { ReactNode } from 'react';
import Link from 'next/link';

interface AdminPageLayoutProps {
  title: string;
  children: ReactNode;
  actionButton?: {
    label: string;
    onClick: () => void;
    show: boolean;
  };
  breadcrumb?: {
    path: string;
    label: string;
  };
}

export default function AdminPageLayout({
  title,
  children,
  actionButton,
  breadcrumb = { path: '/admin', label: 'Voltar para o Dashboard' },
}: AdminPageLayoutProps) {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <div>
          <Link href={breadcrumb.path} className="text-blue-700 hover:underline mb-2 inline-block">
            &larr; {breadcrumb.label}
          </Link>
          <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
        </div>
        
        {actionButton && actionButton.show && (
          <button
            onClick={actionButton.onClick}
            className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-md transition duration-300 text-lg"
          >
            {actionButton.label}
          </button>
        )}
      </div>
      
      {children}
    </div>
  );
} 