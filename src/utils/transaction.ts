import {
  MILLISECONDS_IN_A_DAY,
  TransactionStatus,
  transactionStatusDescriptions
} from '@/config/transaction';

// Retrieves a user-friendly description for a specified transaction status
export const getTransactionStatusDescription = (status: TransactionStatus): string => {
  return transactionStatusDescriptions[status];
};

export const getPastTime = (days: number) => {
  return Date.now() - days * MILLISECONDS_IN_A_DAY;
};
