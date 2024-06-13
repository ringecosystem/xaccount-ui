'use client';

import * as React from 'react';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';

import { config } from '@/config/wagmi';

import { Provider as RainbowKitProvider } from './rainbowkit-provider';
import { AppProvider } from './app-provider';
import { UIComponentsProvider } from './ui-components-provider';

export function DAppProvider({ children }: React.PropsWithChildren<unknown>) {
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000
          }
        }
      })
  );
  return (
    <WagmiProvider config={config} reconnectOnMount={false}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <RainbowKitProvider>
            <UIComponentsProvider>
              <AppProvider>{children}</AppProvider>
            </UIComponentsProvider>
          </RainbowKitProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
