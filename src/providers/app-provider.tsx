import React, { ReactNode, useRef } from 'react';
import { useChainId } from 'wagmi';
import localforage from 'localforage';
import { useDebounce } from 'react-use';

import useChainStore from '@/store/chain';
import TransactionManager from '@/components/transaction-manager';
import useReturnDashboard from '@/hooks/useReturnDashboard';
import { useIsConnectedToSupportedChain } from '@/hooks/useIsConnectedToSupportedChain';

localforage.config({
  name: 'msgport xaccount',
  storeName: 'xaccount'
});
const DEBOUNCE_TIME = 500;

type AppProviderProps = {
  children: ReactNode;
};
export const AppProvider = ({ children }: AppProviderProps) => {
  const chainId = useChainId();
  const { isChainSupported, address, isConnected } = useIsConnectedToSupportedChain();
  const removeRemoteChain = useChainStore((state) => state.removeRemoteChain);
  const returnDashboard = useReturnDashboard();

  const previousChainId = useRef(chainId);
  const previousAddress = useRef(address);

  useDebounce(
    () => {
      if (
        !isConnected ||
        !isChainSupported ||
        (previousChainId.current && previousChainId.current !== chainId) ||
        (previousAddress.current && previousAddress.current !== address)
      ) {
        removeRemoteChain();
        returnDashboard();
      }

      previousChainId.current = chainId;
      previousAddress.current = address;
    },
    DEBOUNCE_TIME,
    [chainId, address, isConnected, isChainSupported, removeRemoteChain, returnDashboard]
  );

  return (
    <>
      {children}
      {isChainSupported && <TransactionManager />}
    </>
  );
};
