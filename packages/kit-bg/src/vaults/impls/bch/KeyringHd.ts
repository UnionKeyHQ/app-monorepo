import coreChainApi from '@unionkey/core/src/instance/coreChainApi';

import { KeyringHd as KeyringHdBtc } from '../btc/KeyringHd';

export class KeyringHd extends KeyringHdBtc {
  override coreApi = coreChainApi.bch.hd;
}
