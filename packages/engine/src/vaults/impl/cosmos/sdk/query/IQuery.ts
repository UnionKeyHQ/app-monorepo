import { UnionKeyNetwork } from '@unionkeyhq/shared/src/config/networkIds';

import { CosmwasmQuery } from './CosmwasmQuery';
import { UnionKeyQuery } from './UnionKeyQuery';
import { SecretwasmQuery } from './SecretwasmQuery';

import type { AxiosInstance } from 'axios';
import type BigNumber from 'bignumber.js';

export interface Cw20AssetInfo {
  contractAddress: string;
  name: string;
  decimals: number;
  symbol: string;
}

export interface Cw20TokenBalance {
  address: string;
  balance: BigNumber;
}

export interface QueryChainInfo {
  networkId: string;
  axios?: AxiosInstance;
}

export interface IQuery {
  queryCw20TokenInfo: (
    chainInfo: QueryChainInfo,
    contractAddressArray: string[],
  ) => Promise<Cw20AssetInfo[]>;

  queryCw20TokenBalance: (
    chainInfo: QueryChainInfo,
    contractAddress: string,
    address: string[],
  ) => Promise<Cw20TokenBalance[]>;
}

class QueryRegistry {
  private readonly registryMap: Map<string, IQuery> = new Map();

  public get(chainId: string): IQuery | undefined {
    return this.registryMap.get(chainId);
  }

  public register(chainId: string, query: IQuery): void {
    this.registryMap.set(chainId, query);
  }
}

export const queryRegistry = new QueryRegistry();
const cosmwasmQuery = new CosmwasmQuery();
queryRegistry.register(UnionKeyNetwork.juno, cosmwasmQuery);
// queryRegistry.register(UnionKeyNetwork.terra, cosmwasmQuery); // terra2
queryRegistry.register(UnionKeyNetwork.osmosis, cosmwasmQuery);
queryRegistry.register(UnionKeyNetwork.secretnetwork, new SecretwasmQuery());

const unionKeyQuery = new UnionKeyQuery();
queryRegistry.register(UnionKeyNetwork.cosmoshub, unionKeyQuery);
queryRegistry.register(UnionKeyNetwork.akash, unionKeyQuery);
queryRegistry.register(UnionKeyNetwork.fetch, unionKeyQuery);
