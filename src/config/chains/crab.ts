import { ChainId } from '@/types/chains';
import type { ChainConfig } from '@/types/chains';

export const crab: ChainConfig = {
  id: ChainId.CRAB,
  name: 'Crab',
  nativeCurrency: { name: 'CRAB', symbol: 'CRAB', decimals: 18 },
  rpcUrls: {
    default: {
      http: ['https://crab-rpc.darwinia.network'],
      webSocket: ['wss://crab-rpc.darwinia.network']
    },
    public: {
      http: ['https://crab-rpc.darwinia.network'],
      webSocket: ['wss://crab-rpc.darwinia.network']
    }
  },
  blockExplorers: {
    default: {
      name: 'Subscan',
      url: 'https://crab.subscan.io/'
    }
  },
  contracts: {
    multicall3: {
      address: '0xcA11bde05977b3631167028862bE2a173976CA11',
      blockCreated: 599936
    }
  },
  /**
   * rainbowkit iconUrl
   */
  iconUrl: '/images/chains/crab.svg',
  shortName: 'crab'
} as const satisfies ChainConfig;
