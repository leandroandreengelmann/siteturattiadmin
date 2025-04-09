import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Inter } from 'next/font/google';
import { ToastProvider } from '@/components/ToastProvider';

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ClientLayout from "@/components/ClientLayout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: "Turatti - Materiais para Construção",
  description: "Encontre tudo para sua construção ou reforma na Turatti",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} antialiased`} suppressHydrationWarning>
      <body className="font-inter min-h-screen flex flex-col" suppressHydrationWarning>
        <ToastProvider>
          <ClientLayout>
            {children}
          </ClientLayout>
        </ToastProvider>
      </body>
    </html>
  );
}
