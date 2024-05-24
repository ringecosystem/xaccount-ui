'use client';
import { useConnectModal } from '@rainbow-me/rainbowkit';

import { useIsConnectedToSupportedChain } from '@/hooks/useIsConnectedToSupportedChain';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import Account from './account';
import ErrorChain from './error-chain';
interface ConnectButtonProps {
  className?: string;
}
const ConnectButton = ({ className }: ConnectButtonProps) => {
  const { openConnectModal } = useConnectModal();

  const { isConnected, address, currentChainId, isChainSupported } =
    useIsConnectedToSupportedChain();

  return (
    <div
      className={cn(
        'flex h-full w-full items-center justify-between space-x-[1.25rem] md:w-auto md:justify-center',
        className
      )}
    >
      {!isConnected && openConnectModal ? (
        <Button onClick={openConnectModal}>Connect Wallet</Button>
      ) : null}
      {isConnected && address && isChainSupported ? (
        <Account localAddress={address} chainId={currentChainId} />
      ) : null}
      {isConnected && !isChainSupported ? <ErrorChain /> : null}
    </div>
  );
};
export default ConnectButton;
