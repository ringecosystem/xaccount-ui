import type { Metadata } from 'next';
import { Urbanist, JetBrains_Mono } from 'next/font/google';
import { APP_DESCRIPTION, APP_NAME } from '@/config/site';
import { DAppProvider } from '@/providers/dapp-provider';
import { Footer } from '@/components/footer';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ImpersonatorIframeProvider } from '@/contexts/ImpersonatorIframeContext';
import { ToastContainer } from 'react-toastify';

import './globals.css';
import { SafeAddressProvider } from '@/providers/address-provider';
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

const jetBrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono'
});

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${urbanist.className} ${jetBrainsMono.variable} antialiased`}>
        <DAppProvider>
          <>
            <TooltipProvider delayDuration={0}>
              <SafeAddressProvider>
                <div className="flex min-h-screen flex-col">
                  <main className="flex-1 py-[50px]">
                    <ImpersonatorIframeProvider>{children}</ImpersonatorIframeProvider>
                  </main>
                  <Footer />
                </div>
              </SafeAddressProvider>
              <ToastContainer theme="dark" className="w-auto text-[14px] md:w-[380px]" />
            </TooltipProvider>
          </>
        </DAppProvider>
      </body>
    </html>
  );
}
