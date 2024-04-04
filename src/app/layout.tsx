import { Inter as FontSans } from 'next/font/google';

import { DAppProvider } from '@/providers/dapp-provider';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { cn } from '@/lib/utils';

import type { Metadata } from 'next';

import './globals.css';

export const metadata: Metadata = {
  title: 'darwinia xAccount',
  description: 'xAccount'
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
            <main className="h-[calc(100vh-6rem)]">{children}</main>
            <Footer />
          </div>
        </DAppProvider>
      </body>
    </html>
  );
}
