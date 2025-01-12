import type { Chain } from '@rainbow-me/rainbowkit';
/**
 * Chain types.
 */
export enum ChainId {
  ETHEREUM_SEPOLIA = 11155111,
  ARBITRUM_SEPOLIA = 421614
}

/**
 * Chain config.
 */
export interface ChainConfig extends Chain {
  id: number;
  shortName?: string;
  infuraUrl?: string;
}
