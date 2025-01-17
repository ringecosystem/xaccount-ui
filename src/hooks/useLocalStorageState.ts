import { useState, useEffect } from 'react';

export function useLocalStorageState<T>(key: string, initialValue: T) {
  const [state, setStateOriginal] = useState<T>(initialValue);

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        setStateOriginal(JSON.parse(item));
      }
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
    }
  }, [key]);

  const setState = (newState: T | ((prevState: T) => T)) => {
    try {
      const newStateValue =
        typeof newState === 'function' ? (newState as (prevState: T) => T)(state) : newState;

      window.localStorage.setItem(key, JSON.stringify(newStateValue));
      setStateOriginal(newStateValue);
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
      setStateOriginal(newState);
    }
  };

  return [state, setState] as const;
}
