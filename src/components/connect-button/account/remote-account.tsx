'use client';
import { useCallback } from 'react';
import { Copy } from 'lucide-react';
import { useChains } from 'wagmi';
import { useShallow } from 'zustand/react/shallow';

import useChainStore from '@/store/chain';
import { toShortAddress } from '@/utils';
import {
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator
} from '@/components/ui/menubar';

import ChainButton from './chain-button';

type AccountProps = {
  onCopy?: (address: `0x${string}`) => void;
};

const RemoteAccount = ({ onCopy }: AccountProps) => {
  const { remoteChain, setRemoteChain } = useChainStore(
    useShallow((state) => ({
      remoteChain: state.remoteChain,
      setRemoteChain: state.setRemoteChain
    }))
  );

  const chains = useChains();

  const handleCopy = useCallback(() => {
    remoteChain?.address && onCopy?.(remoteChain?.address);
  }, [remoteChain?.address, onCopy]);

  return (
    <MenubarMenu>
      <ChainButton label="Remote" chain={remoteChain} address={remoteChain?.address} />

      <MenubarContent>
        {remoteChain?.address ? (
          <>
            <MenubarItem disabled>Remote: {remoteChain?.name}</MenubarItem>
            <MenubarSeparator />
            <MenubarItem className="gap-2" onClick={handleCopy}>
              <Copy className="h-4 w-4" strokeWidth={1} />
              {toShortAddress(remoteChain?.address)}
            </MenubarItem>
            <MenubarSeparator />
          </>
        ) : null}

        {chains?.map((chain) => {
          return <MenubarItem key={chain.id}>Create on {chain.name}</MenubarItem>;
        })}
      </MenubarContent>
    </MenubarMenu>
  );
};
export default RemoteAccount;
