import { useWaitForTransactionReceipt, useWriteContract } from 'wagmi';
import { address, abi } from '@/config/abi/XAccountUIFactory';
import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { getChainById } from '@/utils';
import { JsonRpcProvider } from 'ethers';
import { TransactionStatus } from '@/components/transaction-status';
import { useSafeAddress } from '@/providers/address-provider';

async function checkRemoteAddress(
  xAccount: readonly [`0x${string}`, `0x${string}`] | undefined,
  provider: JsonRpcProvider | undefined
) {
  if (!xAccount || !provider) {
    return;
  }

  try {
    const [safeAddress] = xAccount;

    const code = await provider.getCode(safeAddress);
    const exists = code !== '0x';
    return exists;
  } catch (error) {
    console.error('Failed to check remote address:', error);
  }
}

export function useCreateXAccount(
  targetChainId: number,
  xAccount: readonly [`0x${string}`, `0x${string}`] | undefined,
  provider: JsonRpcProvider | undefined
) {
  const { writeContractAsync, isPending, data: hash } = useWriteContract();
  const { setSafeAddress } = useSafeAddress();
  const [isGetCodeLoading, setIsGetCodeLoading] = useState(false);
  const toastIdRef = useRef<string | number>(0);
  const chain = getChainById(targetChainId);
  const {
    isLoading: isTransactionReceiptLoading,
    error,
    isSuccess: isTransactionReceiptSuccess,
    isError: isTransactionReceiptError
  } = useWaitForTransactionReceipt({
    hash: hash as `0x${string}`
  });

  const handleCreateXAccount = useCallback(
    async (
      fromChainId: bigint,
      owner: `0x${string}`,
      port: `0x${string}`,
      recovery: `0x${string}`
    ) => {
      try {
        const result = await writeContractAsync({
          address,
          abi,
          chainId: targetChainId,
          functionName: 'create',
          args: [fromChainId, owner, port, recovery]
        });
        toastIdRef.current = toast.loading(
          <TransactionStatus
            message="Creating XAccount"
            transactionHash={result}
            chainName={chain?.name}
            explorerUrl={chain?.blockExplorers?.default?.url}
          />
        );
        return result;
      } catch (err) {
        console.error('Failed to create XAccount:', err);
        throw err;
      }
    },
    [targetChainId, writeContractAsync, chain?.name, chain?.blockExplorers?.default?.url]
  );

  useEffect(() => {
    const checkAddress = async () => {
      if (isTransactionReceiptSuccess) {
        setIsGetCodeLoading(true);
        const exists = await checkRemoteAddress(xAccount, provider);
        if (exists) {
          setSafeAddress(xAccount?.[0]);
        }
        if (toastIdRef.current && toast.isActive(toastIdRef.current)) {
          toast.update(toastIdRef.current, {
            render: (
              <TransactionStatus
                message="Successfully created XAccount"
                transactionHash={hash as `0x${string}`}
                chainName={chain?.name}
                explorerUrl={chain?.blockExplorers?.default?.url}
              />
            ),
            type: 'success',
            isLoading: false,
            autoClose: 10000,
            closeButton: true,
            progress: undefined
          });
        } else {
          toast.success(
            <TransactionStatus
              message="Successfully created XAccount"
              transactionHash={hash as `0x${string}`}
              chainName={chain?.name}
              explorerUrl={chain?.blockExplorers?.default?.url}
            />,
            {
              closeButton: true,
              autoClose: 10000
            }
          );
        }
        setIsGetCodeLoading(false);
      } else if (isTransactionReceiptError) {
        toast.error(error?.message || 'Failed to create XAccount');
      }
    };

    checkAddress();
  }, [
    isTransactionReceiptSuccess,
    isTransactionReceiptError,
    chain,
    hash,
    error,
    xAccount,
    provider,
    setSafeAddress
  ]);

  return {
    createXAccount: handleCreateXAccount,
    isPending,
    isTransactionReceiptLoading: isTransactionReceiptLoading || isGetCodeLoading,
    hash
  };
}
