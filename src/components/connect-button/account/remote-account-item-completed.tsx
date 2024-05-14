import Image from 'next/image';
import { Copy } from 'lucide-react';

import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { toShortAddress } from '@/utils';

import type { MouseEventHandler } from 'react';
import type { ChainConfig } from '@/types/chains';

interface RemoteAccountItemCompletedProps {
  toChain: ChainConfig;
  safeAddress: string;
  onClick: MouseEventHandler<SVGSVGElement> | undefined;
}
const RemoteAccountItemCompleted = ({
  toChain,
  safeAddress,
  onClick
}: RemoteAccountItemCompletedProps) => {
  return (
    <div className="flex items-center gap-2">
      <Tooltip>
        <TooltipTrigger asChild>
          <Image
            src={toChain?.iconUrl as string}
            width={16}
            height={16}
            className="rounded-full"
            alt={toChain?.name || 'chain'}
          />
        </TooltipTrigger>
        <TooltipContent>{toChain?.name}</TooltipContent>
      </Tooltip>
      <div className="flex items-center gap-2">
        <span>{toShortAddress(safeAddress)}</span>
        <Copy className="h-4 w-4 hover:opacity-80" strokeWidth={1} onClick={onClick} />
      </div>
    </div>
  );
};

export default RemoteAccountItemCompleted;
