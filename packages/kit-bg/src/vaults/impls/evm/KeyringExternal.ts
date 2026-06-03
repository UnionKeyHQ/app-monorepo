import type { CoreChainApiBase } from '@unionkey/core/src/base/CoreChainApiBase';
import type { ISignedMessagePro, ISignedTxPro } from '@unionkey/core/src/types';

import { KeyringExternalBase } from '../../base/KeyringExternalBase';

import type { ISignMessageParams, ISignTransactionParams } from '../../types';

export class KeyringExternal extends KeyringExternalBase {
  override coreApi: CoreChainApiBase | undefined;

  override async signMessage(
    params: ISignMessageParams,
  ): Promise<ISignedMessagePro> {
    return this.baseSignMessageByExternalWallet(params);
  }

  override async signTransaction(
    params: ISignTransactionParams,
  ): Promise<ISignedTxPro> {
    return this.baseSendTransactionByExternalWallet(params);
  }
}
