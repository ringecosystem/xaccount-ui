'use client';
import { useRef } from 'react';
import { Copy, Power, ExternalLink } from 'lucide-react';
import { useCopyToClipboard } from 'react-use';
import Image from 'next/image';
import { useAccount, useChains } from 'wagmi';
import { toast } from 'sonner';

import { useDisconnectWallet } from '@/hooks/useDisconnectWallet';
import { toShortAddress } from '@/utils';
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger
} from '@/components/ui/menubar';
import { Button } from '@/components/ui/button';

type AccountProps = {
  address: `0x${string}`;
};

const LocalAccount = ({ address }: AccountProps) => {
  const toastRef = useRef<string | number | null>(null);
  const [, copyToClipboard] = useCopyToClipboard();

  const { disconnectWallet } = useDisconnectWallet();

  const { chain } = useAccount();
  const chains = useChains();

  const handleCopy = () => {
    copyToClipboard(address);
    toastRef.current = toast('✅ Address successfully copied to clipboard.', {
      duration: 2000
    });
  };
  const handleDisconnect = () => {
    disconnectWallet(address);
  };

  return (
    <Menubar className="h-[40px] gap-2 border-none p-0">
      <MenubarMenu>
        <MenubarTrigger className="account-button border bg-transparent p-0 text-sm">
          <div className="account-button-network  hidden gap-2 md:flex">
            <Image
              src={`/images/chains/${chain?.name?.toLocaleLowerCase()}.svg`}
              width={20}
              height={20}
              alt={chain?.name || 'chain'}
            ></Image>

            <span>Local</span>
          </div>
          <Button className=" h-[36px]  text-muted-foreground" variant="secondary">
            <span className="hidden md:inline">{toShortAddress(address)}</span>
            <span className="md:hidden ">Local</span>
          </Button>
        </MenubarTrigger>
        <MenubarContent>
          <MenubarItem disabled>Local: {chain?.name}</MenubarItem>
          <MenubarSeparator />

          <MenubarItem className="flex items-center justify-between" onClick={handleCopy}>
            {toShortAddress(address)}
            <Copy className="h-4 w-4" strokeWidth={1} />
          </MenubarItem>
          <MenubarSeparator />

          <MenubarItem
            className="gap-2"
            onClick={() =>
              window.open(`${chain?.blockExplorers?.default?.url}/address/${address}`, '_blank')
            }
          >
            <ExternalLink className="h-4 w-4" strokeWidth={1} />
            View on {chain?.blockExplorers?.default?.name}
          </MenubarItem>

          <MenubarSeparator />
          <MenubarItem className="gap-2" onClick={handleDisconnect}>
            <Power className="h-4 w-4" strokeWidth={1} />
            Disconnect
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger className="account-button border bg-transparent p-0 text-sm">
          <div className="account-button-network hidden gap-2 md:flex">
            <Image
              src={`/images/chains/${chain?.name?.toLocaleLowerCase()}.svg`}
              width={20}
              height={20}
              alt={chain?.name || 'chain'}
            ></Image>

            <span>Remote</span>
          </div>
          <Button className=" h-[36px]  text-muted-foreground" variant="secondary">
            <span className="hidden md:inline">{toShortAddress(address)}</span>
            <span className="md:hidden ">Remote</span>
          </Button>
        </MenubarTrigger>

        <MenubarContent>
          <MenubarItem disabled>Remote: {chain?.name}</MenubarItem>

          <MenubarSeparator />

          <MenubarItem className="flex items-center justify-between" onClick={handleCopy}>
            {toShortAddress(address)}
            <Copy className="h-4 w-4" strokeWidth={1} />
          </MenubarItem>
          <MenubarSeparator />

          {chains?.map((chain) => {
            return <MenubarItem key={chain.id}>Create on {chain.name}</MenubarItem>;
          })}
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
};
export default LocalAccount;
