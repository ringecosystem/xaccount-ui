export const address = '0x52CC674e99387B8E0D2525F8a93198726063051E' as `0x${string}`;
export const abi = [
  {
    inputs: [{ internalType: 'address', name: 'safeMsgportModule', type: 'address' }],
    stateMutability: 'nonpayable',
    type: 'constructor'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: 'address', name: 'deployer', type: 'address' },
      { indexed: false, internalType: 'bytes32', name: 'salt', type: 'bytes32' },
      { indexed: false, internalType: 'uint256', name: 'fromChainId', type: 'uint256' },
      { indexed: false, internalType: 'address', name: 'owner', type: 'address' },
      { indexed: false, internalType: 'address', name: 'xAccount', type: 'address' },
      { indexed: false, internalType: 'address', name: 'module', type: 'address' },
      { indexed: false, internalType: 'address', name: 'port', type: 'address' },
      { indexed: false, internalType: 'address', name: 'recovery', type: 'address' }
    ],
    name: 'XAccountCreated',
    type: 'event'
  },
  {
    inputs: [],
    name: 'SAFE_MSGPORT_MODULE',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'bytes32', name: 'salt', type: 'bytes32' },
      { internalType: 'uint256', name: 'fromChainId', type: 'uint256' },
      { internalType: 'address', name: 'owner', type: 'address' },
      { internalType: 'address', name: 'port', type: 'address' },
      { internalType: 'address', name: 'recovery', type: 'address' }
    ],
    name: 'create',
    outputs: [
      { internalType: 'address', name: '', type: 'address' },
      { internalType: 'address', name: '', type: 'address' }
    ],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'safeFactory',
    outputs: [{ internalType: 'contract ISafeProxyFactory', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'safeFallbackHandler',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'safeSingletonL2',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'address', name: 'module', type: 'address' },
      { internalType: 'address', name: 'recovery', type: 'address' }
    ],
    name: 'setupModules',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'address', name: 'deployer', type: 'address' },
      { internalType: 'bytes32', name: 'salt', type: 'bytes32' },
      { internalType: 'uint256', name: 'fromChainId', type: 'uint256' },
      { internalType: 'address', name: 'owner', type: 'address' }
    ],
    name: 'xAccountOf',
    outputs: [
      { internalType: 'address', name: '', type: 'address' },
      { internalType: 'address', name: '', type: 'address' }
    ],
    stateMutability: 'view',
    type: 'function'
  }
] as const;
