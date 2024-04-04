import { ChainId } from '@/types/chains';
import type { Chain } from '@rainbow-me/rainbowkit';

export const pangolin: Chain = {
  /**
   * Chain
   */
  id: ChainId.PANGOLIN,
  name: 'Pangolin',
  nativeCurrency: {
    name: 'PRING',
    symbol: 'PRING',
    decimals: 18
  },
  rpcUrls: {
    default: {
      http: ['https://pangolin-rpc.darwinia.network'],
      webSocket: ['wss://pangolin-rpc.darwinia.network']
    },
    public: {
      http: ['https://pangolin-rpc.darwinia.network'],
      webSocket: ['wss://pangolin-rpc.darwinia.network']
    }
  },
  blockExplorers: {
    default: {
      name: 'Subscan',
      url: 'https://pangolin.subscan.io/'
    }
  },
  testnet: true,
  /**
   * rainbowkit iconUrl
   */
  iconUrl: '/images/chains/pangolin.png'
} as const satisfies Chain;
