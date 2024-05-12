'use client';
import { useCallback, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';

import useChainStore, { RemoteChain } from '@/store/chain';
import { getChains } from '@/utils';
import { MenubarContent, MenubarMenu } from '@/components/ui/menubar';
import { ChainConfig } from '@/types/chains';

import ChainButton from './chain-button';
import { CreateXAccount } from './create-xaccount';
import RemoteAccountItem from './remote-account-item';

type AccountProps = {
  localChain?: ChainConfig;
  localAddress?: `0x${string}`;
  onCopy?: (address: `0x${string}`) => void;
};

const RemoteAccount = ({ localChain, localAddress, onCopy }: AccountProps) => {
  const [selectedChain, setSelectedChain] = useState<RemoteChain | null>(null);

  const { remoteChain, setRemoteChain } = useChainStore(
    useShallow((state) => ({
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
        {localChain?.id ? (
          <MenubarContent>
            {supportedRemoteChains?.map((chain) => {
              return (
                localAddress && (
                  <RemoteAccountItem
                    key={chain.id}
                    fromChainId={localChain?.id}
                    toChain={chain}
                    localAddress={localAddress}
                    remoteChain={remoteChain}
                    onClick={handleClick}
                    onCopy={onCopy}
                  />
                )
              );
            })}
          </MenubarContent>
        ) : null}
      </MenubarMenu>
      <CreateXAccount
        open={!!selectedChain}
        onOpenChange={() => setSelectedChain(null)}
        fromChainId={localChain?.id}
        fromAddress={localAddress}
        toChain={selectedChain}
      />
    </>
  );
};
export default RemoteAccount;
