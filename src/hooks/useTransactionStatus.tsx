import { Config, useWaitForTransactionReceipt } from 'wagmi';
import { useEffect } from 'react';
import { WaitForTransactionReceiptData } from 'wagmi/query';

import { ChainId } from '@/types/chains';

import { useLatestCallback } from './useLatestCallback';

export type SuccessType = (data: WaitForTransactionReceiptData<Config, ChainId>) => void;
export type ErrorType = () => void | null;
export interface UseTransactionStatusProps {
  chainId: number;
  hash: `0x${string}` | undefined;
  onSuccess?: SuccessType;
  onError?: ErrorType;
}

export function useTransactionStatus({
  chainId,
  hash,
  onSuccess,
  onError
}: UseTransactionStatusProps) {
  const { data, isLoading, isSuccess, isError } = useWaitForTransactionReceipt({
    hash,
    chainId,
    query: { enabled: !!hash && !!chainId }
  });

  const onSuccessLatest = useLatestCallback<SuccessType>(onSuccess);
  const onErrorLatest = useLatestCallback<ErrorType>(onError);

  useEffect(() => {
    if ((isSuccess || isError) && data) {
      if (isSuccess) {
        onSuccessLatest?.(data);
      } else {
        onErrorLatest?.();
      }
    }
  }, [isSuccess, isError, data, onSuccessLatest, onErrorLatest]);

  return { isSuccess, isError, isLoading, data };
}
