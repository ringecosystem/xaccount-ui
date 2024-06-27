import { memo, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import PubSub from 'pubsub-js';

import { fetchMessage } from '@/server/graphql/services';
import {
  failedToastClassName,
  successToastClassName,
  CrossChainTransactionToast
} from '@/components/chain-transaction-toast';
import { getChainById } from '@/utils';
import { TRANSACTION_REFETCH_INTERVAL } from '@/config/transaction';
import { EMITTER_EVENTS } from '@/config/emitter';
import { MESSAGE_STATUS } from '@/types/message';

interface TransactionStatusProps {
  hash?: `0x${string}`;
  chainId?: number;
  targetChainId?: number;
  requestId?: string;
  onResolved?: (status: 'success' | 'failed') => void;
}
const TransactionStatus = ({
  hash,
  chainId,
  targetChainId,
  requestId,
  onResolved
}: TransactionStatusProps) => {
  const toastRef = useRef<string | number | null>(null);

  const { data, isSuccess } = useQuery({
    queryKey: ['messageDetails', hash],
    queryFn: () => fetchMessage(hash!),
    enabled: Boolean(hash),
    refetchInterval: TRANSACTION_REFETCH_INTERVAL
  });

  useEffect(() => {
    if (isSuccess) {
      if (data && hash) {
        const status = data?.status;
        if (requestId && data?.targetTransactionHash) {
          PubSub.publish(EMITTER_EVENTS.TRANSACTION_REQUEST, {
            requestId,
            hash: data?.targetTransactionHash
          });
        }
        if (status === MESSAGE_STATUS.SUCCESS || status === MESSAGE_STATUS.FAILED) {
          const success = status === MESSAGE_STATUS.SUCCESS;
          const chain = getChainById(chainId);
          const targetChain = getChainById(targetChainId);

          if (chain && targetChain) {
            const toastClassName = success ? successToastClassName : failedToastClassName;

            const statusMessage = (
              <CrossChainTransactionToast
                transactionHash={hash}
                status={success ? 'success' : 'failed'}
                chain={chain}
                targetChain={targetChain}
              />
            );

            toastRef.current = toast(statusMessage, {
              classNames: toastClassName,
              duration: 0
            });
            onResolved?.(success ? 'success' : 'failed');
          }
        }
      }
    }

    return () => {
      if (toastRef.current) {
        toast.dismiss(toastRef.current);
      }
    };
  }, [isSuccess, data, targetChainId, chainId, hash, onResolved, requestId]);

  return null;
};

export default memo(TransactionStatus);
