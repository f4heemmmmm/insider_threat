// src/app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import AuthenticatedLayout from '@/components/layout/AuthenticatedLayout';
import { NotificationProvider } from '@/hooks/useNotification';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'InsiderGuard - Insider Threat Monitoring Dashboard',
  description: 'Monitor and analyze potential insider threats in your organization',
  keywords: ['insider threat', 'security monitoring', 'ensign', 'infosecurity'],
  authors: [{ name: 'ENSIGN InfoSecurity' }],
  robots: 'noindex, nofollow', // Prevent search engine indexing for security
};

/**
 * Root layout component that wraps the entire InsiderGuard application.
 * 
 * Features:
 * - Global notification system integration for user feedback
 * - Authentication layout management
 * - Consistent typography and styling
 * - Security-focused metadata configuration
 * - Enhanced error handling throughout the application
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Security headers */}
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="X-Frame-Options" content="DENY" />
        <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
        <meta name="referrer" content="strict-origin-when-cross-origin" />
        
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className={`${inter.className} antialiased`}>
        {/* Global Notification Provider - enables notifications throughout the app */}
        <NotificationProvider 
          maxNotifications={5} 
          position="top-right"
        >
          {/* Authentication Layout - handles auth state and layout structure */}
          <AuthenticatedLayout>
            {children}
          </AuthenticatedLayout>
        </NotificationProvider>
        
        {/* Development mode indicators */}
        {process.env.NODE_ENV === 'development' && (
          <script 
            dangerouslySetInnerHTML={{
              __html: `
                console.log('🔒 InsiderGuard - Development Mode');
                console.log('🛡️ Insider Threat Monitoring Dashboard');
                console.log('🏢 ENSIGN InfoSecurity Platform');
              `
            }}
          />
        )}
      </body>
    </html>
  );
}