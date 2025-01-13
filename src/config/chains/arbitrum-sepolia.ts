import { arbitrumSepolia as arbitrumSepoliaBase } from 'wagmi/chains';

import { type ChainConfig } from '@/types/chains';

export const arbitrumSepolia: ChainConfig = {
  ...arbitrumSepoliaBase,
  blockExplorers: {
    default: {
      name: 'Arbitrum Sepolia Testnet Explorer',
      url: 'https://sepolia.arbiscan.io/'
    }
  },
  iconUrl: '/images/chains/arbitrum.svg',
  shortName: 'arb-sep'
} as const satisfies ChainConfig;
