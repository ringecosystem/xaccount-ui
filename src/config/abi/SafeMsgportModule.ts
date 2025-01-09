export const address = '0x002dD94114497E86b5493E2D048C731e4BeBdDD0' as `0x${string}`;
export const abi = [
  { inputs: [], stateMutability: 'nonpayable', type: 'constructor' },
  { inputs: [], name: 'AlreadySetup', type: 'error' },
  {
    inputs: [{ internalType: 'bytes', name: 'reason', type: 'bytes' }],
    name: 'SendEtherFailed',
    type: 'error'
  },
  { inputs: [], name: 'ZeroChainId', type: 'error' },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: 'address', name: 'target', type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'value', type: 'uint256' },
      { indexed: false, internalType: 'bytes', name: 'data', type: 'bytes' },
      { indexed: false, internalType: 'enum Operation', name: 'operation', type: 'uint8' },
      { indexed: false, internalType: 'bool', name: 'result', type: 'bool' }
    ],
    name: 'ModuleTransactionExecuted',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [{ indexed: false, internalType: 'address', name: 'port', type: 'address' }],
    name: 'SetPort',
    type: 'event'
  },
  {
    inputs: [{ internalType: 'address', name: 'port_', type: 'address' }],
    name: 'checkPort',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'childXAccount',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'port',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'rootChainid',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'rootOwner',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'address', name: 'port_', type: 'address' }],
    name: 'setPort',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'address', name: 'xAccount', type: 'address' },
      { internalType: 'uint256', name: 'chainId', type: 'uint256' },
      { internalType: 'address', name: 'owner', type: 'address' },
      { internalType: 'address', name: 'port_', type: 'address' }
    ],
    name: 'setup',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'address', name: 'target', type: 'address' },
      { internalType: 'uint256', name: 'value', type: 'uint256' },
      { internalType: 'bytes', name: 'data', type: 'bytes' },
      { internalType: 'enum Operation', name: 'operation', type: 'uint8' }
    ],
    name: 'xExecute',
    outputs: [{ internalType: 'bytes', name: '', type: 'bytes' }],
    stateMutability: 'payable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'xOwner',
    outputs: [
      { internalType: 'uint256', name: '', type: 'uint256' },
      { internalType: 'address', name: '', type: 'address' }
    ],
    stateMutability: 'view',
    type: 'function'
  }
] as const;
