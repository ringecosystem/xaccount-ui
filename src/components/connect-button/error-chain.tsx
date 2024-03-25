import { forwardRef } from 'react';
import Image from 'next/image';
import { TooltipArrow } from '@radix-ui/react-tooltip';

import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const ErrorChain = forwardRef<HTMLButtonElement, React.ComponentPropsWithoutRef<'button'>>(
  (props, ref) => {
    return (
      <Button ref={ref} {...props} className=" border-primary-500 ">
        <TooltipProvider>
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <div className="flex w-full items-center justify-center space-x-2">
                <Image
                  src="/images/common/error-network.svg"
                  width={20}
                  height={20}
                  alt="error-network"
                />
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
        </TooltipProvider>
      </Button>
    );
  }
);

ErrorChain.displayName = 'ErrorChain';
export default ErrorChain;
