import React, { useEffect, ReactNode, useRef } from 'react';
import { useAccount, useChainId } from 'wagmi';

import useChainStore from '@/store/chain';
import { initXAccountsDB } from '@/database/xaccounts';
import { initDappsRepositoryDB } from '@/database/dapps-repository';
import TransactionManager from '@/components/transaction-manager';
import useReturnDashboard from '@/hooks/useReturnDashboard';

type Web3ProviderProps = {
  children: ReactNode;
};

if (typeof window !== 'undefined') {
  initDappsRepositoryDB();
  initXAccountsDB();
}
export const Web3Provider = ({ children }: Web3ProviderProps) => {
  const { address } = useAccount();

  const chainId = useChainId();

  const removeRemoteChain = useChainStore((state) => state.removeRemoteChain);

  const returnDashboard = useReturnDashboard();

  const previousChainId = useRef(chainId);
  const previousAddress = useRef(address);

  useEffect(() => {
    if (previousChainId.current !== chainId) {
      removeRemoteChain();
      returnDashboard();
    }
    previousChainId.current = chainId;
  }, [chainId, removeRemoteChain, returnDashboard]);

  useEffect(() => {
    if (previousAddress.current !== address) {
      removeRemoteChain();
      returnDashboard();
    }
    previousAddress.current = address;
  }, [address, removeRemoteChain, returnDashboard]);

  return (
    <>
      {children}
      <TransactionManager />
    </>
  );
};
