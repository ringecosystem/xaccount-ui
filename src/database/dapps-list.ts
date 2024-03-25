import { openDB } from 'idb';

export interface Item {
  id?: number;
  name: string;
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
    upgrade(db) {
      if (!db.objectStoreNames.contains('items')) {
        const store = db.createObjectStore('items', {
          keyPath: 'id',
          autoIncrement: true
        });

        store.createIndex('name', 'name', { unique: false });
        store.createIndex('url', 'url', { unique: false });
        store.createIndex('icon', 'icon', { unique: false });
        store.createIndex('description', 'description', { unique: false });
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

export async function addItem(item: Item): Promise<number> {
  const db = await openDB(DAPPS_DB_NAME, 1);
  const tx = db.transaction('items', 'readwrite');
  const store = tx.objectStore('items');
  const result = await store.add(item);
  return result as number;
}

export async function updateItem(id: number, newData: UpdateData): Promise<number | null> {
  const db = await openDB(DAPPS_DB_NAME, 1);
  const tx = db.transaction('items', 'readwrite');
  const store = tx.objectStore('items');
  const item: Item | undefined = await store.get(id);
  if (item) {
    const result = await store.put({ ...item, ...newData });
    return result as number; // 假设result是更新操作的键值（id），并且是数字类型
  }
  return null;
}

export async function deleteItem(id: number): Promise<void> {
  const db = await openDB(DAPPS_DB_NAME, 1);
  const tx = db.transaction('items', 'readwrite');
  const store = tx.objectStore('items');
  return await store.delete(id);
}
