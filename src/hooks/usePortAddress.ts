import { useEffect, useState } from 'react';
import { Config, readContract } from '@wagmi/core';

import { abi as safeMsgportModuleAbi } from '@/config/abi/SafeMsgportModule';
import { abi as MultiPortAbi } from '@/config/abi/MultiPort';
import { config } from '@/config/wagmi';

interface UsePortAddressProps {
  fromChainId?: number;
  toChainId?: number;
  toModuleAddress?: `0x${string}`;
}

const usePortAddress = ({ toModuleAddress, toChainId, fromChainId }: UsePortAddressProps) => {
  const [srcPortAddress, setSrcPortAddress] = useState<`0x${string}`>('0x');

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
        abi: MultiPortAbi,
        address: portResult,
        chainId: toChainId,
        functionName: 'peerOf',
        args: [BigInt(fromChainId)]
      });

      setSrcPortAddress(portLookupResult);
    };

    fetchPortAddress();
  }, [toChainId, toModuleAddress, fromChainId]);

  return srcPortAddress;
};

export default usePortAddress;
