// src/app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { NavigationBar } from '@/components/layout/NavigationBar';
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
        <div className="min-h-screen bg-gray-100">
          <NavigationBar />
          <main className="py-10">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}

