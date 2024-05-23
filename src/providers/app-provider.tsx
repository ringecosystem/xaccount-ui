import React, { useEffect, ReactNode, useRef } from 'react';
import { useChainId } from 'wagmi';
import localforage from 'localforage';

import useChainStore from '@/store/chain';
import TransactionManager from '@/components/transaction-manager';
import useReturnDashboard from '@/hooks/useReturnDashboard';
import { useIsConnectedToSupportedChain } from '@/hooks/useIsConnectedToSupportedChain';

localforage.config({
  name: 'msgport xaccount',
  storeName: 'xaccount'
});

type AppProviderProps = {
  children: ReactNode;
};

export const AppProvider = ({ children }: AppProviderProps) => {
  const chainId = useChainId();

  const { isChainSupported, isConnected, address } = useIsConnectedToSupportedChain();

  const removeRemoteChain = useChainStore((state) => state.removeRemoteChain);

  const returnDashboard = useReturnDashboard();

  const previousChainId = useRef(chainId);
  const previousAddress = useRef(address);

  useEffect(() => {
    if (!isConnected) {
      removeRemoteChain();
      returnDashboard();
    }
  }, [isConnected, removeRemoteChain, returnDashboard]);

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
      {isChainSupported && <TransactionManager />}
    </>
  );
};
