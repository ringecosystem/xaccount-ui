'use client';
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AddressContextProps {
  safeAddress?: `0x${string}`;
  setSafeAddress: (address: `0x${string}` | undefined) => void;
}

const AddressContext = createContext<AddressContextProps | undefined>(undefined);

export const SafeAddressProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [safeAddress, setSafeAddress] = useState<`0x${string}` | undefined>(undefined);

  return (
    <AddressContext.Provider value={{ safeAddress, setSafeAddress }}>
      {children}
    </AddressContext.Provider>
  );
};

export const useSafeAddress = (): AddressContextProps => {
  const context = useContext(AddressContext);
  if (!context) {
    throw new Error('useSafeAddress must be used within a SafeAddressProvider');
  }
  return context;
};
