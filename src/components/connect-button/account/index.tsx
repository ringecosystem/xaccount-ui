'use client';
import { useRef, useCallback } from 'react';
import { useCopyToClipboard } from 'react-use';
import { toast } from 'sonner';

import { Menubar } from '@/components/ui/menubar';

import LocalAccount from './local-account';
import RemoteAccount from './remote-account';
import { useChains } from 'wagmi';

type AccountProps = {
  localAddress?: `0x${string}`;
};

const Account = ({ localAddress }: AccountProps) => {
  const toastRef = useRef<string | number | null>(null);
  const [, copyToClipboard] = useCopyToClipboard();

  const handleCopy = useCallback(
    (address: `0x${string}`) => {
      copyToClipboard(address);
      toastRef.current = toast('✅ Address successfully copied to clipboard.', {
        duration: 2000
      });
    },
    [copyToClipboard]
  );

  const chains = useChains();

  return (
    <Menubar className="h-[40px] gap-2 border-none p-0">
      {!!localAddress && <LocalAccount address={localAddress} onCopy={handleCopy} />}
      {<RemoteAccount onCopy={handleCopy} />}
    </Menubar>
  );
};
export default Account;
