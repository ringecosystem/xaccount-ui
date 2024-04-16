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

import { useAccount, useSendTransaction, useSignMessage, useSignTypedData } from 'wagmi';
import { useSearchParams } from 'next/navigation';
import useGetSafeInfo from '@/hooks/useGetSafeInfo';
import Spin from '@/components/ui/spin';
import CrossChainExecutor from '@/components/cross-chain-executor';
import { BaseTransaction } from '@/types/transaction';
import { Item, searchItemByUrl } from '@/database/dapps-repository';
import { useTransactionStatus } from '@/hooks/useTransactionStatus';
import { TransactionStatusDialog } from '@/components/TransactionStatusDialog';
import useChainStore from '@/store/chain';
import { useShallow } from 'zustand/react/shallow';
import SelectChainDialog from '@/components/SelectChainDialog';

const Page = () => {
  const params = useSearchParams();
  const appUrl = params.get('appUrl') as string | undefined;
  const safeInfo = useGetSafeInfo();
  const [transactionOpen, setTransactionOpen] = useState(false);
  const [dappItem, setDappItem] = useState<Item | undefined>();
  const [transactionInfo, setTransactionInfo] = useState<BaseTransaction | undefined>();
  const { chainId, address, isConnected } = useAccount();
  const [remoteChainAlertOpen, setRemoteChainAlertOpen] = useState(false);

  const { remoteChain } = useChainStore(
    useShallow((state) => ({
      remoteChain: state.remoteChain
    }))
  );

  const chain = getChainById(chainId as number);
  const { iframeRef, appIsLoading, isLoadingSlow, setAppIsLoading } = useAppIsLoading();
  const [currentRequestId, setCurrentRequestId] = useState<RequestId | undefined>();

  const [transactionResponse, setTransactionResponse] = useState<string>('pending');

  const { signMessageAsync } = useSignMessage();

  const { signTypedDataAsync } = useSignTypedData();

  const { data: hash, sendTransactionAsync, isPending } = useSendTransaction();

  const { isLoading: isClaimTransactionConfirming, data } = useTransactionStatus({
    customToast: true,
    hash,
    onSuccess: () => {
      setTransactionResponse('success');
    },
    onError: () => {
      setTransactionResponse('failure');
    }
  });

  const communicator = useAppCommunicator(iframeRef, chain, {
    onConfirmTransactions: (
      txs: BaseTransaction[],
      requestId: RequestId,
      params?: SendTransactionRequestParams
    ) => {
      setCurrentRequestId(requestId);
      setTransactionInfo(txs?.[0]);
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
    onGetTxBySafeTxHash: (safeTxHash: string) => {
      return safeTxHash;
    }
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
    if (iframeRef?.current?.contentWindow) {
      iframeRef.current.contentWindow.location.href = appUrl as string;
    }
  }, [chainId, address, isConnected, iframeRef, appUrl, setAppIsLoading]);

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
        <SafeAppIframe appUrl={appUrl as string} iframeRef={iframeRef} onLoad={onIframeLoad} />
      </div>
      <SelectChainDialog open={remoteChainAlertOpen} onOpenChange={setRemoteChainAlertOpen} />
      <CrossChainExecutor
        open={transactionOpen}
        onOpenChange={handleOpenChange}
        requestId={currentRequestId}
        transactionInfo={transactionInfo}
        dappItem={dappItem}
        confirmLoading={isPending || isClaimTransactionConfirming}
        onSubmit={() => {
          if (!remoteChain) {
            setRemoteChainAlertOpen(true);
            return;
          }
          sendTransactionAsync(transactionInfo as BaseTransaction)?.then((hash) => {
            communicator?.send({ safeTxHash: hash }, currentRequestId as string);
            setTransactionOpen(false);
            setCurrentRequestId(undefined);
          });
        }}
      />
      <TransactionStatusDialog
        open={transactionResponse !== 'pending'}
        onOpenChange={(open) => {
          if (!open) {
            setTransactionResponse('pending');
          }
        }}
        transactionStatus={transactionResponse as any}
        data={data}
      />
    </>
  );
};

export default Page;
