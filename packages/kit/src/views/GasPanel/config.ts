import { UnionKeyNetwork } from '@unionkeyhq/shared/src/config/networkIds';

export const supportedNetworks = [
  UnionKeyNetwork.btc,
  UnionKeyNetwork.eth,
  UnionKeyNetwork.polygon,
];

export const priceUnit = {
  [UnionKeyNetwork.btc]: 'sat/vB',
  [UnionKeyNetwork.eth]: 'Gwei',
  [UnionKeyNetwork.polygon]: 'Gwei',
};

export const supportedNetworksSettings = {
  [UnionKeyNetwork.btc]: {
    supportOverview: false,
    EIP1559Enabled: false,
  },
  [UnionKeyNetwork.eth]: {
    supportOverview: true,
    EIP1559Enabled: true,
  },
  [UnionKeyNetwork.polygon]: {
    supportOverview: true,
    EIP1559Enabled: true,
  },
};

export const networkPendingTransactionThresholds = {
  [UnionKeyNetwork.eth]: {
    'low': 0,
    'stable': 100,
    'busy': 200,
  },
  [UnionKeyNetwork.polygon]: {
    'low': 0,
    'stable': 200,
    'busy': 300,
  },
};

export const btcMockLimit = '340';
