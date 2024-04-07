import { ChainConfig } from '@/types/chains';
import { FallbackProvider, JsonRpcProvider } from 'ethers';
import { useMemo } from 'react';
import type { Client, Transport } from 'viem';
import { type Config, useClient } from 'wagmi';

const infuraToken = process.env.NEXT_PUBLIC_INFURA_TOKEN;

export function clientToProvider(client: Client<Transport, ChainConfig>) {
  const { chain, transport } = client;
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address
  };
  if (transport.type === 'fallback') {
    const providers = (transport.transports as ReturnType<Transport>[]).map(
      ({ value }) => new JsonRpcProvider(value?.url, network)
    );
    if (providers.length === 1) return providers[0];
    return new FallbackProvider(providers);
  }

  if (infuraToken && chain?.infuraUrl) {
    return new JsonRpcProvider(`${chain.infuraUrl}${infuraToken}`, network);
  }
  return new JsonRpcProvider(transport.url, network);
}

/** Action to convert a viem Client to an ethers.js Provider. */
export function useEthersProvider({ chainId }: { chainId?: number } = {}) {
  const client = useClient<Config>({ chainId });
  return useMemo(() => client && clientToProvider(client), [client]);
}

// //   return new JsonRpcProvider(
//     'https://sepolia.infura.io/v3/4fbdb5a15cfc44598124d569bd31549d',
//     network
//   );
