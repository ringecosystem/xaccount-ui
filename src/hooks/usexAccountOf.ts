import { useReadContract } from 'wagmi';
import { address, abi } from '@/config/abi/XAccountUIFactory';

export function useXAccountOf({
  deployer,
  sourceChainId,
  owner,
  enabled
}: {
  deployer: `0x${string}`;
  sourceChainId: bigint;
  owner: `0x${string}`;
  enabled: boolean;
}) {
  const result = useReadContract({
    address,
    abi,
    functionName: 'xAccountOf',
    args: [deployer, sourceChainId, owner],
    query: { enabled }
  });
  return result;
}
