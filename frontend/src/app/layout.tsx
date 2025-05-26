// src/app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Sidebar } from '@/components/layout/Sidebar';
import { SidebarProvider } from '@/components/layout/SidebarContext';
import { MainContent } from '@/components/layout/MainContent';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'InsiderGuard - Insider Threat Monitoring Dashboard',
  description: 'Monitor and analyze potential insider threats in your organization',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SidebarProvider>
          <div className="min-h-screen bg-gray-100">
            <Sidebar />
            <MainContent>
              {children}
            </MainContent>
          </div>
        </SidebarProvider>
      </body>
    </html>
  );
}