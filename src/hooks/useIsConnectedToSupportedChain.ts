import { useAccount } from 'wagmi';

import { getChains } from '@/utils/chain';

interface ConnectionStatus {
  isConnected: boolean;
  isChainSupported: boolean;
  address?: `0x${string}`;
  currentChainId?: number;
  errorMessage?: string;
}

export function useIsConnectedToSupportedChain(): ConnectionStatus {
  const { address, chainId: currentChainId, isConnected } = useAccount();

  let errorMessage: string | undefined;

  if (!isConnected) {
    errorMessage = 'User is not connected to any chain.';
  }

  const isChainSupported = Boolean(
    currentChainId && getChains().find((chain) => chain.id === currentChainId)
  );

  if (isConnected && !isChainSupported) {
    errorMessage = 'Connected chain is not supported.';
  }

  return {
    isConnected,
    isChainSupported,
    address,
    currentChainId: isConnected && isChainSupported ? currentChainId : undefined,
    errorMessage
  };
}
