import type { Chain } from '@rainbow-me/rainbowkit';

import {
  ethereum,
  arbitrum,
  darwinia,
  crab,
  pangolin,
  polygon,
  blast,
  ethereumSepolia,
  arbitrumSepolia
} from '@/config/chains';

import * as chains from '@/config/chains';
import { ChainId } from '@/types/chains';

// Map object to return a specific chain configuration
// Using Record<ChainId, ChainConfig> to ensure type safety

const chainConfigMap: Record<number, Chain> = {
  [ChainId.ETHEREUM]: ethereum,
  [ChainId.ARBITRUM]: arbitrum,
  [ChainId.DARWINIA]: darwinia,
  [ChainId.CRAB]: crab,
  [ChainId.PANGOLIN]: pangolin,
  [ChainId.POLYGON]: polygon,
  [ChainId.BLAST]: blast,
  [ChainId.ETHEREUM_SEPOLIA]: ethereumSepolia,
  [ChainId.ARBITRUM_SEPOLIA]: arbitrumSepolia
};

// Helper function to filter testnets in production
function filterTestnetsInProduction(chains: Record<ChainId, Chain>): Chain[] {
  const chainConfigs = Object.values(chainConfigMap).sort((a, b) => {
    return b.id - a.id;
  });
  // if (process.env.NODE_ENV === 'production') {
  //   return chainConfigs.filter((chain) => !chain.testnet);
  // }
  return chainConfigs;
}

// Returns an array of all chain configurations, filtering out testnets in production
export function getChains(): [Chain, ...Chain[]] {
  const filteredChains: Chain[] = Object.values(chains).filter((chain): chain is Chain => {
    return 'id' in chain && 'name' in chain;
  });

  if (filteredChains.length === 0) {
    throw new Error('No chain configurations are available.');
  }

  return filteredChains as [Chain, ...Chain[]];
}

// Returns the chain by its id
export function getChainById(id: ChainId): Chain | undefined {
  const chainConfig = chainConfigMap[id];
  return chainConfig;
}

// Returns the default chain configuration
export function getDefaultChain(): Chain {
  return chainConfigMap[ChainId.ETHEREUM];
}

// Returns the default chain id
export function getDefaultChainId(): ChainId {
  return getDefaultChain().id;
}
