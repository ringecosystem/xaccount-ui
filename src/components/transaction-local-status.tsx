import { memo } from 'react';

import { useTransactionStatusByChainId } from '@/hooks/useTransactionStatusByChainId';
import { useTransactionStore } from '@/store/transaction';
import { TransactionStatus } from '@/config/transaction';

interface TransactionStatusProps {
  hash?: `0x${string}`;
  chainId?: number;
  targetChainId?: number;
}
const TransactionLocalStatus = ({ hash, chainId, targetChainId }: TransactionStatusProps) => {
  const setTransactionStatus = useTransactionStore((state) => state.setTransactionStatus);
  useTransactionStatusByChainId({
    hash,
    chainId,
    targetChainId,
    onSuccess({ transactionHash }) {
      setTransactionStatus(transactionHash, TransactionStatus.ProcessingOnRemote);
    }
  });

  return null;
};

export default memo(TransactionLocalStatus);
