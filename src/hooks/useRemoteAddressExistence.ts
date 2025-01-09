import { useEffect, useState } from 'react';
import { JsonRpcProvider } from 'ethers';
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
  const { setSafeAddress } = useSafeAddress();
  const [isLoading, setIsLoading] = useState(false);
  const newSafeAddress = xAccount?.[0];

  useEffect(() => {
    async function checkAddress() {
      if (!newSafeAddress || !provider) {
        setIsLoading(false);
        setSafeAddress(undefined);
        return;
      }
      setIsLoading(true);

      try {
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
  }, [newSafeAddress, provider, setSafeAddress]);

  return { isLoading };
}
