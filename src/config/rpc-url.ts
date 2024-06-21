import { mainnet, sepolia, arbitrum, arbitrumSepolia, polygon } from 'wagmi/chains';

import { ChainId } from '@/types/chains';
const infuraToken = process.env.NEXT_PUBLIC_INFURA_TOKEN;

const rpcUrlsMap: Record<string, any> = {
  [ChainId.ETHEREUM]: {
    infura: 'https://mainnet.infura.io/v3/',
    default: mainnet?.rpcUrls?.default?.http[0]
  },
  [ChainId.ETHEREUM_SEPOLIA]: {
    infura: 'https://sepolia.infura.io/v3/',
    default: sepolia?.rpcUrls?.default?.http[0]
  },
  [ChainId.ARBITRUM]: {
    infura: 'https://arbitrum-mainnet.infura.io/v3/',
    default: arbitrum?.rpcUrls?.default?.http[0]
  },
  [ChainId.ARBITRUM_SEPOLIA]: {
    infura: 'https://arbitrum-sepolia.infura.io/v3/',
    default: arbitrumSepolia?.rpcUrls?.default?.http[0]
  },
  [ChainId.DARWINIA]: {
    default: 'https://rpc.darwinia.network'
  },
  [ChainId.CRAB]: {
    default: 'https://crab-rpc.darwinia.network'
  },
  [ChainId.POLYGON]: {
    infura: 'https://polygon-mainnet.infura.io/v3/',
    default: polygon?.rpcUrls?.default?.http[0]
  },
  [ChainId.BLAST]: {
    infura: 'https://blast-mainnet.infura.io/v3/',
    default: 'https://rpc.blast.io'
  }
};

export const getRpcUrl = (chainId: number) => {
  const rpcUrls = rpcUrlsMap[chainId];
  if (infuraToken && rpcUrls.infura) {
    return rpcUrls.infura + infuraToken;
  }
  return rpcUrls.default;
};
