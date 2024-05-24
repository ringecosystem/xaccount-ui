'use client';
import { useCallback } from 'react';
import { Copy, Power, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { useAccount } from 'wagmi';

import { useDisconnectWallet } from '@/hooks/useDisconnectWallet';
import { getChainById, toShortAddress } from '@/utils';
import {
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator
} from '@/components/ui/menubar';

import ChainButton from './chain-button';

type AccountProps = {
  address: `0x${string}`;
  onCopy?: (address: `0x${string}`) => void;
};

const LocalAccount = ({ address, onCopy }: AccountProps) => {
  const { disconnectWallet } = useDisconnectWallet();
  const { chainId } = useAccount();
  const chain = getChainById(chainId);

  const handleCopy = useCallback(() => {
    onCopy?.(address);
  }, [address, onCopy]);

  const handleDisconnect = () => {
    disconnectWallet(address);
  };

  return (
    <MenubarMenu>
      <ChainButton label="Local" chain={chain} address={address} />

      <MenubarContent>
        <MenubarItem disabled className="gap-2">
          Local : {chain?.name}
        </MenubarItem>
        <MenubarSeparator />

        <MenubarItem className=" cursor-pointer gap-2" onClick={handleCopy}>
          <Copy className="h-4 w-4" strokeWidth={1} />
          {toShortAddress(address)}
        </MenubarItem>
        <MenubarSeparator />

        <MenubarItem className="cursor-pointer gap-2">
          <Link
            className="flex items-center gap-2"
            href={`${chain?.blockExplorers?.default?.url}/address/${address}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <ExternalLink className="h-4 w-4" strokeWidth={1} />
            View on {chain?.blockExplorers?.default?.name}
          </Link>
        </MenubarItem>

        <MenubarSeparator />
        <MenubarItem className="cursor-pointer gap-2" onClick={handleDisconnect}>
          <Power className="h-4 w-4" strokeWidth={1} />
          Disconnect
        </MenubarItem>
      </MenubarContent>
    </MenubarMenu>
  );
};
export default LocalAccount;
