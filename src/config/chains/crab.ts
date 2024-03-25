import { ChainId, ChainConfig } from '@/types/chains';

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

  /**
   * Token info
   */
  nativeToken: {
    symbol: 'CRAB',
    decimals: 18,
    logoPath: '/images/token/crab.svg'
  },
  ktonToken: {
    address: '0x0000000000000000000000000000000000000402',
    symbol: 'CKTON',
    decimals: 18,
    logoPath: '/images/token/ckton.svg'
  },
  stakingContractAddress: '0x000000000419683a1a03abc21fc9da25fd2b4dd7'
} as const satisfies ChainConfig;
