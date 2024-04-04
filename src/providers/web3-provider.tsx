import React, { useEffect, ReactNode } from 'react';
import { useAccount } from 'wagmi';

import useChainStore from '@/store/chain';
import { getDefaultChain } from '@/utils';

type Web3ProviderProps = {
  children: ReactNode;
};

export const Web3Provider = ({ children }: Web3ProviderProps) => {
  const { chain } = useAccount();
  const setLocalChain = useChainStore((state) => state.setLocalChain);

  useEffect(() => {
    if (chain) {
      setLocalChain(chain);
    } else {
      setLocalChain(getDefaultChain());
    }
  }, [chain, setLocalChain]);

  return <>{children}</>;
};
