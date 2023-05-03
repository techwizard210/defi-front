// config
const config = {
  /// ///////////////////////////////////////
  // page info
  page: {
    name: 'Moon Vault',
    defaultChain: 137,
    nativeToken: '',
  },

  /// ///////////////////////////////////////
  // settings
  settings: {
    alwaysUseUserWeb3: true,
  },

  /// ///////////////////////////////////////
  // template info
  template: {
    useMenuGlow: true,
    showNativePrice: false,
    hideGas: false,
  },

  /// ///////////////////////////////////////
  // web 3 connections
  web3Data: {
    connections: [],
    multiCalls: [
      {
        chain: 25,
        multiCall: '0x13aD51a6664973EbD0749a7c84939d973F247921',
      },
      {
        chain: 56,
        multiCall: '0xB94858b0bB5437498F5453A16039337e5Fdc269C',
      },
      {
        chain: 137,
        multiCall: '0xC3821F0b56FA4F4794d5d760f94B812DE261361B',
      },
      {
        chain: 250,
        multiCall: '0xC9F6b1B53E056fd04bE5a197ce4B2423d456B982',
      },
      {
        chain: 1285,
        multiCall: '0x55f46144bC62e9Af4bAdB71842B62162e2194E90',
      },
      {
        chain: 43114,
        multiCall: '0x6FfF95AC47b586bDDEea244b3c2fe9c4B07b9F76',
      },
      {
        chain: 1666600000,
        multiCall: '0xBa5041B1c06e8c9cFb5dDB4b82BdC52E41EA5FC5',
      },
    ],
    web3RPCs: [
      {
        chain: 25,
        nodes: ['https://evm-cronos.crypto.org'],
      },
      {
        chain: 56,
        nodes: [
          'https://bsc-dataseed.binance.org/',
          'https://bsc-dataseed1.defibit.io/',
          'https://bsc-dataseed1.ninicoin.io/',
        ],
      },
      {
        chain: 137,
        nodes: [
          'https://polygon-rpc.com/',
          'https://matic-mainnet.chainstacklabs.com/',
          'https://rpc-mainnet.matic.network/',
          'https://rpc-mainnet.maticvigil.com/',
        ],
      },
      {
        chain: 250,
        nodes: ['https://rpc.ftm.tools/'],
      },
      {
        chain: 1666600000,
        nodes: ['https://api.s0.t.hmny.io/', 'https://api.harmony.one/'],
      },
    ],
  },
  /// ///////////////////////////////////////
};

// export
export { config };
