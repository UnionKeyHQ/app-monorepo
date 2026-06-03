import { Serializer } from '@aptos-labs/ts-sdk';

import coreChainApi from '@unionkey/core/src/instance/coreChainApi';
import type { ISignedMessagePro, ISignedTxPro } from '@unionkey/core/src/types';
import bufferUtils from '@unionkey/shared/src/utils/bufferUtils';

import { KeyringImportedBase } from '../../base/KeyringImportedBase';

import { generateUnsignedTransaction } from './utils';

import type VaultAptos from './Vault';
import type { IDBAccount } from '../../../dbs/local/types';
import type {
  IExportAccountSecretKeysParams,
  IExportAccountSecretKeysResult,
  IGetPrivateKeysParams,
  IGetPrivateKeysResult,
  IPrepareImportedAccountsParams,
  ISignMessageParams,
  ISignTransactionParams,
} from '../../types';

export class KeyringImported extends KeyringImportedBase {
  override coreApi = coreChainApi.aptos.imported;

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
    params: IPrepareImportedAccountsParams,
  ): Promise<IDBAccount[]> {
    return this.basePrepareAccountsImported(params);
  }

  override async signTransaction(
    params: ISignTransactionParams,
  ): Promise<ISignedTxPro> {
    const { unsignedTx } = params;
    const rawTxn = await generateUnsignedTransaction(
      (this.vault as VaultAptos).client,
      params.unsignedTx,
    );
    const serializer = new Serializer();
    rawTxn.serialize(serializer);
    return this.baseSignTransaction({
      ...params,
      unsignedTx: {
        ...unsignedTx,
        rawTxUnsigned: bufferUtils.bytesToHex(serializer.toUint8Array()),
      },
    });
  }

  override async signMessage(
    params: ISignMessageParams,
  ): Promise<ISignedMessagePro> {
    // throw new NotImplemented();
    return this.baseSignMessage(params);
  }
}
