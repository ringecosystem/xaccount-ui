// ethereum-sepolia

import { arbitrumSepolia as arbitrumSepoliaBase } from 'wagmi/chains';

import { ChainId, type ChainConfig } from '@/types/chains';

import { getRpcUrl } from '../rpc-url';

export const arbitrumSepolia: ChainConfig = {
  ...arbitrumSepoliaBase,
  iconUrl: '/images/chains/arbitrum.svg',
  shortName: 'arb-sep',
  blockExplorers: {
    default: {
      name: 'Arbitrum Sepolia Testnet Explorer',
      url: 'https://sepolia.arbiscan.io/'
    }
  },
  rpcUrls: {
    default: {
      http: [getRpcUrl(ChainId.ARBITRUM_SEPOLIA)]
    }
  }
} as const satisfies ChainConfig;
