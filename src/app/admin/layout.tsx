import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Painel Administrativo - Turatti",
  description: "Área administrativa da loja Turatti",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="bg-blue-800 text-white p-3 text-center shadow-md">
        <h1 className="text-lg font-semibold">Painel Administrativo - Turatti</h1>
      </div>
      
      <main className="flex-grow p-4">
        {children}
      </main>
      
      <footer className="bg-gray-100 border-t border-gray-200 py-3 px-4 text-center text-sm text-gray-600">
        <div className="container mx-auto flex justify-center items-center">
          <span>&copy; {new Date().getFullYear()} Turatti</span>
          <span className="mx-2">|</span>
          <Link href="/admin/status" className="text-blue-600 hover:text-blue-800 transition-colors">
            Status do Sistema
          </Link>
        </div>
      </footer>
    </div>
  );
} 