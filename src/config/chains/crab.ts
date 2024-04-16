import { ChainId } from '@/types/chains';
import type { ChainConfig } from '@/types/chains';
import { getRpcUrl } from '../rpc-url';

export const crab: ChainConfig = {
  id: ChainId.CRAB,
  name: 'Crab',
  nativeCurrency: { name: 'CRAB', symbol: 'CRAB', decimals: 18 },
  rpcUrls: {
    default: {
      http: [getRpcUrl(ChainId.CRAB)]
    }
  },
  blockExplorers: {
    default: {
      name: 'Subscan',
      url: 'https://crab.subscan.io'
    }
  },
  contracts: {
    multicall3: {
      address: '0xcA11bde05977b3631167028862bE2a173976CA11',
      blockCreated: 599936
    }
  },

  iconUrl: '/images/chains/crab.svg',
  shortName: 'crab'
} as const satisfies ChainConfig;
