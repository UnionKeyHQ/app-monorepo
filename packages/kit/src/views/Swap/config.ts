import { formatServerToken } from '@unionkeyhq/engine/src/managers/token';
import type { ServerToken } from '@unionkeyhq/engine/src/types/token';
import { UnionKeyNetwork } from '@unionkeyhq/shared/src/config/networkIds';

import type { Token } from '../../store/typings';
import type { Provider } from './typings';

export const swftcCustomerSupportUrl =
  'https://tawk.to/chat/6520bf666fcfe87d54b751ef/1hc3unaha';

export const zeroXenabledNetworkIds: string[] = [
  UnionKeyNetwork.eth,
  UnionKeyNetwork.bsc,
  UnionKeyNetwork.polygon,
  UnionKeyNetwork.fantom,
  UnionKeyNetwork.avalanche,
  UnionKeyNetwork.celo,
  UnionKeyNetwork.optimism,
  UnionKeyNetwork.arbitrum,
];

const serverURL = 'https://api.unionkey.io/swap';
export const quoterServerEndpoints: Record<string, string> = {
  [UnionKeyNetwork.heco]: `${serverURL}/swap/v1/quote`,
  [UnionKeyNetwork.goerli]: 'https://goerli.api.0x.org/swap/v1/quote',
};

export const estimatedTime: Record<string, number> = {
  [UnionKeyNetwork.eth]: 60,
  [UnionKeyNetwork.bsc]: 30,
  [UnionKeyNetwork.polygon]: 30,
  [UnionKeyNetwork.fantom]: 30,
  [UnionKeyNetwork.avalanche]: 30,
  [UnionKeyNetwork.celo]: 60,
  [UnionKeyNetwork.optimism]: 60,
  [UnionKeyNetwork.heco]: 15,
  [UnionKeyNetwork.okt]: 15,
};

export const networkProviderInfos: Record<string, Provider[]> = {
  [UnionKeyNetwork.okt]: [
    {
      name: 'CherrySwap',
      logoUrl: 'https://common.unionkey.io/logo/CherrySwap.png',
    },
  ],
  [UnionKeyNetwork.heco]: [
    {
      name: 'MDex',
      logoUrl: 'https://common.unionkey.io/logo/MdexSwap.png',
    },
  ],
  [UnionKeyNetwork.xdai]: [
    {
      name: 'HoneySwap',
      logoUrl: 'https://common.unionkey.io/logo/HoneySwap.png',
    },
  ],
};

export const limitOrderNetworkIds = [
  UnionKeyNetwork.eth,
  UnionKeyNetwork.bsc,
  UnionKeyNetwork.polygon,
] as string[];

const WETH = {
  name: 'Wrapped Ether',
  symbol: 'WETH',
  address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
  decimals: 18,
  logoURI:
    'https://common.unionkey.io/token/evm-1/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2.jpg',
  impl: 'evm',
  chainId: '1',
} as ServerToken;

const WBNB = {
  name: 'Wrapped BNB',
  symbol: 'WBNB',
  address: '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c',
  decimals: 18,
  logoURI:
    'https://common.unionkey.io/token/evm-56/0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c.jpg',
  impl: 'evm',
  chainId: '56',
} as ServerToken;

const WMATIC = {
  name: 'Wrapped Matic',
  symbol: 'WMATIC',
  address: '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270',
  decimals: 18,
  logoURI:
    'https://common.unionkey.io/token/evm-137/0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270.jpg',
  impl: 'evm',
  chainId: '137',
} as ServerToken;

export const WETH9: Record<string, Token> = {
  [UnionKeyNetwork.eth]: formatServerToken(WETH),
  [UnionKeyNetwork.bsc]: formatServerToken(WBNB),
  [UnionKeyNetwork.polygon]: formatServerToken(WMATIC),
};

export function wrapToken(token: Token) {
  if (!token.tokenIdOnNetwork && WETH9[token.networkId]) {
    return WETH9[token.networkId];
  }
  return token;
}

export const ZeroExchangeAddress = '0xdef1c0ded9bec7f1a1670819833240f027b25eff';

export const networkIdDontSupportRecipientAddress: string[] = [
  // jupitor
  UnionKeyNetwork.sol,
  // openocean
  UnionKeyNetwork.apt,
];
