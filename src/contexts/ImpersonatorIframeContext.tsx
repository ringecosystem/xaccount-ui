'use client';
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
  RefObject
} from 'react';
import { JsonRpcProvider } from 'ethers';
import { getAddress } from 'ethers';
import { useAppCommunicator } from '../utils/communicator';
import {
  InterfaceMessageIds,
  InterfaceMessageProps,
  Methods,
  MethodToResponse,
  RequestId,
  RPCPayload,
  SignMessageParams,
  SignTypedMessageParams,
  Transaction,
  TransactionDetails,
  TransactionStatus
} from '../types/communicator';

interface TransactionWithId extends Transaction {
  id: number | string;
}

type SafeInjectContextType = {
  address: string | undefined;
  appUrl: string | undefined;
  rpcUrl: string | undefined;
  iframeRef: RefObject<HTMLIFrameElement | null>;
  latestTransaction: TransactionWithId | undefined;
  setAddress: React.Dispatch<React.SetStateAction<string | undefined>>;
  setAppUrl: React.Dispatch<React.SetStateAction<string | undefined>>;
  setRpcUrl: React.Dispatch<React.SetStateAction<string | undefined>>;
  targetChainId: string | undefined;
  setTargetChainId: React.Dispatch<React.SetStateAction<string | undefined>>;
  sendMessageToIFrame: <T extends InterfaceMessageIds>(
    message: InterfaceMessageProps<T>,
    requestId?: RequestId
  ) => void;
  onUserTxConfirm: (safeTxHash: string, requestId: RequestId) => void;
  onTxReject: (requestId: RequestId) => void;
  isReady: boolean;
};

export const ImpersonatorIframeContext = createContext<SafeInjectContextType>({
  address: undefined,
  appUrl: undefined,
  rpcUrl: undefined,
  iframeRef: { current: null } as RefObject<HTMLIFrameElement | null>,
  latestTransaction: undefined,
  targetChainId: undefined,
  setAddress: () => {},
  setAppUrl: () => {},
  setRpcUrl: () => {},
  setTargetChainId: () => {},
  sendMessageToIFrame: () => {},
  onUserTxConfirm: () => {},
  onTxReject: () => {},
  isReady: false
});

interface FCProps {
  children: React.ReactNode;
}

export const ImpersonatorIframeProvider: React.FunctionComponent<FCProps> = ({ children }) => {
  const [address, setAddress] = useState<string>();
  const [appUrl, setAppUrl] = useState<string>();
  const [rpcUrl, setRpcUrl] = useState<string>();
  const [targetChainId, setTargetChainId] = useState<string>();
  const [provider, setProvider] = useState<JsonRpcProvider>();
  const [latestTransaction, setLatestTransaction] = useState<TransactionWithId>();
  const [isReady, setIsReady] = useState<boolean>(false);

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const communicator = useAppCommunicator(iframeRef);

  const sendMessageToIFrame = useCallback(
    function <T extends InterfaceMessageIds>(
      message: InterfaceMessageProps<T>,
      requestId?: RequestId
    ) {
      const requestWithMessage = {
        ...message,
        requestId: requestId || Math.trunc(window.performance.now()),
        version: '0.4.2'
      };

      if (iframeRef.current && appUrl) {
        iframeRef.current.contentWindow?.postMessage(requestWithMessage, appUrl);
      }
    },
    [iframeRef, appUrl]
  );

  const onUserTxConfirm = (safeTxHash: string, requestId: RequestId) => {
    // Safe Apps SDK V1 Handler
    sendMessageToIFrame(
      {
        messageId: 'TRANSACTION_CONFIRMED', // INTERFACE_MESSAGES.TRANSACTION_CONFIRMED
        data: { safeTxHash }
      },
      requestId
    );

    // Safe Apps SDK V2 Handler
    communicator?.send({ safeTxHash }, requestId as string);
  };

  const onTxReject = (requestId: RequestId) => {
    console.log('onTxReject', requestId);

    // Safe Apps SDK V1 Handler
    sendMessageToIFrame(
      {
        messageId: 'TRANSACTION_REJECTED', // INTERFACE_MESSAGES.TRANSACTION_REJECTED
        data: {}
      },
      requestId
    );

    // Safe Apps SDK V2 Handler
    communicator?.send('Transaction was rejected', requestId as string, true);
  };

  useEffect(() => {
    if (!rpcUrl) return;

    setProvider(new JsonRpcProvider(rpcUrl));
  }, [rpcUrl]);

  useEffect(() => {
    if (!provider) return;

    communicator?.on(Methods.getSafeInfo, async () => {
      return {
        safeAddress: address,
        chainId: targetChainId,
        owners: [],
        threshold: 1,
        isReadOnly: false,
        network: targetChainId
      };
    });

    communicator?.on(Methods.getEnvironmentInfo, async () => ({
      origin: document.location.origin
    }));

    communicator?.on(Methods.rpcCall, async (msg) => {
      const params = msg.data.params as RPCPayload;

      try {
        const response = (await provider.send(
          params.call,
          params.params
        )) as MethodToResponse['rpcCall'];
        return response;
      } catch (err) {
        return err;
      }
    });

    communicator?.on(Methods.sendTransactions, (msg) => {
      console.log('communicator.sendTransactions', msg);

      const transactions = (msg.data.params as { txs: Transaction[] }).txs.map(
        ({ to, ...rest }) => ({
          to: getAddress(to), // checksummed
          ...rest
        })
      );
      setLatestTransaction({
        id: msg.data.id,
        ...transactions[0]
      });
      // openConfirmationModal(transactions, msg.data.params.params, msg.data.id)
    });

    communicator?.on(Methods.getTxBySafeTxHash, async (msg) => {
      const { safeTxHash } = msg.data.params as { safeTxHash: string };

      const tx = await provider.getTransaction(safeTxHash);
      if (!tx) throw new Error('Transaction not found');

      let timestamp: number | undefined;
      if (tx.blockNumber) {
        const block = await provider.getBlock(tx.blockNumber);
        timestamp = block?.timestamp;
      }

      const response: TransactionDetails = {
        txId: safeTxHash,
        txStatus: tx.blockNumber ? TransactionStatus.SUCCESS : TransactionStatus.PENDING,
        executedAt: timestamp,
        txInfo: {
          type: 'Custom',
          to: {
            value: tx.to ?? ''
          },
          dataSize: tx.data,
          value: tx.value.toString(),
          isCancellation: false
        },
        txHash: safeTxHash
      };

      return response;
    });

    communicator?.on(Methods.signMessage, async (msg) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { message } = msg.data.params as SignMessageParams;

      // openSignMessageModal(message, msg.data.id, Methods.signMessage)
    });

    communicator?.on(Methods.signTypedMessage, async (msg) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { typedData } = msg.data.params as SignTypedMessageParams;

      // openSignMessageModal(typedData, msg.data.id, Methods.signTypedMessage)
    });

    setIsReady(true);
  }, [communicator, address, provider, targetChainId]);

  return (
    <ImpersonatorIframeContext.Provider
      value={{
        address,
        appUrl,
        rpcUrl,
        iframeRef,
        latestTransaction,
        targetChainId,
        setTargetChainId,
        setAddress,
        setAppUrl,
        setRpcUrl,
        sendMessageToIFrame,
        onUserTxConfirm,
        onTxReject,
        isReady
      }}
    >
      {children}
    </ImpersonatorIframeContext.Provider>
  );
};

export const useImpersonatorIframe = () => useContext(ImpersonatorIframeContext);
