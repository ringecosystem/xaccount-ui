'use client';

import * as React from 'react';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { ThemeProvider } from 'next-themes';

import { config } from '@/config/wagmi';

import { Provider as RainbowKitProvider } from './rainbowkit-provider';
import { Web3Provider } from './web3-provider';
import { UIComponentsProvider } from './ui-components-provider';

const queryClient = new QueryClient();

export function DAppProvider({ children }: React.PropsWithChildren<unknown>) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <RainbowKitProvider>
            <Web3Provider>
              <UIComponentsProvider>{children}</UIComponentsProvider>
            </Web3Provider>
          </RainbowKitProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
