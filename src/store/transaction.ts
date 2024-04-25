import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { storage } from './util';

export interface Transaction {
  hash: `0x${string}`;
  chainId: number;
}

interface TransactionState {
  transactions: Transaction[];
  addTransaction: (transaction: Transaction) => void;
  removeTransaction: (hash: `0x${string}`) => void;
}

export const useTransactionStore = create<TransactionState>()(
  persist(
    (set) => ({
      transactions: [],

      addTransaction: (transaction: Transaction) =>
        set((state) => ({
          transactions: [...state.transactions, transaction]
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
