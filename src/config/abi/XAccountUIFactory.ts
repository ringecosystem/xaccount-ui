export const address = '0x36379F9645676E11017022518845E6b131377230' as `0x${string}`;

export const abi = [
  {
    inputs: [{ internalType: 'address', name: 'factory', type: 'address' }],
    stateMutability: 'nonpayable',
    type: 'constructor'
  },
  {
    inputs: [],
    name: 'FACTORY',
    outputs: [{ internalType: 'contract IXAccountFactory', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'fromChainId', type: 'uint256' },
      { internalType: 'address', name: 'owner', type: 'address' },
      { internalType: 'address', name: 'port', type: 'address' },
      { internalType: 'address', name: 'recovery', type: 'address' }
    ],
    name: 'create',
    outputs: [
      { internalType: 'address', name: 'xAccount', type: 'address' },
      { internalType: 'address', name: 'module', type: 'address' }
    ],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'uint256', name: '', type: 'uint256' },
      { internalType: 'address', name: '', type: 'address' },
      { internalType: 'address', name: '', type: 'address' }
    ],
    name: 'deployers',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'fromChainId', type: 'uint256' },
      { internalType: 'address', name: 'owner', type: 'address' }
    ],
    name: 'getDeployed',
    outputs: [
      { internalType: 'address[]', name: '', type: 'address[]' },
      { internalType: 'address[]', name: '', type: 'address[]' }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'address', name: 'deployer', type: 'address' },
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
