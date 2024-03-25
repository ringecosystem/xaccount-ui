'use client';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';

import { Button } from '@/components/ui/button';

import Account from './account';

const ConnectButton = () => {
  const { openConnectModal } = useConnectModal();
  const { isConnected, address } = useAccount();

  return (
    <div className="flex h-full w-full items-center justify-between space-x-[1.25rem] md:w-auto md:justify-center">
      {!isConnected && openConnectModal ? (
        <Button onClick={openConnectModal}>Connect Wallet</Button>
      ) : null}
      {isConnected && address ? <Account address={address} /> : null}
    </div>
  );
};
export default ConnectButton;
