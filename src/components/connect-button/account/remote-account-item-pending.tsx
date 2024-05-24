import Image from 'next/image';

import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { ChainConfig } from '@/types/chains';

interface RemoteAccountItemPendingProps {
  toChain: ChainConfig;
}
const RemoteAccountItemPending = ({ toChain }: RemoteAccountItemPendingProps) => {
  return (
    <div className="flex items-center gap-2 text-muted-foreground">
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
      <div className="animate-ellipsis flex cursor-not-allowed items-center gap-2">
        Creating account
      </div>
    </div>
  );
};

export default RemoteAccountItemPending;
