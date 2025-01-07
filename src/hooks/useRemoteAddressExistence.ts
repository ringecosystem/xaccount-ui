import { useEffect, useState } from 'react';
import { JsonRpcProvider } from 'ethers';
import { useAccount } from 'wagmi';
import { useSafeAddress } from '@/providers/address-provider';

interface UseRemoteAddressExistenceProps {
  xAccount: readonly [`0x${string}`, `0x${string}`] | undefined;
  provider: JsonRpcProvider | undefined;
}

interface UseRemoteAddressExistenceReturn {
  isLoading: boolean;
}

export function useRemoteAddressExistence({
  xAccount,
  provider
}: UseRemoteAddressExistenceProps): UseRemoteAddressExistenceReturn {
  const { address } = useAccount();
  const { setSafeAddress } = useSafeAddress();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function checkAddress() {
      if (!xAccount || !provider) {
        setIsLoading(false);
        setSafeAddress(undefined);
        return;
      }
      setIsLoading(true);

      try {
        const [newSafeAddress] = xAccount;
        const code = await provider.getCode(newSafeAddress);
        const exists = code !== '0x';

        setIsLoading(false);
        setSafeAddress(exists ? newSafeAddress : undefined);
      } catch (error) {
        console.error('Failed to check remote address:', error);
        setIsLoading(false);
        setSafeAddress(undefined);
      }
    }

    checkAddress();
    return () => {
      setIsLoading(false);
      setSafeAddress(undefined);
    };
  }, [address, xAccount, provider, setSafeAddress]);

  return { isLoading };
}
