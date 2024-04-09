'use client';
import { useCallback, useState } from 'react';
import { Copy } from 'lucide-react';
import { useAccount, useChains } from 'wagmi';
import { useShallow } from 'zustand/react/shallow';
import { useReadContracts } from 'wagmi';

import useChainStore from '@/store/chain';
import { toShortAddress } from '@/utils';
import {
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator
} from '@/components/ui/menubar';
import {
  abi as xAccountFactoryAbi,
  address as xAccountFactoryAddress
} from '@/config/abi/xAccountFactory';
import ChainButton from './chain-button';
import { ChainConfig } from '@/types/chains';

import { CreateXAccount } from './create-xaccount';

type AccountProps = {
  onCopy?: (address: `0x${string}`) => void;
};

const RemoteAccount = ({ onCopy }: AccountProps) => {
  const { address } = useAccount();

  const [selectedChan, setSelectedChain] = useState<ChainConfig | null>(null);

  const { localChain, remoteChain, setRemoteChain } = useChainStore(
    useShallow((state) => ({
      localChain: state.localChain,
      remoteChain: state.remoteChain,
      setRemoteChain: state.setRemoteChain
    }))
  );

  const chains = useChains();

  const supportedRemoteChains = chains.filter((chain) => chain.id !== localChain?.id);

  console.log(supportedRemoteChains);

  const result = useReadContracts({
    contracts: supportedRemoteChains?.map((chain) => {
      return {
        address: xAccountFactoryAddress,
        abi: xAccountFactoryAbi,
        functionName: 'xAccountOf',
        args: [localChain?.id, address, xAccountFactoryAddress]
      };
    })
  });

  console.log(result);

  const handleCopy = useCallback(() => {
    remoteChain?.address && onCopy?.(remoteChain?.address);
  }, [remoteChain?.address, onCopy]);

  return (
    <>
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

          {chains
            ?.filter((v) => v.id !== localChain?.id)
            ?.map((chain) => {
              return (
                <MenubarItem
                  key={chain.id}
                  className=" cursor-pointer"
                  onClick={() => {
                    setSelectedChain(chain);
                  }}
                >
                  Create on {chain.name}
                </MenubarItem>
              );
            })}
        </MenubarContent>
      </MenubarMenu>
      <CreateXAccount
        open={!!selectedChan}
        onOpenChange={() => setSelectedChain(null)}
        chain={selectedChan}
      />
    </>
  );
};
export default RemoteAccount;
