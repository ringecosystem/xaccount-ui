import { ChainId } from '@/types/chains';
import type { ChainConfig } from '@/types/chains';

export const blast: ChainConfig = {
  id: ChainId.BLAST,
  name: 'Blast',
  nativeCurrency: {
    name: 'ETH',
    symbol: 'ETH',
    decimals: 18
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.blast.io'],
      webSocket: ['wss://rpc.blast.io']
    },
    public: {
      http: ['https://rpc.blast.io'],
      webSocket: ['wss://rpc.blast.io']
    }
  },
  blockExplorers: {
    default: {
      name: 'Blastscan',
      url: 'https://blastscan.io/'
    }
  },

  iconUrl: '/images/chains/blast.svg',
  shortName: 'blastmainnet',
  infuraUrl: 'https://blast-mainnet.infura.io/v3/'
} as const satisfies ChainConfig;
