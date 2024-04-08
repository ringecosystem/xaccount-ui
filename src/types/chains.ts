import type { Chain } from '@rainbow-me/rainbowkit';
/**
 * Chain types.
 */
export enum ChainId {
  ETHEREUM = 1,
  ETHEREUM_SEPOLIA = 11155111,
  ARBITRUM = 42161,
  ARBITRUM_SEPOLIA = 421614,
  DARWINIA = 46,
  CRAB = 44,
  PANGOLIN = 43,
  POLYGON = 137,
  BLAST = 81457
}

/**
 * Chain config.
 */
export interface ChainConfig extends Chain {
  id: number;
  shortName?: string;
  infuraUrl?: string;
}
