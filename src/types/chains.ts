import type { Chain } from '@rainbow-me/rainbowkit';
/**
 * Chain types.
 */
export enum ChainId {
  CRAB = 44,
  DARWINIA = 46,
  PANGOLIN = 43
}

interface NativeToken {
  symbol: string;
  decimals: number;
  logoPath: string;
}

interface KtonToken extends NativeToken {
  address: `0x${string}`;
}

/**
 * Chain config.
 */
export interface ChainConfig extends Chain {
  id: ChainId;
  nativeToken: NativeToken;
  ktonToken: KtonToken;
  stakingContractAddress: `0x${string}`;
}
