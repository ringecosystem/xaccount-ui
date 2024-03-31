import type { Chain } from '@rainbow-me/rainbowkit';

import { ethereum, arbitrum } from '@/config/chains';
import { ChainId } from '@/types/chains';

// Map object to return a specific chain configuration
// Using Record<ChainId, ChainConfig> to ensure type safety
const chainConfigMap: Record<number, Chain> = {
  [ethereum.id]: ethereum,
  [arbitrum.id]: arbitrum
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
  const chainConfigs = filterTestnetsInProduction(chainConfigMap);
  if (chainConfigs.length === 0) {
    throw new Error('No chain configurations are available.');
  }
  return [chainConfigs[0], ...chainConfigs.slice(1)] as [Chain, ...Chain[]];
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
