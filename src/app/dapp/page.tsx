'use client';

import { getChainById, isSameUrl } from '@/utils';
import useAppCommunicator, { CommunicatorMessages } from '@/hooks/useAppCommunicator';
import useAppIsLoading from './useAppIsLoading';
import SafeAppIframe from './SafeAppIframe';
import { useCallback, useEffect, useState } from 'react';
import {
  EIP712TypedData,
  Methods,
  RequestId,
  SendTransactionRequestParams
} from '@safe-global/safe-apps-sdk';

import {
  useAccount,
  useSendTransaction,
  useSignMessage,
  useSignTypedData,
  useWaitForTransactionReceipt
} from 'wagmi';
import { useSearchParams } from 'next/navigation';
import useGetSafeInfo from '@/hooks/useGetSafeInfo';
import Spin from '@/components/ui/spin';
import CrossChainExecutor from '@/components/cross-chain-executor';
import { BaseTransaction } from '@/types/transaction';
import { Item, searchItemByUrl } from '@/database/dapps-repository';
import { useTransactionStatus } from '@/hooks/useTransactionStatus';

const Page = () => {
  const params = useSearchParams();
  const appUrl = params.get('appUrl') as string | undefined;
  const [message, setMessage] = useState<`0x${string}` | EIP712TypedData | undefined>();
  const [transactionOpen, setTransactionOpen] = useState(false);
  const safeInfo = useGetSafeInfo();

  const [dappItem, setDappItem] = useState<Item | undefined>();

  const [transactionInfo, setTransactionInfo] = useState<BaseTransaction | undefined>();

  const { chainId, address, isConnected } = useAccount();

  const chain = getChainById(chainId as number);
  const { iframeRef, appIsLoading, isLoadingSlow, setAppIsLoading } = useAppIsLoading();
  const [currentRequestId, setCurrentRequestId] = useState<RequestId | undefined>();

  const { signMessage, data: signature } = useSignMessage();

  const { signTypedData, data: signatureTyped } = useSignTypedData();

  const { data: hash, sendTransaction, isPending } = useSendTransaction();

  const { isLoading: isClaimTransactionConfirming } = useTransactionStatus({
    hash: hash
    // onSuccess: (data) => {
    //   updateOperationStatus('claim', 0);
    //   if (data) {
    //     reset();
    //     onSuccessLatest?.(data);
    //   }
    // },
    // onError() {
    //   reset();
    //   updateOperationStatus('claim', 0);
    //   onErrorLatest?.();
    // }
  });

  const communicator = useAppCommunicator(iframeRef, chain, {
    onConfirmTransactions: (
      txs: BaseTransaction[],
      requestId: RequestId,
      params?: SendTransactionRequestParams
    ) => {
      console.log('onConfirmTransactions', txs, requestId, params);
      setCurrentRequestId(requestId);

      console.log('txs', txs);
      setTransactionInfo(txs?.[0]);
      setTransactionOpen(true);
      // sendTransaction(txs?.[0]);
      //   const data = {
      //     app: safeAppFromManifest,
      //     appId: remoteApp ? String(remoteApp.id) : undefined,
      //     requestId,
      //     txs,
      //     params
      //   };

      //   setTxFlow(<SafeAppsTxFlow data={data} />, onTxFlowClose);
    },
    onSignMessage: (
      message: `0x${string}` | EIP712TypedData,
      requestId: string,
      method: Methods.signMessage | Methods.signTypedMessage,
      sdkVersion: string
    ) => {
      setCurrentRequestId(requestId);
      if (method === Methods.signTypedMessage) {
        signTypedData(message as any);
        setMessage(message);
      } else if (method === Methods.signMessage) {
        setMessage(message);
        signMessage({
          message: { raw: message as `0x${string}` }
        });
      }
    },

    onGetEnvironmentInfo: () => ({
      origin: document.location.origin
    }),
    onGetSafeInfo: () => safeInfo
  });

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

  useEffect(() => {
    if (signature && message && currentRequestId) {
      communicator?.send({ messageHash: message, signature }, currentRequestId);
    }
  }, [signature, message, currentRequestId, communicator]);

  useEffect(() => {
    if (signatureTyped && message && currentRequestId) {
      communicator?.send({ messageHash: message, signature: signatureTyped }, currentRequestId);
    }
  }, [signatureTyped, message, currentRequestId, communicator]);

  useEffect(() => {
    if (iframeRef?.current?.contentWindow) {
      iframeRef.current.contentWindow.location.href = appUrl as string;
    }
  }, [chainId, address, isConnected, iframeRef, appUrl, setAppIsLoading]);

  useEffect(() => {
    if (!communicator || !hash || !currentRequestId) {
      return;
    }
    communicator?.send({ safeTxHash: hash }, currentRequestId);
  }, [communicator, hash, currentRequestId]);

  const onIframeLoad = useCallback(() => {
    const iframe = iframeRef.current;
    if (!iframe || !isSameUrl(iframe.src, appUrl as string)) {
      return;
    }

    setAppIsLoading(false);
  }, [appUrl, iframeRef, setAppIsLoading]);

  useEffect(() => {
    if (appUrl) {
      searchItemByUrl(appUrl as `https://${string}`).then((items) => {
        if (items.length > 0) {
          setDappItem(items[0]);
        }
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
          height: '100%',
          display: appIsLoading ? 'none' : 'block'
        }}
      >
        <SafeAppIframe
          appUrl={appUrl as string}
          iframeRef={iframeRef}
          onLoad={onIframeLoad}
          title={'11'}
        />
      </div>
      <CrossChainExecutor
        open={transactionOpen}
        onOpenChange={handleOpenChange}
        requestId={currentRequestId}
        transactionInfo={transactionInfo}
        dappItem={dappItem}
        confirmLoading={isPending || isClaimTransactionConfirming}
        onSubmit={() => {
          sendTransaction(transactionInfo as BaseTransaction);
        }}
      />
    </>
  );
};

export default Page;
