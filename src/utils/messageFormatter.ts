import {
  ErrorResponse,
  SDKRequestData,
  RequestId,
  SuccessResponse,
  MethodToResponse,
  Methods
} from '../types/communicator';
import { getSDKVersion } from './communicator';

// i.e. 0-255 -> '00'-'ff'
const dec2hex = (dec: number): string => dec.toString(16).padStart(2, '0');

const generateId = (len: number): string => {
  const arr = new Uint8Array((len || 40) / 2);
  window.crypto.getRandomValues(arr);
  return Array.from(arr, dec2hex).join('');
};

export const generateRequestId = (): string => {
  if (typeof window !== 'undefined') {
    return generateId(10);
  }

  return new Date().getTime().toString(36);
};

class MessageFormatter {
  static makeRequest = <M extends Methods = Methods, P = unknown>(
    method: M,
    params: P
  ): SDKRequestData<M, P> => {
    const id = generateRequestId();

    return {
      id,
      method,
      params,
      env: {
        sdkVersion: getSDKVersion()
      }
    };
  };

  static makeResponse = (
    id: RequestId,
    data: MethodToResponse[Methods],
    version: string
  ): SuccessResponse => ({
    id,
    success: true,
    version,
    data
  });

  static makeErrorResponse = (id: RequestId, error: string, version: string): ErrorResponse => ({
    id,
    success: false,
    error,
    version
  });
}

export { MessageFormatter };
