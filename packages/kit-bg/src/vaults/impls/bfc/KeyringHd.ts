import type { IEncodedTxBfc } from '@unionkey/core/src/chains/bfc/types';
import coreChainApi from '@unionkey/core/src/instance/coreChainApi';
import type { ISignedTxPro } from '@unionkey/core/src/types';

import { KeyringHdBase } from '../../base/KeyringHdBase';

import { toTransaction } from './sdkBfc/utils';

import type IVaultBfc from './Vault';
import type { IDBAccount } from '../../../dbs/local/types';
import type {
  IExportAccountSecretKeysParams,
  IExportAccountSecretKeysResult,
  IGetPrivateKeysParams,
  IGetPrivateKeysResult,
  IPrepareHdAccountsParams,
  ISignMessageParams,
  ISignTransactionParams,
} from '../../types';

export class KeyringHd extends KeyringHdBase {
  override coreApi = coreChainApi.bfc.hd;

  override async getPrivateKeys(
    params: IGetPrivateKeysParams,
  ): Promise<IGetPrivateKeysResult> {
    return this.baseGetPrivateKeys(params);
  }

  override async exportAccountSecretKeys(
    params: IExportAccountSecretKeysParams,
  ): Promise<IExportAccountSecretKeysResult> {
    return this.baseExportAccountSecretKeys(params);
  }

  override async prepareAccounts(
    params: IPrepareHdAccountsParams,
  ): Promise<IDBAccount[]> {
    return this.basePrepareAccountsHd(params);
  }

  override async signTransaction(
    params: ISignTransactionParams,
  ): Promise<ISignedTxPro> {
    const { unsignedTx } = params;
    const encodedTx = unsignedTx.encodedTx as IEncodedTxBfc;
    const client = await (this.vault as IVaultBfc).getClient();
    const initialTransaction = await toTransaction(
      client,
      encodedTx.sender,
      encodedTx,
    );
    const rawTxUnsigned = Buffer.from(initialTransaction).toString('hex');
    return this.baseSignTransaction({
      ...params,
      unsignedTx: {
        ...params.unsignedTx,
        rawTxUnsigned,
      },
    });
  }

  override async signMessage(params: ISignMessageParams): Promise<string[]> {
    return this.baseSignMessage(params);
  }
}
