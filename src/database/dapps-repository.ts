import { openDB } from 'idb';

export interface Item {
  id?: number;
  name: string;
  hostname: string;
  url: string;
  icon?: string;
  description?: string;
}

export interface UpdateData {
  name?: string;
  url?: string;
}
export const DAPPS_DB_NAME = 'xAccount_dapps_list';

export async function initDB() {
  const db = await openDB(DAPPS_DB_NAME, 1, {
    upgrade(db, oldVersion, newVersion, transaction) {
      let store;
      if (!db.objectStoreNames.contains('items')) {
        store = db.createObjectStore('items', {
          keyPath: 'id',
          autoIncrement: true
        });
      } else {
        store = transaction.objectStore('items');
      }

      if (!store.indexNames.contains('name')) {
        store.createIndex('name', 'name', { unique: false });
      }
      if (!store.indexNames.contains('url')) {
        store.createIndex('url', 'url', { unique: false });
      }
      if (!store.indexNames.contains('icon')) {
        store.createIndex('icon', 'icon', { unique: false });
      }
      if (!store.indexNames.contains('description')) {
        store.createIndex('description', 'description', { unique: false });
      }
      if (!store.indexNames.contains('hostname')) {
        store.createIndex('hostname', 'hostname', { unique: false });
      }
    }
  });
  return db;
}

export async function getAllItems(): Promise<Item[]> {
  const db = await openDB(DAPPS_DB_NAME, 1);
  const tx = db.transaction('items', 'readonly');
  const store = tx.objectStore('items');
  const allItems: Item[] = await store.getAll();
  return allItems;
}

export async function getItem(id: number): Promise<Item | undefined> {
  const db = await openDB(DAPPS_DB_NAME, 1);
  const tx = db.transaction('items', 'readonly');
  const store = tx.objectStore('items');
  const item: Item | undefined = await store.get(id);
  return item;
}

export async function searchItemByUrl(url: `https://${string}`): Promise<Item[]> {
  const normalizedHostname = new URL(url).hostname.toLowerCase();
  const db = await openDB(DAPPS_DB_NAME, 1);
  const tx = db.transaction('items', 'readonly');
  const store = tx.objectStore('items');
  const index = store.index('hostname');
  const items: Item[] = await index.getAll(IDBKeyRange.only(normalizedHostname));
  return items;
}

export async function addItem(item: Omit<Item, 'hostname'>): Promise<number> {
  const db = await openDB(DAPPS_DB_NAME, 1);
  const tx = db.transaction('items', 'readwrite');
  const store = tx.objectStore('items');
  const result = await store.add({
    ...item,
    hostname: new URL(item.url).hostname?.toLocaleLowerCase()
  });
  return result as number;
}

export async function updateItem(
  id: number,
  newData: Omit<Item, 'hostname' | 'id'>
): Promise<number | null> {
  const db = await openDB(DAPPS_DB_NAME, 1);
  const tx = db.transaction('items', 'readwrite');
  const store = tx.objectStore('items');
  const item: Item | undefined = await store.get(id);
  if (item) {
    const changeData: Item = { ...item, ...newData };
    if (changeData.url) {
      changeData.hostname = new URL(changeData.url).hostname?.toLocaleLowerCase();
    }
    const result = await store.put(changeData);
    return result as number;
  }
  return null;
}

export async function deleteItem(id: number): Promise<void> {
  const db = await openDB(DAPPS_DB_NAME, 1);
  const tx = db.transaction('items', 'readwrite');
  const store = tx.objectStore('items');
  return await store.delete(id);
}
