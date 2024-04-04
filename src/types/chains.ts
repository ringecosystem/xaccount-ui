import type { Chain } from '@rainbow-me/rainbowkit';
import { ethereum, arbitrum } from '@/config/chains';
/**
 * Chain types.
 */
export enum ChainId {
  ETHEREUM = ethereum.id,
  ETHEREUM_SEPOLIA = 11155111,
  ARBITRUM = arbitrum.id,
  ARBITRUM_SEPOLIA = 421614,
  DARWINIA = 46,
  CRAB = 44,
  PANGOLIN = 43,
  POLYGON = 137,
  BLAST = 81457
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
