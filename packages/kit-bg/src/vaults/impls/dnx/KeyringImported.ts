import coreChainApi from '@unionkey/core/src/instance/coreChainApi';
import type { ISignedMessagePro, ISignedTxPro } from '@unionkey/core/src/types';
import { NotImplemented } from '@unionkey/shared/src/errors';

import { KeyringImportedBase } from '../../base/KeyringImportedBase';

import type { IDBAccount } from '../../../dbs/local/types';
import type { IGetPrivateKeysResult } from '../../types';

export class KeyringImported extends KeyringImportedBase {
  override coreApi = coreChainApi.dynex.imported;

  override async getPrivateKeys(): Promise<IGetPrivateKeysResult> {
    throw new NotImplemented('Method not implemented');
  }

  override async prepareAccounts(): Promise<IDBAccount[]> {
    throw new NotImplemented('Method not implemented');
  }

  override async signTransaction(): Promise<ISignedTxPro> {
    throw new NotImplemented('Method not implemented');
  }

  override async signMessage(): Promise<ISignedMessagePro> {
    throw new NotImplemented('Method not implemented');
  }
}
