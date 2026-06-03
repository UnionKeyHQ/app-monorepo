import { serializeUnsignedTransaction } from '@unionkey/core/src/chains/dot/sdkDot';
import type { IEncodedTxDot } from '@unionkey/core/src/chains/dot/types';
import coreChainApi from '@unionkey/core/src/instance/coreChainApi';
import type { ISignedMessagePro, ISignedTxPro } from '@unionkey/core/src/types';
import bufferUtils from '@unionkey/shared/src/utils/bufferUtils';

import { KeyringImportedBase } from '../../base/KeyringImportedBase';

import { getMetadataRpc } from './utils';

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
  override coreApi = coreChainApi.dot.imported;

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
    return this.basePrepareAccountsImported(params, {
      onlyAvailableOnCertainNetworks: true,
    });
  }

  override async signTransaction(
    params: ISignTransactionParams,
  ): Promise<ISignedTxPro> {
    const { unsignedTx } = params;
    const encodedTx = unsignedTx.encodedTx as IEncodedTxDot;
    const metadataRpc = await getMetadataRpc(
      this.networkId,
      this.backgroundApi,
    );
    const rawTxUnsigned = await serializeUnsignedTransaction({
      ...encodedTx,
      metadataRpc,
    });
    return this.baseSignTransaction({
      ...params,
      unsignedTx: {
        ...unsignedTx,
        encodedTx: {
          ...encodedTx,
          metadataRpc,
        },
        rawTxUnsigned: bufferUtils.bytesToHex(rawTxUnsigned.rawTx),
      },
    });
  }

  override async signMessage(
    params: ISignMessageParams,
  ): Promise<ISignedMessagePro> {
    return this.baseSignMessage(params);
  }
}
