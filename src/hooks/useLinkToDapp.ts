import { Item } from '@/database/dapps-repository';
import useChainStore from '@/store/chain';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

const useNavigateToDapp = () => {
  const remoteChain = useChainStore((state) => state.remoteChain);
  const router = useRouter();

  const handleNavigateToDapp = useCallback(
    (item: Item) => {
      return new Promise<void>((resolve, reject) => {
        if (!remoteChain?.id) {
          return reject();
        }
        const decodedAppUrl = encodeURIComponent(item.url);
        router.push(`/dapp?appUrl=${decodedAppUrl}`);
        resolve();
      });
    },
    [remoteChain, router]
  );

  return handleNavigateToDapp;
};

export default useNavigateToDapp;
