import type { FC } from 'react';

import { UnionKeyNetwork } from '@unionkeyhq/shared/src/config/networkIds';

import Icon from '../Icon';
import { TokenIcon } from '../Token';

import type { ICON_NAMES } from '../Icon';

export const NetworkDarkIconNameMap: Record<string, ICON_NAMES> = {
  [UnionKeyNetwork.ada]: 'CardanoIllus',
  [UnionKeyNetwork.algo]: 'AlgorandIllus',
  [UnionKeyNetwork.apt]: 'AptosIllus',
  [UnionKeyNetwork.bch]: 'BitcoinCashIllus',
  [UnionKeyNetwork.btc]: 'BitcoinIllus',
  [UnionKeyNetwork.cfx]: 'ConfluxEspaceIllus',
  [UnionKeyNetwork.akash]: 'AkashIllus',
  [UnionKeyNetwork.cosmoshub]: 'CosmosIllus',
  [UnionKeyNetwork.cryptoorgchain]: 'CryptoOrgIllus',
  [UnionKeyNetwork.fetch]: 'FetchAiIllus',
  [UnionKeyNetwork.juno]: 'JunoIllus',
  [UnionKeyNetwork.osmosis]: 'OsmosisIllus',
  [UnionKeyNetwork.terra]: 'TerraIllus',
  [UnionKeyNetwork.secretnetwork]: 'SecretNetworkIllus',
  [UnionKeyNetwork.doge]: 'DogecoinIllus',
  [UnionKeyNetwork.astar]: 'AstarIllus',
  [UnionKeyNetwork.ksm]: 'KusamaIllus',
  [UnionKeyNetwork.dot]: 'PolkadotIllus',
  [UnionKeyNetwork.eth]: 'EthereumIllus',
  [UnionKeyNetwork.optimism]: 'OptimismIllus',
  [UnionKeyNetwork.xdai]: 'GnosisChainIllus',
  [UnionKeyNetwork.ethw]: 'EthereumpowIllus',
  [UnionKeyNetwork.cfxespace]: 'ConfluxEspaceIllus',
  [UnionKeyNetwork.heco]: 'HuobiEcoChainIllus',
  [UnionKeyNetwork.aurora]: 'AuroraIllus',
  [UnionKeyNetwork.polygon]: 'PolygonIllus',
  [UnionKeyNetwork.cronos]: 'CronosIllus',
  [UnionKeyNetwork.fantom]: 'FantomIllus',
  [UnionKeyNetwork.boba]: 'BobaNetworkIllus',
  [UnionKeyNetwork.fevm]: 'FilecoinIllus',
  [UnionKeyNetwork.zksyncera]: 'ZksyncEraMainnetIllus',
  [UnionKeyNetwork.arbitrum]: 'ArbitrumIllus',
  [UnionKeyNetwork.celo]: 'CeloIllus',
  [UnionKeyNetwork.avalanche]: 'AvalancheIllus',
  [UnionKeyNetwork.etf]: 'EthereumFairIllus',
  [UnionKeyNetwork.bsc]: 'BnbSmartChainIllus',
  [UnionKeyNetwork.etc]: 'EthereumClassicIllus',
  [UnionKeyNetwork.okt]: 'OkxChainIllus',
  [UnionKeyNetwork.mvm]: 'MixinVirtualMachineIllus',
  [UnionKeyNetwork.fil]: 'FilecoinIllus',
  [UnionKeyNetwork.kaspa]: 'KaspaIllus',
  [UnionKeyNetwork.ltc]: 'LitecoinIllus',
  [UnionKeyNetwork.near]: 'NearIllus',
  [UnionKeyNetwork.sol]: 'SolanaIllus',
  [UnionKeyNetwork.stc]: 'StarcoinIllus',
  [UnionKeyNetwork.sui]: 'SuiIllus',
  [UnionKeyNetwork.trx]: 'TronIllus',
  [UnionKeyNetwork.xmr]: 'MoneroIllus',
  [UnionKeyNetwork.xrp]: 'RippleIllus',
  [UnionKeyNetwork.lightning]: 'LightningNetworkIllus',
  [UnionKeyNetwork.nexa]: 'NexaIllus',
  [UnionKeyNetwork.base]: 'BaseIllus',
  [UnionKeyNetwork.linea]: 'LineaIllus',
  [UnionKeyNetwork.mantle]: 'MantleIllus',
  [UnionKeyNetwork.scroll]: 'ScrollIllus',
  more: 'MoreIllus',
};

export const NetworkDarkIcon: FC<{
  networkId: string;
  fallback?: string;
  size?: number;
}> = ({ networkId, fallback, size = 4 }) => {
  const iconName = NetworkDarkIconNameMap[networkId];
  if (iconName) {
    return <Icon size={4 * size} name={iconName} color="icon-subdued" />;
  }
  return (
    <TokenIcon
      size={size}
      token={{
        name: fallback,
      }}
    />
  );
};
