'use client';
import { useCallback, useState } from 'react';
import { useAccount } from 'wagmi';
import { useShallow } from 'zustand/react/shallow';

import useChainStore, { RemoteChain } from '@/store/chain';
import { getChains } from '@/utils';
import { MenubarContent, MenubarMenu } from '@/components/ui/menubar';

import ChainButton from './chain-button';
import { ChainConfig } from '@/types/chains';

import { CreateXAccount } from './create-xaccount';
import RemoteAccountItem from './remote-account-item';

type AccountProps = {
  onCopy?: (address: `0x${string}`) => void;
};

const RemoteAccount = ({ onCopy }: AccountProps) => {
  const { address } = useAccount();

  const [selectedChain, setSelectedChain] = useState<RemoteChain | null>(null);

  const { localChain, remoteChain, setRemoteChain } = useChainStore(
    useShallow((state) => ({
      localChain: state.localChain,
      remoteChain: state.remoteChain,
      setRemoteChain: state.setRemoteChain
    }))
  );

  const chains = getChains();
  const supportedRemoteChains = chains.filter((chain) => chain.id !== localChain?.id);

  const handleClick = useCallback(
    ({
      hasAccount,
      safeAddress,
      moduleAddress,
      chain
    }: {
      hasAccount: boolean;
      safeAddress: `0x${string}`;
      moduleAddress: `0x${string}`;
      chain: ChainConfig;
    }) => {
      if (hasAccount) {
        setRemoteChain({
          ...chain,
          safeAddress: safeAddress,
          moduleAddress: moduleAddress
        });
      } else {
        setSelectedChain({ ...chain, safeAddress: safeAddress, moduleAddress: moduleAddress });
      }
    },
    [setRemoteChain]
  );

  return (
    <>
      <MenubarMenu>
        <ChainButton label="Remote" chain={remoteChain} address={remoteChain?.safeAddress} />

        <MenubarContent>
          {supportedRemoteChains?.map((chain) => {
            return (
              address && (
                <RemoteAccountItem
                  key={chain.id}
                  fromChainId={localChain?.id}
                  toChain={chain}
                  localAddress={address}
                  remoteChain={remoteChain}
                  onClick={handleClick}
                />
              )
            );
          })}
        </MenubarContent>
      </MenubarMenu>
      <CreateXAccount
        open={!!selectedChain}
        onOpenChange={() => setSelectedChain(null)}
        fromChainId={localChain?.id}
        fromAddress={address}
        toChain={selectedChain}
      />
    </>
  );
};
export default RemoteAccount;
