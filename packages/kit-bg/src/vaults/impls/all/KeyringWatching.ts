import type { CoreChainApiBase } from '@unionkey/core/src/base/CoreChainApiBase';
import { NotImplemented } from '@unionkey/shared/src/errors';

import { KeyringWatchingBase } from '../../base/KeyringWatchingBase';

import type { IDBAccount } from '../../../dbs/local/types';

export class KeyringWatching extends KeyringWatchingBase {
  override coreApi: CoreChainApiBase | undefined;

  override async prepareAccounts(): Promise<IDBAccount[]> {
    throw new NotImplemented();
  }
}
