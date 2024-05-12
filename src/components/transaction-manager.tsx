import React from 'react';

import { useTransactionStore } from '@/store/transaction';

import TransactionStatus from './transaction-status';

const TransactionManager = () => {
  const transactions = useTransactionStore((state) => state.transactions);

  return transactions?.length ? (
    <>
      {transactions.map((transaction) => (
        <TransactionStatus
          key={transaction.hash}
          hash={transaction.hash}
          chainId={transaction.chainId}
        />
      ))}
    </>
  ) : null;
};

export default TransactionManager;
