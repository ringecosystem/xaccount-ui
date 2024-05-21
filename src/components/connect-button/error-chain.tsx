import { forwardRef } from 'react';
import { TriangleAlert } from 'lucide-react';
import { TooltipArrow } from '@radix-ui/react-tooltip';

import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

const ErrorChain = forwardRef<HTMLButtonElement, React.ComponentPropsWithoutRef<'button'>>(
  (props, ref) => {
    return (
      <Button ref={ref} {...props} variant="destructive">
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <div className="flex w-full items-center justify-center space-x-2">
              <TriangleAlert />
              <span>Wrong Network</span>
            </div>
          </TooltipTrigger>
          <TooltipContent side="left" sideOffset={20} className="border-red-500">
            Your wallet&apos;s current network is unsupported.
            <TooltipArrow
              style={{
                fill: 'red'
              }}
            />
          </TooltipContent>
        </Tooltip>
      </Button>
    );
  }
);

ErrorChain.displayName = 'ErrorChain';
export default ErrorChain;
