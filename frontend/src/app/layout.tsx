// src/app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import AuthenticatedLayout from '@/components/layout/AuthenticatedLayout';
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
        <AuthenticatedLayout>
          {children}
        </AuthenticatedLayout>
      </body>
    </html>
  );
}