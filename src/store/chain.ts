import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { ChainConfig } from '@/types/chains';

export type RemoteChain = ChainConfig & {
  safeAddress: `0x${string}`;
  moduleAddress: `0x${string}`;
};

export type State = {
  remoteChain?: RemoteChain;
};

export type Action = {
  setRemoteChain: (chain: RemoteChain) => void;
  removeRemoteChain: () => void;
};

const useChainStore = create<State & Action>()(
  persist(
    (set) => ({
      remoteChain: undefined,
      setRemoteChain: (chain) => set({ remoteChain: chain }),
      removeRemoteChain: () => set({ remoteChain: undefined })
    }),
    {
      name: 'chain-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ remoteChain: state.remoteChain })
    }
  )
);

export default useChainStore;
