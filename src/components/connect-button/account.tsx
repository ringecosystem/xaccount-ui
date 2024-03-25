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

import { Separator } from '../ui/separator';

import LocalAccount from './local-account';
import RemoteAccount from './remote-account';

type AccountProps = {
  address: `0x${string}`;
};
const styles = {
  borderRadius: '50%'
};
const Account = ({ address }: AccountProps) => {
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
    <div className="flex items-center gap-4">
      <LocalAccount address={address} />
      <RemoteAccount address={address} />
    </div>
  ) : null;
};
export default Account;
