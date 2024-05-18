import { Interface } from 'ethers';
import { useCallback, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useWriteContract } from 'wagmi';

import { abi as safeMsgportModuleAbi } from '@/config/abi/SafeMsgportModule';
import { abi as MultiPortAbi } from '@/config/abi/MultiPort';
import { getCrossChainFee } from '@/server/gaslimit';
import { BaseTransaction } from '@/types/transaction';
import { useTransactionStore } from '@/store/transaction';
import { TransactionStatus } from '@/config/transaction';

import usePortAddress from './usePortAddress';

const iface = new Interface(safeMsgportModuleAbi);
const functionFragment = iface.getFunction('xExecute');

interface UseExecuteProps {
  transactionInfo?: BaseTransaction;
  fromChainId?: number;
  toChainId?: number;
  fromAddress?: `0x${string}`;
  toModuleAddress?: `0x${string}`;
}
const useExecute = ({
  transactionInfo,
  fromChainId,
  toChainId,
  fromAddress,
  toModuleAddress
}: UseExecuteProps) => {
  const addTransaction = useTransactionStore((state) => state.addTransaction);
  const srcPortAddress = usePortAddress({ toModuleAddress, toChainId, fromChainId });

  const payload = useMemo<`0x${string}`>(() => {
    return functionFragment && transactionInfo?.to
      ? (iface.encodeFunctionData(functionFragment, [
          transactionInfo?.to,
          transactionInfo?.value,
          transactionInfo?.data,
          0
        ]) as `0x${string}`)
      : '0x';
  }, [transactionInfo]);

  const { queryKey, isEnabled } = useMemo(() => {
    const isValid =
      !!transactionInfo?.to &&
      !!fromChainId &&
      !!toChainId &&
      !!fromAddress &&
      !!toModuleAddress &&
      payload !== '0x';

    const key = [
      'xExecuteCrossChainFee',
      fromChainId,
      toChainId,
      fromAddress,
      toModuleAddress,
      payload
    ];

    return { queryKey: key, isEnabled: isValid };
  }, [transactionInfo, fromChainId, toChainId, fromAddress, toModuleAddress, payload]);

  const { data: crossChainFeeData, isLoading } = useQuery({
    queryKey,
    enabled: isEnabled,
    queryFn: () =>
      getCrossChainFee({
        fromChainId,
        toChainId,
        fromAddress,
        toAddress: toModuleAddress,
        payload,
        refundAddress: fromAddress
      })
  });

  const { data: hash, writeContractAsync, isPending } = useWriteContract();

  const execute = useCallback(() => {
    if (
      !crossChainFeeData?.data?.fee ||
      !srcPortAddress ||
      !toChainId ||
      !toModuleAddress ||
      !payload ||
      !crossChainFeeData?.data?.params
    ) {
      return;
    }
    return writeContractAsync({
      abi: MultiPortAbi,
      address: srcPortAddress,
      functionName: 'send',
      value: BigInt(crossChainFeeData?.data?.fee),
      args: [
        toChainId ? BigInt(toChainId) : 0n,
        toModuleAddress,
        payload,
        crossChainFeeData?.data?.params
      ]
    })?.then((hash) => {
      console.log('hash', hash);

      addTransaction({
        hash,
        chainId: fromChainId as number,
        targetChainId: toChainId,
        status: TransactionStatus.ProcessingOnLocal
      });

      return hash;
    });
  }, [
    writeContractAsync,
    srcPortAddress,
    crossChainFeeData,
    toChainId,
    toModuleAddress,
    payload,
    addTransaction,
    fromChainId
  ]);

  return {
    isLoading,
    isPending,
    execute,
    crossChainFeeData,
    hash
  };
};

export default useExecute;
