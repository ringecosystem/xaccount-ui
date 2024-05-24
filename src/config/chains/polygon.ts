import { polygon as polygonBase } from 'wagmi/chains';

import { ChainId, type ChainConfig } from '@/types/chains';

import { getRpcUrl } from '../rpc-url';

export const polygon: ChainConfig = {
  ...polygonBase,
  iconUrl: '/images/chains/polygon.svg',
  shortName: 'matic',
  rpcUrls: {
    default: {
      http: [getRpcUrl(ChainId.POLYGON)]
    }
  }
} as const satisfies ChainConfig;
