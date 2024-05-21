import { useAccount, useChainId } from 'wagmi';

interface ConnectionStatus {
  isConnected: boolean;
  isChainSupported: boolean;
  address?: string;
  currentChainId?: number;
  errorMessage?: string;
}

export function useIsConnectedToSupportedChain(): ConnectionStatus {
  const { address, chainId: currentChainId, isConnected } = useAccount();
  const supportedChainId = useChainId();

  let errorMessage: string | undefined;

  if (!isConnected) {
    errorMessage = 'User is not connected to any chain.';
  }

  const isChainSupported = Boolean(
    supportedChainId && currentChainId && supportedChainId === currentChainId
  );
  if (isConnected && !isChainSupported) {
    errorMessage = 'Connected chain is not supported.';
  }

  return {
    isConnected,
    isChainSupported,
    address: isConnected ? address : undefined,
    currentChainId: isConnected && isChainSupported ? currentChainId : undefined,
    errorMessage
  };
}
