import { ChainId } from '@/types/chains';
import type { ChainConfig } from '@/types/chains';
import { getRpcUrl } from '../rpc-url';

export const pangolin: ChainConfig = {
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
      http: [getRpcUrl(ChainId.PANGOLIN)]
    }
  },
  blockExplorers: {
    default: {
      name: 'Subscan',
      url: 'https://pangolin.subscan.io'
    }
  },
  testnet: true,
  /**
   * rainbowkit iconUrl
   */
  iconUrl: '/images/chains/pangolin.png',
  shortName: 'pangolin'
} as const satisfies ChainConfig;
