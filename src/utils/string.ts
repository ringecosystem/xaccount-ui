/**
 * Removes version information from an error message and provides a default message if the error message is undefined or empty.
 * @param errorMessage The error message that might contain version information.
 * @param defaultMessage The default message to return if the error message is undefined or empty.
 * @returns A cleaned error message without version information or the default message if the original message is undefined or empty.
 */
export function removeVersionFromErrorMessage(
  errorMessage?: string,
  defaultMessage: string = 'An error occurred'
): string {
  if (!errorMessage) {
    return defaultMessage;
  }
  return errorMessage.replace(/Version: viem@\S+/, '').trim() || defaultMessage;
}
