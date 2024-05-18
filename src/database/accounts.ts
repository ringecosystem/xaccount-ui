import localforage from 'localforage';

import { StorageKeys } from '@/config/storage-keys';

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

// 通用获取数据函数
async function getStoredData<T>(key: string, defaultValue: T): Promise<T> {
  try {
    const data = await localforage.getItem<T>(key);
    return data ?? defaultValue;
  } catch (error) {
    console.error(`Error getting data from ${key}:`, error);
    return defaultValue;
  }
}

export const getAccounts = async (): Promise<Record<string, XAccountItem>> => {
  return getStoredData<Record<string, XAccountItem>>(StorageKeys.XACCOUNTS, {});
};

export const addAccount = async (keyInfo: KeyInfo, account: XAccountItem): Promise<void> => {
  const key = getKey(keyInfo);
  const accounts = await getAccounts();
  accounts[key] = account;
  try {
    await localforage.setItem(StorageKeys.XACCOUNTS, accounts);
  } catch (error) {
    console.error('Error setting account', error);
  }
};

export const searchAccount = async (keyInfo: KeyInfo): Promise<XAccountItem | undefined> => {
  const accounts = await getAccounts();
  return accounts[getKey(keyInfo)];
};

export const updateAccount = async (
  keyInfo: KeyInfo,
  updateAccountInfo: Partial<XAccountItem>
): Promise<void> => {
  const key = getKey(keyInfo);
  const accounts = await getAccounts();
  const existingAccount = accounts[key];
  if (existingAccount) {
    const updatedAccount = { ...existingAccount, ...updateAccountInfo };
    try {
      await localforage.setItem(StorageKeys.XACCOUNTS, { ...accounts, [key]: updatedAccount });
    } catch (error) {
      console.error('Error updating account', error);
    }
  }
};
