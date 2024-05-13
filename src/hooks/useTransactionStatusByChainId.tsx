import { Config, useWaitForTransactionReceipt } from 'wagmi';
import { useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { WaitForTransactionReceiptData } from 'wagmi/query';

import { getChainById } from '@/utils';
import {
  pendingToastClassName,
  failedToastClassName,
  successToastClassName,
  CrossChainTransactionToast,
  SingleChainTransactionToast
} from '@/components/chain-transaction-toast';

import { useLatestCallback } from './useLatestCallback';

import type { ChainId } from '@/types/chains';

export type SuccessType = (data: WaitForTransactionReceiptData<Config, ChainId>) => void;
export type ErrorType = (data: WaitForTransactionReceiptData<Config, ChainId>) => void | null;

export interface UseTransactionStatusByChainIdProps {
  hash?: `0x${string}` | undefined;
  chainId?: number;
  targetChainId?: number;
  onSuccess?: SuccessType;
  onError?: ErrorType;
}

export function useTransactionStatusByChainId({
  hash,
  chainId,
  targetChainId,
  onSuccess,
  onError
}: UseTransactionStatusByChainIdProps) {
  const { data, isLoading, isSuccess, isError } = useWaitForTransactionReceipt({
    hash,
    chainId,
    query: {
      enabled: !!hash && !!chainId
    }
  });

  const toastRef = useRef<string | number | null>(null);

  const onSuccessLatest = useLatestCallback<SuccessType>(onSuccess);
  const onErrorLatest = useLatestCallback<ErrorType>(onError);

  useEffect(() => {
    if ((isSuccess || isError) && data) {
      if (isSuccess) {
        onSuccessLatest?.(data);
      } else {
        onErrorLatest?.(data);
      }

      const chain = getChainById(data.chainId);

      if (targetChainId) {
        const toastClassName = isSuccess ? pendingToastClassName : failedToastClassName;

        const targetChain = getChainById(targetChainId);

        const statusMessage =
          typeof chain !== 'undefined' && typeof targetChain !== 'undefined' ? (
            <CrossChainTransactionToast
              transactionHash={data.transactionHash}
              status={isSuccess ? 'pending' : 'failed'}
              chain={chain}
              targetChain={targetChain}
            />
          ) : null;

        toastRef.current = toast(statusMessage, {
          classNames: toastClassName
        });
      } else {
        const toastClassName = isSuccess ? successToastClassName : failedToastClassName;

        const statusMessage = isSuccess
          ? 'The transaction was successful'
          : 'The transaction failed';

        toastRef.current = toast(statusMessage, {
          description:
            typeof chain !== 'undefined' ? (
              <SingleChainTransactionToast chain={chain} transactionHash={data.transactionHash} />
            ) : null,
          classNames: toastClassName
        });
      }
    }

    return () => {
      if (toastRef.current) {
        toast.dismiss(toastRef.current);
      }
    };
  }, [isSuccess, isError, data, onSuccessLatest, onErrorLatest, targetChainId]);

  return { isSuccess, isError, isLoading, data };
}
