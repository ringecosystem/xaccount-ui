import {
  MILLISECONDS_IN_A_DAY,
  TransactionStatus,
  transactionStatusDescriptions
} from '@/config/transaction';

interface Transaction {
  hash: `0x${string}`;
  status: TransactionStatus;
  createdAt: number;
}

// Retrieves a user-friendly description for a specified transaction status
export const getTransactionStatusDescription = (status: TransactionStatus): string => {
  return transactionStatusDescriptions[status];
};

export const getPastTime = (days: number) => {
  return Date.now() - days * MILLISECONDS_IN_A_DAY;
};

export const countTransactionsByDays = (
  transactions: Transaction[]
): Record<string, Transaction[]> => {
  const MILLISECONDS_IN_A_DAY = 86400000;
  let groupedTransactions: Record<string, Transaction[]> = {};

  const now = new Date();
  now.setHours(0, 0, 0, 0);

  transactions.forEach((tx) => {
    const txDate = new Date(tx.createdAt);
    if (isNaN(txDate.getTime())) {
      console.error('Invalid date format:', tx.createdAt);
      return;
    }
    txDate.setHours(0, 0, 0, 0);

    const daysAgo = Math.floor((now.getTime() - txDate.getTime()) / MILLISECONDS_IN_A_DAY);
    let dateKey;
    if (daysAgo === 0) {
      dateKey = 'Today';
    } else if (daysAgo === 1) {
      dateKey = '1 day ago';
    } else {
      dateKey = `${daysAgo} days ago`;
    }

    if (!groupedTransactions[dateKey]) {
      groupedTransactions[dateKey] = [];
    }
    groupedTransactions[dateKey].push(tx);
  });

  return groupedTransactions;
};
