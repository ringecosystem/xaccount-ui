'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useAccount, useSignMessage, useSignTypedData } from 'wagmi';
import { useSearchParams } from 'next/navigation';
import { useShallow } from 'zustand/react/shallow';
import PubSub from 'pubsub-js';

import useGetSafeInfo from '@/hooks/useGetSafeInfo';
import { EMITTER_EVENTS } from '@/config/emitter';
import Spin from '@/components/ui/spin';
import CrossChainExecutor from '@/components/cross-chain-executor';
import { BaseTransaction } from '@/types/transaction';
import { DappInfo, searchDapp } from '@/database/dapps';
import useChainStore from '@/store/chain';
import useAppCommunicator, { CommunicatorMessages } from '@/hooks/useAppCommunicator';
import { isSameUrl } from '@/utils';
import SelectChainDialog from '@/components/select-chain-dialog';
import useExecute from '@/hooks/useExecute';
import { TransactionStatus } from '@/config/transaction';
import { useTransactionStore } from '@/store/transaction';
import {
  EIP712TypedData,
  Methods,
  RequestId,
  SendTransactionRequestParams
} from '@/types/communicator';

import SafeAppIframe from './SafeAppIframe';
import useAppIsLoading from './useAppIsLoading';

const Page = () => {
  const params = useSearchParams();
  const appUrl = params.get('appUrl') as string | undefined;
  const pubSubRef: React.MutableRefObject<any> = useRef();
  const safeInfo = useGetSafeInfo();
  const [transactionOpen, setTransactionOpen] = useState(false);
  const [dappItem, setDappItem] = useState<DappInfo | undefined>();
  const [transactionInfo, setTransactionInfo] = useState<BaseTransaction | undefined>();
  const { chainId, address, isConnected } = useAccount();
  const [remoteChainAlertOpen, setRemoteChainAlertOpen] = useState(false);

  const { remoteChain } = useChainStore(
    useShallow((state) => ({
      remoteChain: state.remoteChain
    }))
  );
  const addTransaction = useTransactionStore((state) => state.addTransaction);

  const { iframeRef, appIsLoading, isLoadingSlow, setAppIsLoading } = useAppIsLoading();
  const [currentRequestId, setCurrentRequestId] = useState<RequestId | undefined>();

  const { signMessageAsync } = useSignMessage();

  const { signTypedDataAsync } = useSignTypedData();

  const { execute, isPending, crossChainFeeData, isLoading } = useExecute({
    transactionInfo,
    fromChainId: chainId as number,
    toChainId: remoteChain?.id as number,
    fromAddress: address as `0x${string}`,
    toModuleAddress: remoteChain?.moduleAddress as `0x${string}`
  });

  const communicator = useAppCommunicator(iframeRef, remoteChain, {
    onConfirmTransactions: (
      txs: BaseTransaction[],
      requestId: RequestId,
      params?: SendTransactionRequestParams
    ) => {
      setCurrentRequestId(requestId);
      setTransactionInfo(txs?.[0]);
      if (!remoteChain) {
        setRemoteChainAlertOpen(true);
        return;
      }
      setTransactionOpen(true);
    },
    onSignMessage: (
      message: `0x${string}` | EIP712TypedData,
      requestId: string,
      method: Methods.signMessage | Methods.signTypedMessage,
      sdkVersion: string
    ) => {
      setCurrentRequestId(requestId);
      if (method === Methods.signTypedMessage) {
        signTypedDataAsync(message as any)?.then((signature) => {
          communicator?.send({ messageHash: message, signature: signature }, requestId);
        });
      } else if (method === Methods.signMessage) {
        signMessageAsync({
          message: { raw: message as `0x${string}` }
        })?.then((signature) => {
          communicator?.send({ messageHash: message, signature }, requestId);
        });
      }
    },
    onGetEnvironmentInfo: () => ({
      origin: document.location.origin
    }),
    onGetSafeInfo: () => safeInfo,
    onGetTxBySafeTxHash: (safeTxHash: string) => safeTxHash
  });

  const handleSelectChainOpenChange = (open: boolean) => {
    setRemoteChainAlertOpen(open);
    if (!open) {
      setCurrentRequestId((prevId) => {
        if (prevId) {
          communicator?.send(CommunicatorMessages.REJECT_TRANSACTION_MESSAGE, prevId, true);
        }
        return undefined;
      });
    }
  };

  const handleOpenChange = (open: boolean) => {
    setTransactionOpen(open);
    if (!open) {
      setCurrentRequestId((prevId) => {
        if (prevId) {
          communicator?.send(CommunicatorMessages.REJECT_TRANSACTION_MESSAGE, prevId, true);
        }
        return undefined;
      });
    }
  };
  const handleSubmit = useCallback(() => {
    if (!remoteChain) {
      setRemoteChainAlertOpen(true);
      return;
    }
    execute()?.then((hash) => {
      addTransaction({
        hash,
        chainId: chainId as number,
        address: address as `0x${string}`,
        targetChainId: remoteChain?.id as number,
        status: TransactionStatus.ProcessingOnLocal,
        requestId: currentRequestId
      });
      setTransactionOpen(false);
      setCurrentRequestId(undefined);
    });
  }, [remoteChain, execute, addTransaction, address, chainId, currentRequestId]);

  useEffect(() => {
    if (iframeRef?.current?.contentWindow) {
      iframeRef.current.contentWindow.location.href = appUrl as string;
    }
  }, [remoteChain?.id, remoteChain?.safeAddress, isConnected, iframeRef, appUrl, setAppIsLoading]);

  useEffect(() => {
    pubSubRef.current = PubSub.subscribe(EMITTER_EVENTS.TRANSACTION_REQUEST, (eventName, data) => {
      const { hash, requestId } = data;
      console.log(EMITTER_EVENTS.TRANSACTION_REQUEST, data);
      communicator?.send({ safeTxHash: hash }, requestId as string);
    });
    return () => {
      PubSub.unsubscribe(pubSubRef.current);
      pubSubRef.current = null;
    };
  }, [communicator]);

  const onIframeLoad = useCallback(() => {
    const iframe = iframeRef.current;
    if (!iframe || !isSameUrl(iframe.src, appUrl as string)) {
      setAppIsLoading(false);
      return;
    }
    setAppIsLoading(false);
  }, [appUrl, iframeRef, setAppIsLoading]);

  useEffect(() => {
    if (appUrl) {
      const hostname = new URL(appUrl).hostname;
      searchDapp(hostname).then((items) => {
        setDappItem(items);
      });
    } else {
      setDappItem(undefined);
    }
    return () => {
      setDappItem(undefined);
    };
  }, [appUrl]);

  return (
    <>
      {appIsLoading && (
        <div className="flex h-full w-full flex-col items-center justify-center ">
          {isLoadingSlow && <h4>The Dapp is taking too long to load, consider refreshing.</h4>}
          <Spin className="text-muted-foreground" />
        </div>
      )}
      <div
        style={{
          display: appIsLoading ? 'none' : 'block'
        }}
        className="h-full"
      >
        <SafeAppIframe appUrl={appUrl as string} iframeRef={iframeRef} onLoad={onIframeLoad} />
      </div>
      <SelectChainDialog open={remoteChainAlertOpen} onOpenChange={handleSelectChainOpenChange} />
      <CrossChainExecutor
        open={transactionOpen}
        onOpenChange={handleOpenChange}
        transactionInfo={transactionInfo}
        dappItem={dappItem}
        isLoading={isLoading}
        crossChainFeeData={crossChainFeeData}
        confirmLoading={isPending}
        onSubmit={handleSubmit}
      />
    </>
  );
};

export default Page;
