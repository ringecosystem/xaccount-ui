import React from 'react';

import { useTransactionStore } from '@/store/transaction';

import TransactionLocalStatus from './transaction-local-status';
import TransactionRemoteStatus from './transaction-remote-status';

const TransactionManager = () => {
  const transactions = useTransactionStore((state) => state.transactions);

  const initializedLocalTransactions = transactions?.filter(
    (transaction) => !transaction.isLocalChainTransactionComplete
  );
  const completedLocalTransactions = transactions?.filter(
    (transaction) => transaction.isLocalChainTransactionComplete
  );

  return transactions?.length ? (
    <>
      {initializedLocalTransactions.map((transaction) => (
        <TransactionLocalStatus
          key={transaction.hash}
          hash={transaction.hash}
          chainId={transaction.chainId}
          targetChainId={transaction.targetChainId}
        />
      ))}
      {completedLocalTransactions.map((transaction) => (
        <TransactionRemoteStatus
          key={transaction.hash}
          hash={transaction.hash}
          chainId={transaction.chainId}
          targetChainId={transaction.targetChainId}
        />
      ))}
    </>
  ) : null;
};

export default TransactionManager;
