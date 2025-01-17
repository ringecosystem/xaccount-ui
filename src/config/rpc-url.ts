import { sepolia, arbitrumSepolia } from 'wagmi/chains';
import { ChainId } from '@/types/chains';

const infuraToken = process.env.NEXT_PUBLIC_INFURA_TOKEN;

const rpcUrlsMap: Record<
  string,
  {
    infura?: string;
    default?: string;
  }
> = {
  [ChainId.ETHEREUM_SEPOLIA]: {
    infura: 'https://sepolia.infura.io/v3/',
    default: sepolia?.rpcUrls?.default?.http[0]
  },

  [ChainId.ARBITRUM_SEPOLIA]: {
    infura: 'https://arbitrum-sepolia.infura.io/v3/',
    default: arbitrumSepolia?.rpcUrls?.default?.http[0]
  }
};

export const getRpcUrl = (chainId: ChainId): string => {
  const rpcUrls = rpcUrlsMap[chainId];
  if (infuraToken && rpcUrls.infura) {
    return rpcUrls.infura + infuraToken;
  }
  return rpcUrls.default ?? '';
};
