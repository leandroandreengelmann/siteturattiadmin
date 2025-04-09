'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminFooter() {
  const router = useRouter();
  const currentYear = new Date().getFullYear();
  
  const handleLogout = () => {
    // Simplesmente redirecionar para o início
    router.push('/');
  };
  
  return (
    <footer className="border-t border-gray-100 py-4">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-xs text-gray-500">
            &copy; {currentYear} Turatti Materiais para Construção
          </p>
          
          <div className="flex space-x-4 mt-2 md:mt-0">
            <Link
              href="/"
              className="text-xs text-gray-500 hover:text-gray-700"
            >
              Visitar site
            </Link>
            
            <button
              onClick={handleLogout}
              className="text-xs text-gray-500 hover:text-gray-700"
            >
              Sair
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
} 