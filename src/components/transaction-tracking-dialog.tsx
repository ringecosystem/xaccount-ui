import React, { useMemo } from 'react';
import { Loader } from 'lucide-react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { getChainById } from '@/utils';

import type { WaitForTransactionReceiptData } from 'wagmi/query';
import type { Config } from 'wagmi';

interface TransactionTrackingDialogProps {
  data?: WaitForTransactionReceiptData<Config, number>;
  originalChainId?: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
export function TransactionTrackingDialog({
  data,
  originalChainId,
  open,
  onOpenChange
}: TransactionTrackingDialogProps) {
  const chain = getChainById(originalChainId);

  const explorerInfo = useMemo(() => {
    if (!data?.transactionHash || !chain) return null;

    return {
      url: `${chain?.blockExplorers?.default.url}/tx/${data.transactionHash}`,
      name: chain?.blockExplorers?.default.name
    };
  }, [chain, data]);

  const msgScanInfo = useMemo(() => {
    if (!data?.transactionHash) return null;

    return {
      url: `https://scan.msgport.xyz/messages/${data?.transactionHash}`,
      name: 'MsgPort'
    };
  }, [data]);

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-2">
            <Loader color="gray" size={24} />
            <AlertDialogTitle>Processing Transaction</AlertDialogTitle>
          </div>

          <AlertDialogDescription className="flex flex-col">
            <span>Your transaction is being processed. Please wait.</span>
            <span>
              <a
                target="_blank"
                rel="noopener"
                className="break-all text-primary hover:underline"
                href={explorerInfo?.url}
              >
                View on {explorerInfo?.name}
              </a>
            </span>
            or
            <span>
              <a
                target="_blank"
                rel="noopener"
                className="break-all text-primary hover:underline"
                href={msgScanInfo?.url}
              >
                View on {msgScanInfo?.name}
              </a>
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction>Close</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
