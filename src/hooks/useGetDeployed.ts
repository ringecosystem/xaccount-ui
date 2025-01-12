import { useReadContract } from 'wagmi';
import { address, abi } from '@/config/abi/XAccountUIFactory';

export function useGetDeployed({
  fromChainId,
  targetChainId,
  owner
}: {
  fromChainId: bigint;
  targetChainId: number;
  owner: `0x${string}`;
}) {
  const result = useReadContract({
    address: address,
    abi: abi,
    chainId: targetChainId,
    functionName: 'getDeployed',
    args: [fromChainId, owner],
    query: { enabled: !!fromChainId && !!owner }
  });

  return result;
}
