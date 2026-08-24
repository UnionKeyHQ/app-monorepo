import type { CoreChainApiBase } from '@unionkeyhq/core/src/base/CoreChainApiBase';
import { NotImplemented } from '@unionkeyhq/shared/src/errors';

import { KeyringWatchingBase } from '../../base/KeyringWatchingBase';

import type { IDBAccount } from '../../../dbs/local/types';

export class KeyringWatching extends KeyringWatchingBase {
  override coreApi: CoreChainApiBase | undefined;

  override async prepareAccounts(): Promise<IDBAccount[]> {
    throw new NotImplemented();
  }
}
