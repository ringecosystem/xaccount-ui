import { RemoteChain } from './../store/chain';
import { useMemo } from 'react';
import useChainStore from '@/store/chain';

export type SafeInfo = {
  safeAddress?: `0x${string}`;
  chainId?: number;
  owners: string[];
  threshold: number;
  isReadOnly: boolean;
  network?: number;
};

const useGetSafeInfo = () => {
  const remoteChain = useChainStore((state) => state.remoteChain);

  return useMemo<SafeInfo>(
    () => ({
      safeAddress: remoteChain?.safeAddress,
      chainId: remoteChain?.id,
      owners: [],
      threshold: 1,
      isReadOnly: false,
      network: remoteChain?.id
    }),
    [remoteChain?.safeAddress, remoteChain?.id]
  );
};

export default useGetSafeInfo;
