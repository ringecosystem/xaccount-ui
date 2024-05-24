import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { StorageKeys } from '@/config/storage-keys';
import { storage } from '@/utils/storage';

export type KeyInfo = {
  localChainId: number;
  localAddress: `0x${string}`;
  remoteChainId: number;
};

const getKey = (keyInfo: KeyInfo): string => {
  return `${keyInfo.localChainId}-${keyInfo.localAddress.toLocaleLowerCase()}-${keyInfo.remoteChainId}`;
};

export type StatusType = 'created' | 'pending' | 'completed';

export interface XAccountItem {
  safeAddress: `0x${string}`;
  moduleAddress: `0x${string}`;
  status: StatusType;
  transactionHash?: `0x${string}`;
}

interface XAccountsState {
  accounts: Record<string, XAccountItem>;
  addAccount: (keyInfo: KeyInfo, account: XAccountItem) => void;
  searchAccount: (keyInfo: KeyInfo) => XAccountItem | undefined;
  searchAccountByTransactionHash: (
    transactionHash: `0x${string}`
  ) => { account: XAccountItem; keyInfo: KeyInfo } | undefined;
  updateAccount: (keyInfo: KeyInfo, updateAccountInfo: Partial<XAccountItem>) => void;
  updateAccountByTransactionHash: (
    transactionHash: `0x${string}`,
    updateAccountInfo: Partial<XAccountItem>
  ) => void;
}

export const useXAccountsStore = create<XAccountsState>()(
  persist(
    (set, get) => ({
      accounts: {},
      addAccount: (keyInfo, account) =>
        set((state) => ({
          accounts: { ...state.accounts, [getKey(keyInfo)]: account }
        })),
      searchAccount: (keyInfo) => {
        return get().accounts[getKey(keyInfo)];
      },
      searchAccountByTransactionHash: (transactionHash) => {
        const entry = Object.entries(get().accounts).find(
          ([, account]) => account.transactionHash === transactionHash
        );

        if (!entry) {
          return undefined;
        }

        const [key, account] = entry;

        const parts = key.split('-');
        if (parts.length !== 3) {
          console.error('Invalid key format');
          return undefined;
        }

        const localChainId = parseInt(parts[0], 10);
        const localAddress = parts[1]?.toLowerCase() as `0x${string}`;
        const remoteChainId = parseInt(parts[2], 10);

        if (isNaN(localChainId) || isNaN(remoteChainId)) {
          console.error('Invalid chain ID');
          return undefined;
        }

        return {
          account,
          keyInfo: {
            localChainId,
            localAddress,
            remoteChainId
          } as KeyInfo
        };
      },

      updateAccount: (keyInfo, updateAccountInfo) =>
        set((state) => {
          const key = getKey(keyInfo);
          const account = state.accounts[key];
          if (!account) {
            return state;
          }
          return {
            ...state,
            accounts: {
              ...state.accounts,
              [key]: { ...account, ...updateAccountInfo }
            }
          };
        }),
      updateAccountByTransactionHash: (transactionHash, updateAccountInfo) =>
        set((state) => {
          const item = get()?.searchAccountByTransactionHash(transactionHash);

          console.log('获取到的item', item);

          if (!item) {
            return state;
          }
          const { keyInfo, account } = item;
          console.log('keyInfo', keyInfo);
          console.log('account', account);

          return {
            ...state,
            accounts: {
              ...state.accounts,
              [getKey(keyInfo)]: { ...account, ...updateAccountInfo }
            }
          };
        })
    }),
    {
      name: StorageKeys.XACCOUNTS,
      storage: createJSONStorage(() => storage)
    }
  )
);
