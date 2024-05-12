import { mainnet } from 'wagmi/chains';

import { ChainId, type ChainConfig } from '@/types/chains';

import { getRpcUrl } from '../rpc-url';

export const ethereum: ChainConfig = {
  ...mainnet,
  iconUrl: '/images/chains/ethereum.svg',
  shortName: 'eth',
  rpcUrls: {
    default: {
      http: [getRpcUrl(ChainId.ETHEREUM)]
    }
  }
} as const satisfies ChainConfig;
