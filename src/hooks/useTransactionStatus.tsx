import { Config, useAccount, useWaitForTransactionReceipt } from 'wagmi';
import { useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { WaitForTransactionReceiptData } from 'wagmi/query';

import { ChainId } from '@/types/chains';
import { getChainById } from '@/utils';

import { useLatestCallback } from './useLatestCallback';

export type SuccessType = (data: WaitForTransactionReceiptData<Config, ChainId>) => void;
export type ErrorType = () => void | null;
export interface UseTransactionStatusProps {
  hash: `0x${string}` | undefined;
  onSuccess?: SuccessType;
  onError?: ErrorType;
}

export function useTransactionStatus({ hash, onSuccess, onError }: UseTransactionStatusProps) {
  const { chainId } = useAccount();

  const { data, isLoading, isSuccess, isError } = useWaitForTransactionReceipt({
    hash,
    chainId: chainId
  });

  const toastRef = useRef<string | number | null>(null);

  const onSuccessLatest = useLatestCallback<SuccessType>(onSuccess);
  const onErrorLatest = useLatestCallback<ErrorType>(onError);

  useEffect(() => {
    if ((isSuccess || isError) && data) {
      const chain = getChainById(data.chainId);
      const statusMessage = isSuccess ? 'The transaction was successful' : 'The transaction failed';
      const toastClassName = isSuccess
        ? {
            toast: 'group-[.toaster]:border-green-500',
            closeButton: 'group-[.toast]:bg-green-500 group-[.toast]:border-green-500'
          }
        : {
            toast: 'group-[.toaster]:border-red-500',
            closeButton: 'group-[.toast]:bg-red-500 group-[.toast]:border-red-500'
          };

      toastRef.current = toast(statusMessage, {
        description: (
          <a
            target="_blank"
            rel="noopener"
            className="break-all text-primary hover:underline"
            href={`${chain?.blockExplorers?.default?.url}tx/${data.transactionHash}`}
          >
            {data.transactionHash}
          </a>
        ),
        classNames: toastClassName
      });

      if (isSuccess) {
        onSuccessLatest?.(data);
      } else {
        onErrorLatest?.();
      }
    }

    return () => {
      if (toastRef.current) {
        toast.dismiss(toastRef.current);
      }
    };
  }, [isSuccess, isError, data, onSuccessLatest, onErrorLatest]);

  return { isSuccess, isError, isLoading, data };
}
