import { forwardRef } from 'react';
import { TriangleAlert } from 'lucide-react';

import { Button } from '@/components/ui/button';

const ErrorChain = forwardRef<HTMLButtonElement, React.ComponentPropsWithoutRef<'button'>>(
  (props, ref) => {
    return (
      <Button ref={ref} {...props} className="bg-red-500 hover:bg-red-600">
        <div className="flex w-full items-center justify-center space-x-2">
          <TriangleAlert />
          <span>Wrong Network</span>
        </div>
      </Button>
    );
  }
);

ErrorChain.displayName = 'ErrorChain';
export default ErrorChain;
