'use client';
import { useRef, useCallback } from 'react';
import { useCopyToClipboard } from 'react-use';
import { toast } from 'sonner';

import { Menubar } from '@/components/ui/menubar';

import LocalAccount from './local-account';
import RemoteAccount from './remote-account';
import { getChainById } from '@/utils';

type AccountProps = {
  chainId?: number;
  localAddress?: `0x${string}`;
};

const Account = ({ chainId, localAddress }: AccountProps) => {
  const toastRef = useRef<string | number | null>(null);
  const [, copyToClipboard] = useCopyToClipboard();

  const chain = getChainById(chainId);

  const handleCopy = useCallback(
    (address: `0x${string}`) => {
      copyToClipboard(address);
      toastRef.current = toast('✅ Address successfully copied to clipboard.', {
        duration: 2000
      });
    },
    [copyToClipboard]
  );

  return (
    <Menubar className="h-[40px] gap-2 border-none p-0">
      {!!localAddress && <LocalAccount address={localAddress} onCopy={handleCopy} />}
      {<RemoteAccount localChain={chain} localAddress={localAddress} />}
    </Menubar>
  );
};
export default Account;
