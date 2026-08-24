/* eslint-disable @typescript-eslint/no-unused-vars */
import coreChainApi from '@unionkeyhq/core/src/instance/coreChainApi';
import type { ISignedMessagePro, ISignedTxPro } from '@unionkeyhq/core/src/types';
import { NotImplemented } from '@unionkeyhq/shared/src/errors';

import { KeyringExternalBase } from '../../base/KeyringExternalBase';

import type { ISignMessageParams, ISignTransactionParams } from '../../types';

export class KeyringExternal extends KeyringExternalBase {
  override coreApi = coreChainApi.alph.hd;

  override signMessage(params: ISignMessageParams): Promise<ISignedMessagePro> {
    throw new NotImplemented();
  }

  override signTransaction(
    params: ISignTransactionParams,
  ): Promise<ISignedTxPro> {
    throw new NotImplemented();
  }
}
