import { ChainId } from '@/types/chains';
import type { ChainConfig } from '@/types/chains';
import { getRpcUrl } from '../rpc-url';

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
      http: [getRpcUrl(ChainId.BLAST)]
    }
  },
  blockExplorers: {
    default: {
      name: 'Blastscan',
      url: 'https://blastscan.io/'
    }
  },

  iconUrl: '/images/chains/blast.svg',
  shortName: 'blastmainnet'
} as const satisfies ChainConfig;
