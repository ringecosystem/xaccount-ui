'use client';

import * as React from 'react';
import { RainbowKitProvider, darkTheme, lightTheme } from '@rainbow-me/rainbowkit';

import { APP_NAME } from '@/config/site';

import '@rainbow-me/rainbowkit/styles.css';
import { useTheme } from 'next-themes';
import useMounted from '@/hooks/useMounted';
import Spin from '@/components/ui/spin';

export const dark = darkTheme({
  borderRadius: 'medium',
  accentColor: 'hsl(var(--primary))'
});

export const light = lightTheme({
  borderRadius: 'medium',
  accentColor: 'hsl(var(--primary))'
});

export const Provider = ({ children }: React.PropsWithChildren<unknown>) => {
  const { theme } = useTheme();
  const isMounted = useMounted();
  const rainbowKitTheme = theme === 'dark' ? dark : light;

  return isMounted ? (
    <RainbowKitProvider
      locale="en-US"
      theme={rainbowKitTheme}
      appInfo={{
        appName: APP_NAME
      }}
    >
      {children}
    </RainbowKitProvider>
  ) : (
    <div className="flex h-screen w-screen items-center justify-center">
      <Spin className=" text-muted-foreground" />
    </div>
  );
};
