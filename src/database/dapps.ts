import localforage from 'localforage';

import { StorageKeys } from '@/config/storage-keys';

export interface DappInfo {
  name: string;
  hostname: string;
  url: `https://${string}`;
  icon?: string;
  description?: string;
}

export const getDapps = async (): Promise<DappInfo[]> => {
  try {
    const dapps = await localforage.getItem<DappInfo[]>(StorageKeys.DAPPS);
    return dapps || [];
  } catch (error) {
    console.log('Error getting dapps', error);
    return [];
  }
};

export const addDapp = async (dapp: Omit<DappInfo, 'hostname'>): Promise<void> => {
  try {
    const dappsList = await getDapps();
    const hostname = new URL(dapp.url).hostname.toLocaleLowerCase();
    const newDapp = { ...dapp, hostname };
    await localforage.setItem(StorageKeys.DAPPS, [...(dappsList || []), newDapp]);
  } catch (error) {
    console.log('Error setting dapp', error);
  }
};

export const deleteDapp = async (hostname: DappInfo['hostname']): Promise<void> => {
  try {
    const dappsList = await getDapps();
    if (dappsList) {
      const filteredDapps = dappsList.filter((item) => item.hostname !== hostname);
      await localforage.setItem(StorageKeys.DAPPS, filteredDapps);
    }
  } catch (error) {
    console.log('Error deleting dapp', error);
  }
};

export const searchDapp = async (hostname: DappInfo['hostname']): Promise<DappInfo | undefined> => {
  try {
    const dappsList = await getDapps();
    return dappsList.find((item) => item.hostname === hostname);
  } catch (error) {
    console.log('Error searching dapp', error);
  }
};
