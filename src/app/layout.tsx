import { Inter as FontSans } from 'next/font/google';

import { DAppProvider } from '@/providers/dapp-provider';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { APP_DESCRIPTION, APP_NAME } from '@/config/site';
import { cn } from '@/lib/utils';

import type { Metadata } from 'next';

import './globals.css';

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: APP_NAME,
  description: APP_DESCRIPTION,
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: APP_NAME
  },
  formatDetection: {
    telephone: false
  },
  openGraph: {
    type: 'website',
    siteName: APP_NAME,
    title: APP_NAME,
    description: APP_DESCRIPTION
  },
  twitter: {
    card: 'summary',
    title: APP_NAME,
    description: APP_DESCRIPTION
  }
};

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans'
});

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
      />
      <body className={cn('min-h-screen bg-background font-sans antialiased', fontSans.variable)}>
        <DAppProvider>
          <div className="flex h-dvh w-screen flex-col overflow-hidden lg:h-screen">
            <Header />
            <main
              style={{
                height: 'calc(100vh - var(--header) - var(--footer))'
              }}
            >
              {children}
            </main>

            <Footer />
          </div>
        </DAppProvider>
      </body>
    </html>
  );
}
