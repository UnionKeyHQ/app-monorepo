/* eslint-disable @typescript-eslint/no-unused-vars */
import coreChainApi from '@unionkey/core/src/instance/coreChainApi';
import type { ISignedMessagePro, ISignedTxPro } from '@unionkey/core/src/types';
import { NotImplemented } from '@unionkey/shared/src/errors';

import { KeyringImportedBase } from '../../base/KeyringImportedBase';

import type { IDBAccount } from '../../../dbs/local/types';
import type {
  IGetPrivateKeysParams,
  IGetPrivateKeysResult,
  IPrepareImportedAccountsParams,
  ISignMessageParams,
  ISignTransactionParams,
} from '../../types';

export class KeyringImported extends KeyringImportedBase {
  override coreApi = coreChainApi.neo.imported;

  override async getPrivateKeys(
    _: IGetPrivateKeysParams,
  ): Promise<IGetPrivateKeysResult> {
    throw new NotImplemented();
  }

  override async prepareAccounts(
    _: IPrepareImportedAccountsParams,
  ): Promise<IDBAccount[]> {
    throw new NotImplemented();
  }

  override async signTransaction(
    _: ISignTransactionParams,
  ): Promise<ISignedTxPro> {
    throw new NotImplemented();
  }

  override async signMessage(
    _: ISignMessageParams,
  ): Promise<ISignedMessagePro> {
    throw new NotImplemented();
  }
}
