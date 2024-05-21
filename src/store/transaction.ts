import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { StorageKeys } from '@/config/storage-keys';
import { CLEANUP_INTERVAL_DAYS, TransactionStatus } from '@/config/transaction';
import { storage } from '@/utils/storage';
import { getPastTime } from '@/utils';

export interface Transaction {
  hash: `0x${string}`;
  chainId: number;
  address: `0x${string}`;
  targetChainId: number;
  createdAt: number;
  status: TransactionStatus;
  requestId?: string;
}

interface TransactionState {
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, 'createdAt'>) => void;
  setTransactionStatus: (hash: `0x${string}`, status: TransactionStatus) => void;
  cleanUpOldTransactions: () => void;
  removeTransaction: (hash: `0x${string}`) => void;
}

export const useTransactionStore = create<TransactionState>()(
  persist(
    (set) => ({
      transactions: [],
      addTransaction: (transaction: Omit<Transaction, 'createdAt'>) =>
        set((state) => ({
          transactions: [...state.transactions, { ...transaction, createdAt: Date.now() }]
        })),
      setTransactionStatus: (hash, status) =>
        set((state) => ({
          transactions: state.transactions.map((tx) => (tx.hash === hash ? { ...tx, status } : tx))
        })),
      cleanUpOldTransactions: () => {
        const pastTimeLimit = getPastTime(CLEANUP_INTERVAL_DAYS);

        set((state) => {
          const hasOldTransactions = state.transactions.some((tx) => tx.createdAt <= pastTimeLimit);
          if (!hasOldTransactions) {
            return state;
          }
          return {
            transactions: state.transactions.filter((tx) => tx.createdAt > pastTimeLimit)
          };
        });
      },

      removeTransaction: (hash) =>
        set((state) => ({
          transactions: state.transactions.filter((tx) => tx.hash !== hash)
        }))
    }),
    {
      name: StorageKeys.TRANSACTION,
      storage: createJSONStorage(() => storage)
    }
  )
);
