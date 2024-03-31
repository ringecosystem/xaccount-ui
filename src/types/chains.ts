import type { Chain } from '@rainbow-me/rainbowkit';
import { ethereum, arbitrum } from '@/config/chains';
/**
 * Chain types.
 */
export enum ChainId {
  ETHEREUM = ethereum.id,
  ARBITRUM = arbitrum.id
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
