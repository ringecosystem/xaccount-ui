import { Plus } from 'lucide-react';
import Image from 'next/image';
import { Chain } from '@rainbow-me/rainbowkit';

import { Button } from '@/components/ui/button';
import { toShortAddress } from '@/utils';
import { RemoteChain } from '@/store/chain';
import { MenubarTrigger } from '@/components/ui/menubar';

// Props 类型定义
type ChainButtonProps = {
  label: string;
  chain?: Chain | RemoteChain;
  address?: `0x${string}`;
};

const ChainButton = ({ label, chain, address }: ChainButtonProps) => {
  return (
    <MenubarTrigger className="account-button h-[40px] items-center border bg-transparent p-1 text-sm hover:opacity-80">
      <div className="account-button-network hidden gap-2 md:flex">
        <span>{label}</span>
      </div>
      <div className="flex h-[28px] items-center rounded bg-secondary px-2 text-muted-foreground">
        {chain?.iconUrl ? (
          <span className="hidden md:inline-flex md:items-center md:gap-2">
            <Image
              src={chain.iconUrl as string}
              width={18}
              height={18}
              className="rounded-full"
              alt={chain?.name || 'chain'}
            />
            {address && toShortAddress(address)}
          </span>
        ) : (
          <Plus className="hidden h-6 w-6 md:inline" strokeWidth={1} />
        )}
        <span className="md:hidden">{label}</span>
      </div>
    </MenubarTrigger>
  );
};

export default ChainButton;
