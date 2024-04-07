import type { MutableRefObject } from 'react';
import { useEffect, useState } from 'react';

import { Chain } from '@rainbow-me/rainbowkit';

import type {
  EIP712TypedData,
  EnvironmentInfo,
  RequestId,
  RPCPayload,
  SendTransactionRequestParams,
  SendTransactionsParams,
  SignTypedMessageParams
} from '@safe-global/safe-apps-sdk';
import { Methods } from '@safe-global/safe-apps-sdk';

import AppCommunicator from '@/utils/communicator';

import { useEthersProvider } from '@/utils/ethers-adapters';
import { BaseTransaction } from '@/types/transaction';
import type { SafeInfo } from './useGetSafeInfo';
import { JsonRpcProvider } from 'ethers';

interface TransactionsParams extends Omit<SendTransactionsParams, 'txs'> {
  txs: BaseTransaction[];
}
export enum CommunicatorMessages {
  REJECT_TRANSACTION_MESSAGE = 'Transaction was rejected'
}

type JsonRpcResponse = {
  jsonrpc: string;
  id: number;
  result?: any;
  error?: string;
};

export type UseAppCommunicatorHandlers = {
  onConfirmTransactions: (
    txs: BaseTransaction[],
    requestId: RequestId,
    params?: SendTransactionRequestParams
  ) => void;
  onSignMessage: (
    message: `0x${string}` | EIP712TypedData,
    requestId: string,
    method: Methods.signMessage | Methods.signTypedMessage,
    sdkVersion: string
  ) => void;
  onGetEnvironmentInfo: () => EnvironmentInfo;
  onGetSafeInfo: () => SafeInfo;
};

const useAppCommunicator = (
  iframeRef: MutableRefObject<HTMLIFrameElement | null>,
  chain: Chain | undefined,
  handlers: UseAppCommunicatorHandlers
): AppCommunicator | undefined => {
  const [communicator, setCommunicator] = useState<AppCommunicator | undefined>(undefined);
  const provider = useEthersProvider();

  useEffect(() => {
    let communicatorInstance: AppCommunicator;

    const initCommunicator = (iframeRef: MutableRefObject<HTMLIFrameElement>) => {
      communicatorInstance = new AppCommunicator(iframeRef, {
        onMessage: (msg) => {
          if (!msg.data) return;
          console.log('app-communicator-message', msg?.data);
        },
        onError: (error) => {
          console.log('app-communicator-error', error);
        }
      });

      setCommunicator(communicatorInstance);
    };

    initCommunicator(iframeRef as MutableRefObject<HTMLIFrameElement>);

    return () => {
      communicatorInstance?.clear();
    };
  }, [iframeRef]);

  // Adding communicator logic for the required SDK Methods
  // We don't need to unsubscribe from the events because there can be just one subscription
  // per event type and the next effect run will simply replace the handlers
  useEffect(() => {
    communicator?.on(Methods.getEnvironmentInfo, handlers.onGetEnvironmentInfo);

    communicator?.on(Methods.getSafeInfo, handlers.onGetSafeInfo);

    communicator?.on(Methods.rpcCall, async (msg) => {
      const params = msg.data.params as RPCPayload;

      try {
        console.log(params);
        return await (provider as JsonRpcProvider)?.send(params.call, params.params);
      } catch (err) {
        throw new Error((err as JsonRpcResponse).error);
      }
    });

    communicator?.on(Methods.sendTransactions, (msg) => {
      const { txs, params } = msg.data.params as TransactionsParams;

      const transactions = txs.map(({ to, value, data }) => {
        return {
          to,
          // value: value ? BigInt(value).toString() : '0',
          value: value ? BigInt(value) : 0n,
          data: data || '0x'
        };
      });

      handlers.onConfirmTransactions(transactions, msg.data.id, params);
    });

    communicator?.on(Methods.signMessage, (msg) => {
      const { message } = msg.data.params as { message: `0x${string}` };
      const sdkVersion = msg.data.env.sdkVersion;
      handlers.onSignMessage(message, msg.data.id, Methods.signMessage, sdkVersion);
    });

    communicator?.on(Methods.signTypedMessage, (msg) => {
      const { typedData } = msg.data.params as SignTypedMessageParams;
      const sdkVersion = msg.data.env.sdkVersion;
      handlers.onSignMessage(typedData, msg.data.id, Methods.signTypedMessage, sdkVersion);
    });
  }, [handlers, chain, communicator, provider]);

  return communicator;
};

export default useAppCommunicator;
