import { useReadContract } from 'wagmi';
import { address, abi } from '@/config/abi/XAccountUIFactory';

export function useXAccountOf({
  deployer,
  sourceChainId,
  targetChainId,
  owner
}: {
  deployer: `0x${string}`;
  sourceChainId: bigint;
  targetChainId: number;
  owner: `0x${string}`;
}) {
  const result = useReadContract({
    address,
    abi,
    functionName: 'xAccountOf',
    chainId: targetChainId,
    args: [deployer, sourceChainId, owner],
    query: { enabled: !!deployer && !!sourceChainId && !!owner && !!targetChainId }
  });
  return result;
}
