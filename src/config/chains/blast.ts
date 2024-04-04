import { ChainId } from '@/types/chains';
import type { Chain } from '@rainbow-me/rainbowkit';

export const blast: Chain = {
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

  /**
   * rainbowkit iconUrl
   */
  iconUrl: '/images/chains/blast.svg'
} as const satisfies Chain;
