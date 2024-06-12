import {
  ethereum,
  arbitrum,
  darwinia,
  crab,
  // pangolin,
  polygon,
  blast,
  ethereumSepolia,
  arbitrumSepolia
} from '@/config/chains';
import * as chains from '@/config/chains';
import { ChainConfig, ChainId } from '@/types/chains';

import type { Chain } from '@rainbow-me/rainbowkit';

export enum DEPLOYMENT_MODE {
  MAINNET = 'mainnet',
  TESTNET = 'testnet'
}

const chainDeployMode = (process.env.NEXT_PUBLIC_DEPLOYMENT_MODE || 'testnet') as DEPLOYMENT_MODE;

const defaultChainForMode: Record<DEPLOYMENT_MODE, ChainId> = {
  [DEPLOYMENT_MODE.MAINNET]: ChainId.ETHEREUM,
  [DEPLOYMENT_MODE.TESTNET]: ChainId.ETHEREUM_SEPOLIA
};

const chainConfigMap: Record<number, Chain> = {
  [ChainId.ETHEREUM]: ethereum,
  [ChainId.ARBITRUM]: arbitrum,
  [ChainId.DARWINIA]: darwinia,
  [ChainId.CRAB]: crab,
  // [ChainId.PANGOLIN]: pangolin,
  [ChainId.POLYGON]: polygon,
  [ChainId.BLAST]: blast,
  [ChainId.ETHEREUM_SEPOLIA]: ethereumSepolia,
  [ChainId.ARBITRUM_SEPOLIA]: arbitrumSepolia
};

// Helper function to filter chains based on deployment mode
function filterChainsByDeploymentMode(chains: Record<ChainId, Chain>): Chain[] {
  return Object.values(chains).filter((chain) =>
    chainDeployMode === 'mainnet' ? !chain.testnet : chain.testnet
  );
}

// Returns an array of all chain configurations, filtering based on deployment mode
export function getChains(): [ChainConfig, ...ChainConfig[]] {
  const filteredChains: Chain[] = filterChainsByDeploymentMode(chainConfigMap);
  if (filteredChains.length === 0) {
    throw new Error('No suitable chain configurations are available.');
  }
  return filteredChains as [Chain, ...Chain[]];
}

// Returns the chain by its id
export function getChainById(id?: ChainId): Chain | undefined {
  return id ? chainConfigMap[id] : undefined;
}

// Returns the default chain configuration based on deployment mode
export function getDefaultChain(): Chain {
  const filteredChains = filterChainsByDeploymentMode(chainConfigMap);
  if (filteredChains.length === 0) {
    throw new Error(
      'No suitable chain configurations are available for the current deployment mode.'
    );
  }

  const defaultChainId = defaultChainForMode[chainDeployMode];
  const defaultChain = filteredChains.find((chain) => chain.id === defaultChainId);

  return defaultChain || filteredChains[0];
}

// Returns the default chain id based on the default chain
export function getDefaultChainId(): ChainId {
  const defaultChain = getDefaultChain();
  return defaultChain.id;
}
