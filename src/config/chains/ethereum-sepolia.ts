import { sepolia } from 'wagmi/chains';

import { ChainId, type ChainConfig } from '@/types/chains';

import { getRpcUrl } from '../rpc-url';

export const ethereumSepolia: ChainConfig = {
  ...sepolia,
  rpcUrls: {
    default: {
      http: [getRpcUrl(ChainId.ETHEREUM_SEPOLIA)]
    }
  },
  iconUrl: '/images/chains/ethereum.svg',
  shortName: 'sep'
} as const satisfies ChainConfig;
