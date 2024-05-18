import React, { useCallback, useMemo } from 'react';

import { useRemoteChainAddress } from '@/hooks/useRemoteChainAddress';
import { ChainConfig } from '@/types/chains';
import { MenubarCheckboxItem, MenubarItem } from '@/components/ui/menubar';
import { Skeleton } from '@/components/ui/skeleton';

import RemoteAccountItemPending from './remote-account-item-pending';
import RemoteAccountItemCompleted from './remote-account-item-completed';
import RemoteAccountItemCreated from './remote-account-item-created';

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

const classNameMap = {
  pending: 'cursor-not-allowed',
  created: 'cursor-pointer',
  completed: 'cursor-pointer'
};
const RemoteAccountItem = ({
  fromChainId,
  toChain,
  remoteChain,
  localAddress,
  onClick,
  onCopy
}: RemoteAccountItemProps) => {
  const [state, dispatch] = useRemoteChainAddress({
    fromChainId: fromChainId ? BigInt(fromChainId) : undefined,
    toChainId: toChain.id ? BigInt(toChain.id) : undefined,
    fromAddress: localAddress
  });
  const { loading, safeAddress, moduleAddress, status, transactionHash } = state;

  const hasAccount = safeAddress !== '0x' && status !== 'created';
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
    if (status === 'pending') return;
    onClick?.({
      hasAccount,
      safeAddress,
      moduleAddress,
      chain: toChain
    });
  }, [onClick, hasAccount, safeAddress, moduleAddress, toChain, status]);

  const Item = useMemo(() => {
    switch (status) {
      case 'created':
        return <RemoteAccountItemCreated toChain={toChain} />;
      case 'pending':
        return <RemoteAccountItemPending toChain={toChain} />;
      case 'completed':
        return (
          <RemoteAccountItemCompleted
            toChain={toChain}
            safeAddress={safeAddress}
            onClick={handleCopy}
          />
        );

      default:
        return null;
    }
  }, [status, toChain, safeAddress, handleCopy]);

  return (
    <>
      <Component onClick={handleClick} checked={checked} className={classNameMap[status]}>
        {loading ? (
          <Skeleton className="h-full w-full">
            <span className="invisible">{toChain?.name}</span>
          </Skeleton>
        ) : (
          Item
        )}
      </Component>
    </>
  );
};

export default RemoteAccountItem;
