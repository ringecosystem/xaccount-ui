import { useEffect, useState } from 'react';
import { Config, readContract } from '@wagmi/core';

import { abi as safeMsgportModuleAbi } from '@/config/abi/SafeMsgportModule';
import { abi as MultiPortAbi } from '@/config/abi/MultiPort';
import { config } from '@/config/wagmi';

interface UsePortAddressProps {
  sourceChainId?: number;
  targetChainId?: number;
  moduleAddress?: `0x${string}`;
}

const usePortAddress = ({ moduleAddress, sourceChainId, targetChainId }: UsePortAddressProps) => {
  const [srcPortAddress, setSrcPortAddress] = useState<`0x${string}`>('0x');

  useEffect(() => {
    const fetchPortAddress = async () => {
      if (!moduleAddress || !targetChainId || !sourceChainId) {
        return;
      }
      const portResult = await readContract(config as unknown as Config, {
        abi: safeMsgportModuleAbi,
        address: moduleAddress,
        chainId: targetChainId,
        functionName: 'port'
      });
      const portLookupResult = await readContract(config as unknown as Config, {
        abi: MultiPortAbi,
        address: portResult,
        chainId: targetChainId,
        functionName: 'peerOf',
        args: [BigInt(sourceChainId)]
      });
      setSrcPortAddress(portLookupResult);
    };

    fetchPortAddress();
  }, [moduleAddress, sourceChainId, targetChainId]);

  return srcPortAddress;
};

export default usePortAddress;
