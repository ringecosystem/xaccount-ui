'use client';

import * as React from 'react';

import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/sonner';

export function ShadcnProvider({ children }: React.PropsWithChildren<unknown>) {
  return (
    <TooltipProvider delayDuration={0}>
      {children}
      <Toaster />
    </TooltipProvider>
  );
}
