import { useTransactionStatusByChainId } from '@/hooks/useTransactionStatusByChainId';
import { useTransactionStore } from '@/store/transaction';

interface TransactionStatusProps {
  hash?: `0x${string}`;
  chainId?: number;
  targetChainId?: number;
}
const TransactionStatus = ({ hash, chainId, targetChainId }: TransactionStatusProps) => {
  const removeTransaction = useTransactionStore((state) => state.removeTransaction);
  const setLocalChainTransactionComplete = useTransactionStore(
    (state) => state.setLocalChainTransactionComplete
  );

  useTransactionStatusByChainId({
    hash,
    chainId,
    targetChainId,
    onSuccess({ transactionHash }) {
      setLocalChainTransactionComplete(transactionHash);
    },
    onError({ transactionHash }) {
      removeTransaction(transactionHash);
    }
  });

  return null;
};

export default TransactionStatus;
