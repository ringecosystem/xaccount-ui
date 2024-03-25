'use client';

import * as React from 'react';
import { RainbowKitProvider, darkTheme, lightTheme } from '@rainbow-me/rainbowkit';

import { APP_NAME } from '@/config/site';
import { getDefaultChain } from '@/utils/chain';

import '@rainbow-me/rainbowkit/styles.css';
import { useTheme } from 'next-themes';

export const dark = darkTheme({
  borderRadius: 'medium',
  accentColor: 'hsl(var(--primary))'
});

export const light = lightTheme({
  borderRadius: 'medium',
  accentColor: 'hsl(var(--primary))'
});

const initialChain = getDefaultChain();

export const Provider = ({ children }: React.PropsWithChildren<unknown>) => {
  const { theme } = useTheme();

  const rainbowKitTheme = theme === 'dark' ? dark : light;
  return (
    <RainbowKitProvider
      locale="en-US"
      theme={rainbowKitTheme}
      appInfo={{
        appName: APP_NAME
      }}
      initialChain={initialChain}
    >
      {children}
    </RainbowKitProvider>
  );
};
