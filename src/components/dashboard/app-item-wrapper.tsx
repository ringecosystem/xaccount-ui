import * as React from 'react';

import { Card, CardContent } from '@/components/ui/card';

type AppItemWrapperType = React.PropsWithChildren<unknown> & React.HTMLAttributes<HTMLDivElement>;

export default function AppItemWrapper({ children, ...props }: AppItemWrapperType) {
  return (
    <Card
      className="aspect-[1/1] cursor-pointer bg-muted  transition-all duration-500 hover:border-primary hover:bg-primary/10"
      {...props}
    >
      {children}
    </Card>
  );
}
