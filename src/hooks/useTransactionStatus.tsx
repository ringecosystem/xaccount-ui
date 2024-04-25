import { Config, useAccount, useWaitForTransactionReceipt } from 'wagmi';
import { useEffect } from 'react';
import { WaitForTransactionReceiptData } from 'wagmi/query';

import { ChainId } from '@/types/chains';

import { useLatestCallback } from './useLatestCallback';

export type SuccessType = (data: WaitForTransactionReceiptData<Config, ChainId>) => void;
export type ErrorType = (data: WaitForTransactionReceiptData<Config, ChainId>) => void | null;
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

  const onSuccessLatest = useLatestCallback<SuccessType>(onSuccess);
  const onErrorLatest = useLatestCallback<ErrorType>(onError);

  useEffect(() => {
    if ((isSuccess || isError) && data) {
      if (isSuccess) {
        onSuccessLatest?.(data);
      } else {
        onErrorLatest?.(data);
      }
    }
  }, [isSuccess, isError, data, onSuccessLatest, onErrorLatest]);

  return { isSuccess, isError, isLoading, data };
}
