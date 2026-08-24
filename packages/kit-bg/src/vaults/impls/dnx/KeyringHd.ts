import coreChainApi from '@unionkeyhq/core/src/instance/coreChainApi';
import type { ISignedTxPro } from '@unionkeyhq/core/src/types';
import { NotImplemented } from '@unionkeyhq/shared/src/errors';
import { ETranslations } from '@unionkeyhq/shared/src/locale';
import { appLocale } from '@unionkeyhq/shared/src/locale/appLocale';

import { KeyringHdBase } from '../../base/KeyringHdBase';

import type { IDBAccount } from '../../../dbs/local/types';
import type { IGetPrivateKeysResult } from '../../types';

export class KeyringHd extends KeyringHdBase {
  override coreApi = coreChainApi.dynex.hd;

  override async getPrivateKeys(): Promise<IGetPrivateKeysResult> {
    throw new NotImplemented('Method not implemented');
  }

  override async prepareAccounts(): Promise<IDBAccount[]> {
    throw new Error(
      appLocale.intl.formatMessage({
        id: ETranslations.global_bulk_add_account_dnx_error,
      }),
    );
  }

  override async signTransaction(): Promise<ISignedTxPro> {
    throw new NotImplemented('Method not implemented');
  }

  override async signMessage(): Promise<string[]> {
    throw new NotImplemented('Method not implemented');
  }
}
