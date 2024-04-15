import React, { useEffect, ReactNode } from 'react';
import { useAccount } from 'wagmi';

import useChainStore from '@/store/chain';
import { getDefaultChain } from '@/utils';
import { initXAccountsDB } from '@/database/xaccounts';
import { initDappsRepositoryDB } from '@/database/dapps-repository';

type Web3ProviderProps = {
  children: ReactNode;
};

if (typeof window !== 'undefined') {
  initDappsRepositoryDB();
  initXAccountsDB();
}

export const Web3Provider = ({ children }: Web3ProviderProps) => {
  const { chain } = useAccount();
  const setLocalChain = useChainStore((state) => state.setLocalChain);
  const removeRemoteChain = useChainStore((state) => state.removeRemoteChain);

  useEffect(() => {
    if (chain) {
      setLocalChain(chain);
      removeRemoteChain();
    } else {
      setLocalChain(getDefaultChain());
    }
  }, [chain, removeRemoteChain, setLocalChain]);

  return <>{children}</>;
};
