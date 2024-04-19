import { Interface } from 'ethers';

import { abi as safeMsgportModuleAbi } from '@/config/abi/SafeMsgportModule';
import { abi as MutisigModuleAbi } from '@/config/abi/MultiPort';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getCrossChainFee } from '@/server/gaslimit';
import { Config, readContract } from '@wagmi/core';
import { config } from '@/config/wagmi';
import { useWriteContract } from 'wagmi';
import { BaseTransaction } from '@/types/transaction';

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
  const [srcPortAddress, setSrcPortAddress] = useState<`0x${string}`>('0x');

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

  const { data: crossChainFeeData, isLoading } = useQuery({
    queryKey: ['xExecuteCrossChainFee'],
    enabled:
      !!transactionInfo?.to &&
      !!fromChainId &&
      !!toChainId &&
      !!fromAddress &&
      !!toModuleAddress &&
      payload !== '0x',
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

  useEffect(() => {
    const fetchPortAddress = async () => {
      if (!toModuleAddress || !toChainId || !fromChainId) {
        return;
      }
      const portResult = await readContract(config as unknown as Config, {
        abi: safeMsgportModuleAbi,
        address: toModuleAddress,
        chainId: toChainId,
        functionName: 'port'
      });

      const portLookupResult = await readContract(config as unknown as Config, {
        abi: MutisigModuleAbi,
        address: portResult,
        chainId: toChainId,
        functionName: 'fromPortLookup',
        args: [BigInt(fromChainId)]
      });

      setSrcPortAddress(portLookupResult);
    };

    fetchPortAddress();
  }, [toChainId, toModuleAddress, fromChainId]);

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
      abi: MutisigModuleAbi,
      address: srcPortAddress,
      functionName: 'send',
      value: BigInt(crossChainFeeData?.data?.fee),
      args: [
        toChainId ? BigInt(toChainId) : 0n,
        toModuleAddress,
        payload,
        crossChainFeeData?.data?.params as any
      ]
    });
  }, [writeContractAsync, srcPortAddress, crossChainFeeData, toChainId, toModuleAddress, payload]);

  return {
    isLoading,
    isPending,
    execute,
    hash
  };
};

export default useExecute;
