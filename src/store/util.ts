import { getItem, removeItem, setItem } from '@/utils/storage';

export const storage = {
  getItem: (key: string) => {
    const value = getItem(key);
    try {
      return value ? JSON.parse(value) : undefined;
    } catch (error) {
      console.log('getItem error', error);
    }
  },
  setItem: (key: string, value: string) => {
    try {
      const str = JSON.stringify(value);
      setItem(key, str);
    } catch (error) {
      console.log('setItem error', error);
    }
  },
  removeItem
};
