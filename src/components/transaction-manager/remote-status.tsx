import { memo, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import PubSub from 'pubsub-js';

import { fetchMessageDetails } from '@/server/messageDetails';
import {
  failedToastClassName,
  successToastClassName,
  CrossChainTransactionToast
} from '@/components/chain-transaction-toast';
import { getChainById } from '@/utils';
import { TRANSACTION_REFETCH_INTERVAL } from '@/config/transaction';
import { EMITTER_EVENTS } from '@/config/emitter';

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
    queryFn: () => fetchMessageDetails(hash),
    enabled: Boolean(hash),
    refetchInterval: TRANSACTION_REFETCH_INTERVAL
  });

  useEffect(() => {
    if (isSuccess) {
      if (data && hash) {
        const status = data?.status;
        if (requestId && data?.dispatch_transaction_hash) {
          PubSub.publish(EMITTER_EVENTS.TRANSACTION_REQUEST, {
            requestId,
            hash: data?.dispatch_transaction_hash
          });
        }
        if (status === 'dispatch_success' || status === 'dispatch_error') {
          const success = status === 'dispatch_success';
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
