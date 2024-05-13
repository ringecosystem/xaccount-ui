import { useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

import { useTransactionStore } from '@/store/transaction';
import { fetchMessageDetails } from '@/server/messageDetails';
import {
  failedToastClassName,
  successToastClassName,
  CrossChainTransactionToast
} from '@/components/chain-transaction-toast';
import { getChainById } from '@/utils';

interface TransactionStatusProps {
  hash?: `0x${string}`;
  chainId?: number;
  targetChainId?: number;
}
const TransactionStatus = ({ hash, chainId, targetChainId }: TransactionStatusProps) => {
  const removeTransaction = useTransactionStore((state) => state.removeTransaction);
  const toastRef = useRef<string | number | null>(null);

  const { data, isSuccess, isError } = useQuery({
    queryKey: ['messageDetails', hash],
    queryFn: () =>
      fetchMessageDetails('0xc7a67d57ca1c5865adbabd799d1aae850e8d234113b9dd04d2ff9d3321369e67'),
    enabled: Boolean(hash),
    refetchInterval: 1000
  });

  useEffect(() => {
    if ((isSuccess || isError) && data && hash) {
      const status = data?.status;

      if (isSuccess && (status === 'dispatch_success' || status === 'dispatch_error')) {
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
            classNames: toastClassName
          });
          removeTransaction(hash);
        }
      }
    }

    return () => {
      if (toastRef.current) {
        toast.dismiss(toastRef.current);
      }
    };
  }, [isSuccess, isError, data, targetChainId, chainId, hash, removeTransaction]);
  return null;
};

export default TransactionStatus;
