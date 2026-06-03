import coreChainApi from '@unionkey/core/src/instance/coreChainApi';

import { KeyringWatching as KeyringWatchingBtc } from '../btc/KeyringWatching';

export class KeyringWatching extends KeyringWatchingBtc {
  override coreApi = coreChainApi.bch.hd;
}
