import { useTransactionStatusByChainId } from '@/hooks/useTransactionStatusByChainId';
import { useTransactionStore } from '@/store/transaction';

interface TransactionStatusProps {
  hash?: `0x${string}`;
  chainId?: number;
}
const TransactionStatus = ({ hash, chainId }: TransactionStatusProps) => {
  const removeTransaction = useTransactionStore((state) => state.removeTransaction);

  useTransactionStatusByChainId({
    hash,
    chainId,
    onSuccess({ transactionHash }) {
      removeTransaction(transactionHash);
    },
    onError({ transactionHash }) {
      removeTransaction(transactionHash);
    }
  });

  return null;
};

export default TransactionStatus;
