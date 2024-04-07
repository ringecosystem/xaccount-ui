import { useMemo } from 'react';
import { useAccount } from 'wagmi';
import { getDefaultChainId } from '@/utils';

//  TODO now for simulate useSafeInfo

export type SafeInfo = {
  safeAddress?: `0x${string}`;
  chainId?: number;
  owners: string[];
  threshold: number;
  isReadOnly: boolean;
  network?: number;
};

const useGetSafeInfo = () => {
  const { address, chainId } = useAccount();

  return useMemo<SafeInfo>(
    () => ({
      safeAddress: address,
      chainId,
      owners: [],
      threshold: 1,
      isReadOnly: false,
      network: chainId
    }),
    [address, chainId]
  );
};

export default useGetSafeInfo;
