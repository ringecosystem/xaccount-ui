import { memo, useEffect } from 'react';
import { useAccount, useWaitForTransactionReceipt } from 'wagmi';

import { useTransactionStore } from '@/store/transaction';
import { TransactionStatus } from '@/config/transaction';

interface TransactionStatusProps {
  hash: `0x${string}`;
}
const TransactionLocalStatus = ({ hash }: TransactionStatusProps) => {
  const { chainId } = useAccount();
  const setTransactionStatus = useTransactionStore((state) => state.setTransactionStatus);

  const { data, isSuccess, isError } = useWaitForTransactionReceipt({
    hash,
    chainId: chainId,
    query: {
      enabled: Boolean(hash) && Boolean(chainId)
    }
  });

  useEffect(() => {
    if (isSuccess || isError) {
      if (data?.transactionHash) {
        setTransactionStatus(hash, TransactionStatus.ProcessingOnRemote);
      } else {
        setTransactionStatus(hash, TransactionStatus.FailureOnLocal);
      }
    }
  }, [data?.transactionHash, hash, isSuccess, isError, setTransactionStatus]);

  return null;
};

export default memo(TransactionLocalStatus);
