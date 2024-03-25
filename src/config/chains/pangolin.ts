import { ChainId, ChainConfig } from '@/types/chains';

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
  iconUrl: '/images/chains/pangolin.png',
  /**
   * Token info
   */
  nativeToken: {
    symbol: 'PRING',
    decimals: 18,
    logoPath: '/images/token/pring.png'
  },
  ktonToken: {
    address: '0x0000000000000000000000000000000000000402',
    symbol: 'PKTON',
    decimals: 18,
    logoPath: '/images/token/pkton.svg'
  },
  /**
   * stakingContract
   */
  stakingContractAddress: '0x000000000419683a1a03abc21fc9da25fd2b4dd7'
} as const satisfies ChainConfig;
