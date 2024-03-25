export const abi = [
  {
    type: 'constructor',
    inputs: [{ name: '_rewardsDistribution', type: 'address', internalType: 'address' }],
    payable: false,
    stateMutability: 'nonpayable'
  },
  {
    name: 'RewardAdded',
    type: 'event',
    inputs: [{ name: 'reward', type: 'uint256', indexed: false, internalType: 'uint256' }],
    anonymous: false
  },
  {
    name: 'RewardPaid',
    type: 'event',
    inputs: [
      { name: 'user', type: 'address', indexed: true, internalType: 'address' },
      { name: 'reward', type: 'uint256', indexed: false, internalType: 'uint256' }
    ],
    anonymous: false
  },
  {
    name: 'Staked',
    type: 'event',
    inputs: [
      { name: 'user', type: 'address', indexed: true, internalType: 'address' },
      { name: 'amount', type: 'uint256', indexed: false, internalType: 'uint256' }
    ],
    anonymous: false
  },
  {
    name: 'Withdrawn',
    type: 'event',
    inputs: [
      { name: 'user', type: 'address', indexed: true, internalType: 'address' },
      { name: 'amount', type: 'uint256', indexed: false, internalType: 'uint256' }
    ],
    anonymous: false
  },
  {
    name: 'balanceOf',
    type: 'function',
    inputs: [{ name: 'account', type: 'address', internalType: 'address' }],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    payable: false,
    constant: true,
    stateMutability: 'view'
  },
  {
    name: 'earned',
    type: 'function',
    inputs: [{ name: 'account', type: 'address', internalType: 'address' }],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    payable: false,
    constant: true,
    stateMutability: 'view'
  },
  {
    name: 'exit',
    type: 'function',
    inputs: [],
    outputs: [],
    payable: false,
    constant: false,
    stateMutability: 'nonpayable'
  },
  {
    name: 'getReward',
    type: 'function',
    inputs: [],
    outputs: [],
    payable: false,
    constant: false,
    stateMutability: 'nonpayable'
  },
  {
    name: 'getRewardForDuration',
    type: 'function',
    inputs: [],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    payable: false,
    constant: true,
    stateMutability: 'view'
  },
  {
    name: 'lastTimeRewardApplicable',
    type: 'function',
    inputs: [],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    payable: false,
    constant: true,
    stateMutability: 'view'
  },
  {
    name: 'lastUpdateTime',
    type: 'function',
    inputs: [],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    payable: false,
    constant: true,
    stateMutability: 'view'
  },
  {
    name: 'notifyRewardAmount',
    type: 'function',
    inputs: [],
    outputs: [],
    payable: true,
    constant: false,
    stateMutability: 'payable'
  },
  {
    name: 'periodFinish',
    type: 'function',
    inputs: [],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    payable: false,
    constant: true,
    stateMutability: 'view'
  },
  {
    name: 'rewardPerToken',
    type: 'function',
    inputs: [],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    payable: false,
    constant: true,
    stateMutability: 'view'
  },
  {
    name: 'rewardPerTokenStored',
    type: 'function',
    inputs: [],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    payable: false,
    constant: true,
    stateMutability: 'view'
  },
  {
    name: 'rewardRate',
    type: 'function',
    inputs: [],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    payable: false,
    constant: true,
    stateMutability: 'view'
  },
  {
    name: 'rewards',
    type: 'function',
    inputs: [{ name: '', type: 'address', internalType: 'address' }],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    payable: false,
    constant: true,
    stateMutability: 'view'
  },
  {
    name: 'rewardsDistribution',
    type: 'function',
    inputs: [],
    outputs: [{ name: '', type: 'address', internalType: 'address' }],
    payable: false,
    constant: true,
    stateMutability: 'view'
  },
  {
    name: 'rewardsDuration',
    type: 'function',
    inputs: [],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    payable: false,
    constant: true,
    stateMutability: 'view'
  },
  {
    name: 'stake',
    type: 'function',
    inputs: [{ name: 'amount', type: 'uint256', internalType: 'uint256' }],
    outputs: [],
    payable: false,
    constant: false,
    stateMutability: 'nonpayable'
  },
  {
    name: 'stakingToken',
    type: 'function',
    inputs: [],
    outputs: [{ name: '', type: 'address', internalType: 'contract IERC20' }],
    payable: false,
    constant: true,
    stateMutability: 'view'
  },
  {
    name: 'totalSupply',
    type: 'function',
    inputs: [],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    payable: false,
    constant: true,
    stateMutability: 'view'
  },
  {
    name: 'userRewardPerTokenPaid',
    type: 'function',
    inputs: [{ name: '', type: 'address', internalType: 'address' }],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    payable: false,
    constant: true,
    stateMutability: 'view'
  },
  {
    name: 'withdraw',
    type: 'function',
    inputs: [{ name: 'amount', type: 'uint256', internalType: 'uint256' }],
    outputs: [],
    payable: false,
    constant: false,
    stateMutability: 'nonpayable'
  }
] as const;
