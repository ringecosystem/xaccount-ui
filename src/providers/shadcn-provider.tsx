'use client';

import * as React from 'react';

import { TooltipProvider } from '@/components/ui/tooltip';

export function ShadcnProvider({ children }: React.PropsWithChildren<unknown>) {
  return <TooltipProvider delayDuration={0}>{children}</TooltipProvider>;
}
