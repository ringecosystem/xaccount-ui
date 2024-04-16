'use client';
import { IDBPDatabase, openDB } from 'idb';

export type StatusType = 'create' | 'pending' | 'completed';

export interface XAccountItem {
  id?: number;
  fromChainId: number;
  toChainId: number;
  fromAddress: `0x${string}`;
  toSafeAddress: `0x${string}`;
  toModuleAddress: `0x${string}`;
  status: StatusType;
}

export const DAPPS_DB_NAME = 'xAccounts';
const version = 2;

export async function initXAccountsDB() {
  const db = await openDB(DAPPS_DB_NAME, version, {
    upgrade(db, oldVersion, newVersion, transaction) {
      let xAccountsStore;
      if (!db.objectStoreNames.contains('xAccounts')) {
        xAccountsStore = db.createObjectStore('xAccounts', {
          keyPath: 'id',
          autoIncrement: true
        });
      } else {
        // 如果存在，则直接获取该对象存储
        xAccountsStore = transaction.objectStore('xAccounts');
      }

      // 以下是创建索引的部分，同样首先检查索引是否已经存在
      if (!xAccountsStore.indexNames.contains('fromChainId')) {
        xAccountsStore.createIndex('fromChainId', 'fromChainId', { unique: false });
      }
      if (!xAccountsStore.indexNames.contains('toChainId')) {
        xAccountsStore.createIndex('toChainId', 'toChainId', { unique: false });
      }
      if (!xAccountsStore.indexNames.contains('fromAddress')) {
        xAccountsStore.createIndex('fromAddress', 'fromAddress', { unique: false });
      }
      if (!xAccountsStore.indexNames.contains('toSafeAddress')) {
        xAccountsStore.createIndex('toSafeAddress', 'toSafeAddress', { unique: false });
      }
      if (!xAccountsStore.indexNames.contains('toModuleAddress')) {
        xAccountsStore.createIndex('toModuleAddress', 'toModuleAddress', { unique: false });
      }
      if (!xAccountsStore.indexNames.contains('status')) {
        xAccountsStore.createIndex('status', 'status', { unique: false });
      }

      if (!xAccountsStore.indexNames.contains('fromChainIdAndToChainIdAndFromAddress')) {
        xAccountsStore.createIndex(
          'fromChainIdAndToChainIdAndFromAddress',
          ['fromChainId', 'toChainId', 'fromAddress'],
          {
            unique: true
          }
        );
      }
    }
  });
  return db;
}
// 创建一个全局的数据库实例
let dbInstance: IDBPDatabase<unknown> | null = null;

async function getDB() {
  if (!dbInstance) {
    dbInstance = await openDB(DAPPS_DB_NAME, version);
  }
  return dbInstance;
}

export async function addXAccount(xAccount: XAccountItem) {
  const db = await getDB();
  const tx = db.transaction('xAccounts', 'readwrite');
  const store = tx.objectStore('xAccounts');

  try {
    const index = store.index('fromChainIdAndToChainIdAndFromAddress');
    const checkExist = await index.get([
      xAccount.fromChainId,
      xAccount.toChainId,
      xAccount.fromAddress
    ]);
    if (checkExist) {
      console.log('xAccount already exists');
      return;
    }

    const result = await store.add(xAccount);
    // 等待事务完成
    await new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve(result as number);
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(tx.error);
    });
  } catch (error) {
    console.error('Failed to add xAccount:', error);
  }
}

export type UpdateXAccountByFromChainIdAndToChainIdAndFromAddressParams = {
  fromChainId: number;
  toChainId: number;
  fromAddress: string;
};
export async function getXAccountByFromChainIdAndToChainIdAndFromAddress({
  fromChainId,
  toChainId,
  fromAddress
}: UpdateXAccountByFromChainIdAndToChainIdAndFromAddressParams): Promise<XAccountItem | undefined> {
  const db = await getDB();

  const transaction = db.transaction('xAccounts', 'readonly');
  const store = transaction.objectStore('xAccounts');
  const index = store.index('fromChainId');
  const range = IDBKeyRange.only(fromChainId);

  let xAccountItem: XAccountItem | undefined = undefined;

  const matchingItems: XAccountItem[] = [];
  for await (const cursor of index.iterate(range)) {
    matchingItems.push(cursor.value);
  }

  xAccountItem = matchingItems.find(
    (item) =>
      item.toChainId === toChainId && item.fromAddress.toLowerCase() === fromAddress.toLowerCase()
  );

  return xAccountItem;
}

export type UpdateXAccountStatusByFromChainIdAndToChainIdAndFromAddressParams = {
  fromChainId: number;
  toChainId: number;
  fromAddress: string;
  status: StatusType;
};
export async function updateXAccountStatusByFromChainIdAndToChainIdAndFromAddress({
  fromChainId,
  toChainId,
  fromAddress,
  status
}: UpdateXAccountStatusByFromChainIdAndToChainIdAndFromAddressParams) {
  try {
    const db = await getDB();
    const tx = db.transaction('xAccounts', 'readwrite');
    const store = tx.objectStore('xAccounts');
    const index = store.index('fromChainId');
    const range = IDBKeyRange.only(fromChainId);
    for await (const cursor of index.iterate(range)) {
      if (
        cursor.value.toChainId === toChainId &&
        cursor.value.fromAddress.toLowerCase() === fromAddress.toLowerCase()
      ) {
        const xAccountItem = cursor.value;
        const updatedXAccountItem = { ...xAccountItem, status };
        await cursor.update(updatedXAccountItem);
      }
    }
  } catch (error) {
    console.error('Error updating xAccount status:', error);
  }
}

export type DeleteXAccountByFromChainIdAndToChainIdAndFromAddressParams = {
  fromChainId: number;
  toChainId: number;
  fromAddress: string;
};
export async function deleteXAccountByFromChainIdAndToChainIdAndFromAddress({
  fromChainId,
  toChainId,
  fromAddress
}: DeleteXAccountByFromChainIdAndToChainIdAndFromAddressParams) {
  try {
    const db = await getDB();
    const tx = db.transaction('xAccounts', 'readwrite');
    const store = tx.objectStore('xAccounts');
    const index = store.index('fromChainId');
    const range = IDBKeyRange.only(fromChainId);
    for await (const cursor of index.iterate(range)) {
      if (
        cursor.value.toChainId === toChainId &&
        cursor.value.fromAddress.toLowerCase() === fromAddress.toLowerCase()
      ) {
        await cursor.delete();
      }
    }
  } catch (error) {
    console.error('Error deleting xAccount:', error);
  }
}
