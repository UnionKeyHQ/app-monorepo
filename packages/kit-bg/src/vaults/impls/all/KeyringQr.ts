import type { CoreChainApiBase } from '@unionkey/core/src/base/CoreChainApiBase';
import type { ISignedMessagePro, ISignedTxPro } from '@unionkey/core/src/types';
import { NotImplemented } from '@unionkey/shared/src/errors';

import { KeyringQrBase } from '../../base/KeyringQrBase';

import type { IDBAccount } from '../../../dbs/local/types';
import type { INormalizeGetMultiAccountsPathParams } from '../../types';

export class KeyringQr extends KeyringQrBase {
  override coreApi: CoreChainApiBase | undefined = undefined;

  override verifySignedTxMatched(..._args: any[]): Promise<void> {
    throw new NotImplemented();
  }

  override signTransaction(): Promise<ISignedTxPro> {
    throw new NotImplemented();
  }

  override signMessage(): Promise<ISignedMessagePro> {
    throw new NotImplemented();
  }

  override async prepareAccounts(): Promise<IDBAccount[]> {
    throw new NotImplemented();
  }

  override async normalizeGetMultiAccountsPath(
    params: INormalizeGetMultiAccountsPathParams,
  ): Promise<string> {
    throw new NotImplemented();
  }
}
