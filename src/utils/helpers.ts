/**
 * Pauses the execution for a specified number of milliseconds.
 * @param ms The number of milliseconds to pause.
 * @returns A promise that resolves after the specified number of milliseconds.
 */
export const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export function checkIfRunningInSafeGlobalIframe(): boolean {
  const isInIframe = window.self !== window.top;
  if (!isInIframe) {
    return false;
  }

  try {
    const referrer = document.referrer;
    const url = new URL(referrer);
    const isCorrectDomain = url.protocol === 'https:' && url.hostname === 'app.safe.global';
    return isCorrectDomain;
  } catch (error) {
    console.error('Error checking iframe source:', error);
    return false;
  }
}
