import coreChainApi from '@unionkey/core/src/instance/coreChainApi';

import { KeyringImported as KeyringImportedBtc } from '../btc/KeyringImported';

export class KeyringImported extends KeyringImportedBtc {
  override coreApi = coreChainApi.doge.imported;
}
