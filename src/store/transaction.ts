import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { storage } from './util';

export interface Transaction {
  hash: `0x${string}`;
  chainId: number;
  targetChainId?: number;
  isLocalChainTransactionComplete?: boolean;
}

interface TransactionState {
  transactions: Transaction[];
  addTransaction: (transaction: Transaction) => void;
  setLocalChainTransactionComplete: (hash: `0x${string}`) => void;
  removeTransaction: (hash: `0x${string}`) => void;
}

export const useTransactionStore = create<TransactionState>()(
  persist(
    (set) => ({
      transactions: [],

      addTransaction: (transaction: Omit<Transaction, 'isLocalChainTransactionComplete'>) =>
        set((state) => ({
          transactions: [...state.transactions, transaction]
        })),
      setLocalChainTransactionComplete: (hash) =>
        set((state) => ({
          transactions: state.transactions.map((tx) =>
            tx.hash === hash ? { ...tx, isLocalChainTransactionComplete: true } : tx
          )
        })),
      removeTransaction: (hash) =>
        set((state) => ({
          transactions: state.transactions.filter((tx) => tx.hash !== hash)
        }))
    }),
    {
      name: 'transaction-storage',
      storage: createJSONStorage(() => storage)
    }
  )
);
