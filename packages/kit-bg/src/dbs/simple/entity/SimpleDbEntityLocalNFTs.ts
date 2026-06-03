import { backgroundMethod } from '@unionkey/shared/src/background/backgroundDecorators';
import { UnionKeyInternalError } from '@unionkey/shared/src/errors';
import { buildAccountLocalAssetsKey } from '@unionkey/shared/src/utils/accountUtils';
import type { IAccountNFT } from '@unionkey/shared/types/nft';

import { SimpleDbEntityBase } from '../base/SimpleDbEntityBase';

export interface ILocalNFTs {
  list: Record<string, IAccountNFT[]>; // <networkId_accountAddress/xpub, nfts>
}

export class SimpleDbEntityLocalNFTs extends SimpleDbEntityBase<ILocalNFTs> {
  entityName = 'LocalNFTs';

  override enableCache = false;

  @backgroundMethod()
  async updateAccountNFTs({
    networkId,
    accountAddress,
    xpub,
    nfts,
  }: {
    networkId: string;
    accountAddress?: string;
    xpub?: string;
    nfts: IAccountNFT[];
  }) {
    if (!accountAddress && !xpub) {
      throw new UnionKeyInternalError('accountAddress or xpub is required');
    }

    const key = buildAccountLocalAssetsKey({
      networkId,
      accountAddress,
      xpub,
    });

    await this.setRawData((rawData) => ({
      list: {
        ...rawData?.list,
        [key]: nfts,
      },
    }));
  }

  @backgroundMethod()
  async updateAccountNFTsByCache(nfts: Record<string, IAccountNFT[]>) {
    await this.setRawData((rawData) => ({
      list: {
        ...rawData?.list,
        ...nfts,
      },
    }));
  }

  @backgroundMethod()
  async getAccountNFTs({
    networkId,
    accountAddress,
    xpub,
  }: {
    networkId: string;
    accountAddress?: string;
    xpub?: string;
  }) {
    const key = buildAccountLocalAssetsKey({
      networkId,
      accountAddress,
      xpub,
    });

    return (await this.getRawData())?.list?.[key] || [];
  }
}
