/**
 * Determines if the current execution environment is a browser.
 * This function is essential for distinguishing between server-side and client-side execution.
 * React applications, especially those utilizing server-side rendering (SSR) or static site generation (SSG),
 * need to conditionally use features like localStorage that are only available in the browser environment.
 * Accessing browser-specific objects like `window` on the server can cause errors, hence the need for this check.
 */
const isBrowser = (): boolean => typeof window !== 'undefined';

const getItem = (key: string): string | null => {
  if (!isBrowser()) {
    return null;
  }
  return localStorage.getItem(key);
};

const setItem = (key: string, value: string): void => {
  if (!isBrowser()) {
    return;
  }
  localStorage.setItem(key, value);
};

const removeItem = (key: string): void => {
  if (!isBrowser()) {
    return;
  }
  localStorage.removeItem(key);
};

export { getItem, setItem, removeItem };
