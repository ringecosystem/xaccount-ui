export const address = '0xC5687DcC8B3bB11067Ee3FC8C2a749ebDd95F8e6' as `0x${string}`;
export const abi = [
  {
    inputs: [
      { internalType: 'address', name: 'dao', type: 'address' },
      { internalType: 'address', name: 'module', type: 'address' },
      { internalType: 'address', name: 'sfactory', type: 'address' },
      { internalType: 'address', name: 'singleton', type: 'address' },
      { internalType: 'address', name: 'fallbackHandler', type: 'address' },
      { internalType: 'address', name: 'registry', type: 'address' },
      { internalType: 'string', name: 'name', type: 'string' }
    ],
    stateMutability: 'nonpayable',
    type: 'constructor'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'previousOwner', type: 'address' },
      { indexed: true, internalType: 'address', name: 'newOwner', type: 'address' }
    ],
    name: 'OwnershipTransferStarted',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'previousOwner', type: 'address' },
      { indexed: true, internalType: 'address', name: 'newOwner', type: 'address' }
    ],
    name: 'OwnershipTransferred',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [{ indexed: false, internalType: 'string', name: 'uri', type: 'string' }],
    name: 'URI',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: 'uint256', name: 'fromChainId', type: 'uint256' },
      { indexed: false, internalType: 'address', name: 'deployer', type: 'address' },
      { indexed: false, internalType: 'address', name: 'xAccount', type: 'address' },
      { indexed: false, internalType: 'address', name: 'module', type: 'address' },
      { indexed: false, internalType: 'address', name: 'port', type: 'address' }
    ],
    name: 'XAccountCreated',
    type: 'event'
  },
  {
    inputs: [],
    name: 'LOCAL_CHAINID',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'REGISTRY',
    outputs: [{ internalType: 'contract IPortRegistry', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'acceptOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'address', name: 'port', type: 'address' }],
    name: 'isRegistred',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'name',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'pendingOwner',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
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
    name: 'safeMsgportModule',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'safeSingleton',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'address', name: 'factory', type: 'address' }],
    name: 'setSafeFactory',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'address', name: 'fallbackHandler', type: 'address' }],
    name: 'setSafeFallbackHandler',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'address', name: 'module', type: 'address' }],
    name: 'setSafeMsgportModule',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'address', name: 'singleton', type: 'address' }],
    name: 'setSafeSingleton',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'string', name: 'uri', type: 'string' }],
    name: 'setURI',
    outputs: [],
    stateMutability: 'nonpayable',
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
    inputs: [{ internalType: 'address', name: 'newOwner', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'uri',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'fromChainId', type: 'uint256' },
      { internalType: 'uint256', name: 'toChainId', type: 'uint256' },
      { internalType: 'address', name: 'deployer', type: 'address' }
    ],
    name: 'xAccountOf',
    outputs: [
      { internalType: 'address', name: '', type: 'address' },
      { internalType: 'address', name: '', type: 'address' }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'fromChainId', type: 'uint256' },
      { internalType: 'address', name: 'deployer', type: 'address' },
      { internalType: 'address', name: 'factory', type: 'address' }
    ],
    name: 'xAccountOf',
    outputs: [
      { internalType: 'address', name: '', type: 'address' },
      { internalType: 'address', name: '', type: 'address' }
    ],
    stateMutability: 'pure',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'string', name: 'name', type: 'string' },
      { internalType: 'uint256', name: 'toChainId', type: 'uint256' },
      { internalType: 'bytes', name: 'params', type: 'bytes' },
      { internalType: 'address', name: 'recovery', type: 'address' }
    ],
    name: 'xCreate',
    outputs: [],
    stateMutability: 'payable',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'address', name: 'deployer', type: 'address' },
      { internalType: 'address', name: 'recovery', type: 'address' }
    ],
    name: 'xDeploy',
    outputs: [
      { internalType: 'address', name: '', type: 'address' },
      { internalType: 'address', name: '', type: 'address' }
    ],
    stateMutability: 'nonpayable',
    type: 'function'
  }
] as const;
