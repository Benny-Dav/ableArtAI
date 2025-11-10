
import { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/components/context/AuthProvider';
import { ToastProvider } from '@/components/context/ToastProvider';

export const metadata: Metadata = {
  title: 'Able.ai - AI Image Generation',
  description: 'Create stunning images with AI-powered image generation and editing',
  keywords: 'AI, image generation, artificial intelligence, image editing, creative tools',
  authors: [{ name: 'Imagen Team' }],
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="theme-color" content="#020817" />
        <meta name="color-scheme" content="dark" />
      </head>
      <body suppressHydrationWarning={true} className="bg-dark-bg text-white">
        <AuthProvider>
          <ToastProvider>
            <main className="min-h-screen">
              {children}
            </main>
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
