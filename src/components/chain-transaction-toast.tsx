import React from 'react';

import { cn } from '@/lib/utils';

import type { Chain } from '@rainbow-me/rainbowkit';

export const pendingToastClassName = {
  toast: 'group-[.toaster]:border-blue-500',
  closeButton: 'group-[.toast]:bg-blue-500 group-[.toast]:border-blue-500'
};
export const successToastClassName = {
  toast: 'group-[.toaster]:border-green-500',
  closeButton: 'group-[.toast]:bg-green-500 group-[.toast]:border-green-500'
};
export const failedToastClassName = {
  toast: 'group-[.toaster]:border-red-500',
  closeButton: 'group-[.toast]:bg-red-500 group-[.toast]:border-red-500'
};

interface CrossChainTransactionToastProps {
  transactionHash: `0x${string}`;
  status: 'success' | 'pending' | 'failed';
  chain: Chain;
  targetChain: Chain;
}
export const CrossChainTransactionToast = ({
  transactionHash,
  status,
  chain,
  targetChain
}: CrossChainTransactionToastProps) => {
  const explorerInfo = {
    url: `${chain?.blockExplorers?.default.url}/tx/${transactionHash}` || 'Explorer',
    name: chain?.blockExplorers?.default.name
  };

  const msgScanInfo = {
    url: `https://scan.msgport.xyz/messages/${transactionHash}`,
    name: 'Msgport Scan'
  };
  const statusStyles = {
    success: {
      color: 'text-green-500',
      title: `Transaction Succeeded on ${targetChain?.name}`
    },
    pending: {
      color: 'text-blue-500',
      title: `Transaction Initiated on ${targetChain?.name}`
    },
    failed: {
      color: 'text-red-500',
      title: `Transaction Failed on ${chain?.name}`
    }
  };

  const { color, title } = statusStyles[status];

  return (
    <div className="space-y-3">
      <h2 className={cn('font-bold', color)}>{title}</h2>
      <div className="space-y-2">
        <p className="text-secondary-foreground ">
          Your transaction on {chain?.name} was successful and is now pending on {targetChain?.name}
        </p>
        <div className="flex items-center gap-4">
          <a
            target="_blank"
            rel="noopener noreferrer"
            className={cn('block w-1/2 text-primary hover:underline', color)}
            href={explorerInfo?.url}
          >
            View on {explorerInfo?.name}
          </a>
          <a
            target="_blank"
            rel="noopener noreferrer"
            className={cn('block w-1/2 text-primary hover:underline', color)}
            href={msgScanInfo?.url}
          >
            View on {msgScanInfo?.name}
          </a>
        </div>
      </div>
    </div>
  );
};

interface SingleChainTransactionToastProps {
  transactionHash: `0x${string}`;
  chain: Chain;
}
export const SingleChainTransactionToast = ({
  transactionHash,
  chain
}: SingleChainTransactionToastProps) => {
  const explorerInfo = {
    url: `${chain?.blockExplorers?.default.url}/tx/${transactionHash}` || 'Explorer',
    name: chain?.blockExplorers?.default.name
  };
  return (
    <a
      target="_blank"
      rel="noopener"
      className="break-all text-primary hover:underline"
      href={explorerInfo?.url}
    >
      {transactionHash}
    </a>
  );
};
