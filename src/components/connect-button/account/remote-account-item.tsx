import React, { useCallback } from 'react';
import Image from 'next/image';
import { Copy, Power, ExternalLink } from 'lucide-react';

import { useRemoteChainAddress } from '@/hooks/useRemoteChainAddress';
import { ChainConfig } from '@/types/chains';
import { MenubarCheckboxItem, MenubarItem } from '@/components/ui/menubar';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { toShortAddress } from '@/utils';
import { Skeleton } from '@/components/ui/skeleton';

interface RemoteAccountItemProps {
  fromChainId: number;
  toChain: ChainConfig;
  remoteChain?: ChainConfig;
  localAddress: `0x${string}`;
  onClick?: ({
    hasAccount,
    safeAddress,
    moduleAddress,
    chain
  }: {
    hasAccount: boolean;
    safeAddress: `0x${string}`;
    moduleAddress: `0x${string}`;
    chain: ChainConfig;
  }) => void;
  onCopy?: (address: `0x${string}`) => void;
}

const RemoteAccountItem = ({
  fromChainId,
  toChain,
  remoteChain,
  localAddress,
  onClick,
  onCopy
}: RemoteAccountItemProps) => {
  const { loading, safeAddress, moduleAddress, status } = useRemoteChainAddress({
    fromChainId: fromChainId ? BigInt(fromChainId) : undefined,
    toChainId: toChain.id ? BigInt(toChain.id) : undefined,
    fromAddress: localAddress
  });

  const hasAccount = safeAddress !== '0x' && status === 'completed';
  const checked = hasAccount && remoteChain?.id === toChain.id;
  const Component = checked ? MenubarCheckboxItem : MenubarItem;

  const handleCopy: React.MouseEventHandler<SVGSVGElement> = useCallback(
    (e) => {
      e.stopPropagation();
      onCopy?.(safeAddress);
    },
    [safeAddress, onCopy]
  );

  const handleClick = useCallback(() => {
    onClick?.({
      hasAccount,
      safeAddress,
      moduleAddress,
      chain: toChain
    });
  }, [onClick, hasAccount, safeAddress, moduleAddress, toChain]);

  return (
    <Component onClick={handleClick} checked={checked} className=" cursor-pointer">
      {loading ? (
        <Skeleton className="h-full w-full">
          <span className="invisible">{toChain?.name}</span>
        </Skeleton>
      ) : hasAccount ? (
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
            <Copy className="h-4 w-4 hover:opacity-80" strokeWidth={1} onClick={handleCopy} />
          </div>
        </div>
      ) : (
        <div className="text-muted-foreground">Create on {toChain?.name}</div>
      )}
    </Component>
  );
};

export default RemoteAccountItem;
