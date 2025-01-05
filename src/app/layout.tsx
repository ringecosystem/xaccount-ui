import type { Metadata } from 'next';
import { Urbanist } from 'next/font/google';
import { APP_DESCRIPTION, APP_NAME } from '@/config/site';
import { DAppProvider } from '@/providers/dapp-provider';
import { Footer } from '@/components/footer';
import { TooltipProvider } from '@/components/ui/tooltip';

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

const urbanist = Urbanist({
  subsets: ['latin'],
  variable: '--font-urbanist'
});

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${urbanist.className} min-h-screen antialiased`}>
        <DAppProvider>
          <TooltipProvider delayDuration={0}>
            <div className="flex min-h-screen flex-col">
              <main
                style={{
                  minHeight: 'calc(100vh - var(--footer))'
                }}
                className="flex-1 py-[50px]"
              >
                {children}
              </main>

              <Footer />
            </div>
          </TooltipProvider>
        </DAppProvider>
      </body>
    </html>
  );
}
