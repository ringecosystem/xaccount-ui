import React, { useEffect, ReactNode } from 'react';
import { useAccount } from 'wagmi';

import useChainStore from '@/store/chain';
import { initXAccountsDB } from '@/database/xaccounts';
import { initDappsRepositoryDB } from '@/database/dapps-repository';
import TransactionManager from '@/components/transaction-manager';
import { usePrevious } from 'react-use';

type Web3ProviderProps = {
  children: ReactNode;
};

if (typeof window !== 'undefined') {
  initDappsRepositoryDB();
  initXAccountsDB();
}

export const Web3Provider = ({ children }: Web3ProviderProps) => {
  const { chainId, address } = useAccount();

  const removeRemoteChain = useChainStore((state) => state.removeRemoteChain);

  const previousChainId = usePrevious(chainId);
  const previousAddress = usePrevious(address);

  useEffect(() => {
    if (previousChainId && chainId !== previousChainId) {
      removeRemoteChain();
    }
  }, [chainId, previousChainId, removeRemoteChain]);

  useEffect(() => {
    if (previousAddress && address !== previousAddress) {
      removeRemoteChain();
    }
  }, [address, previousAddress, removeRemoteChain]);

  return (
    <>
      {children}
      <TransactionManager />
    </>
  );
};
