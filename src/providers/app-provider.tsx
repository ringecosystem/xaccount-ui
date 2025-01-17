import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
import { APP_NAME } from '@/config/site';
import type { ReactNode } from 'react';

type AppProviderProps = {
  children: ReactNode;
};
export const dark = darkTheme({
  borderRadius: 'medium',
  accentColor: 'hsl(var(--primary))'
});
export const AppProvider = ({ children }: AppProviderProps) => {
  return (
    <RainbowKitProvider theme={dark} locale="en-US" appInfo={{ appName: APP_NAME }}>
      {children}
    </RainbowKitProvider>
  );
};
