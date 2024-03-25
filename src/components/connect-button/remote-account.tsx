'use client';
import { useRef } from 'react';
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon';
import { useCopyToClipboard } from 'react-use';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useDisconnectWallet } from '@/hooks/useDisconnectWallet';
import { toShortAddress } from '@/utils';

type AccountProps = {
  address: `0x${string}`;
};
const styles = {
  borderRadius: '50%'
};
const RemoteAccount = ({ address }: AccountProps) => {
  const toastRef = useRef<string | number | null>(null);
  const [, copyToClipboard] = useCopyToClipboard();

  const { disconnectWallet } = useDisconnectWallet();

  const handleCopy = () => {
    copyToClipboard(address);
    // toastRef.current = toast('✅ Address successfully copied to clipboard.', {
    //   duration: 2000
    // });
  };
  const handleDisconnect = () => {
    disconnectWallet(address);
  };

  return address ? (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex h-full cursor-pointer items-center gap-3 rounded bg-accent px-4 py-1 hover:bg-accent/80">
          <span>
            <Jazzicon diameter={32} seed={jsNumberForAddress(address)} svgStyles={styles} />
          </span>
          <div className="flex flex-col text-sm">
            <span>Remote: darwinia</span>
            <span>{toShortAddress(address)?.toUpperCase()}</span>
          </div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-44">
        <DropdownMenuItem
          title="Click to copy the address to your clipboard"
          className="cursor-pointer p-3"
          onClick={handleCopy}
        >
          Copy Address
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer p-3" onClick={handleDisconnect}>
          Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ) : null;
};
export default RemoteAccount;
