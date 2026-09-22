import { InvalidAddress } from '@unionkeyhq/engine/src/errors';
import type { DBVariantAccount } from '@unionkeyhq/engine/src/types/account';
import { AccountType } from '@unionkeyhq/engine/src/types/account';
import { KeyringWatchingBase } from '@unionkeyhq/engine/src/vaults/keyring/KeyringWatchingBase';
import type { IPrepareWatchingAccountsParams } from '@unionkeyhq/engine/src/vaults/types';
import { COINTYPE_DOT as COIN_TYPE } from '@unionkeyhq/shared/src/engine/engineConsts';

// @ts-ignore
export class KeyringWatching extends KeyringWatchingBase {
  override async prepareAccounts(
    params: IPrepareWatchingAccountsParams,
  ): Promise<Array<DBVariantAccount>> {
    const { name, target, accountIdPrefix } = params;

    const normalizedAddress = await this.vault.validateAddress(target);

    if (typeof normalizedAddress === 'undefined') {
      throw new InvalidAddress();
    }

    return Promise.resolve([
      {
        id: `${accountIdPrefix}--${COIN_TYPE}--${target}`,
        name: name || '',
        type: AccountType.VARIANT,
        path: '',
        coinType: COIN_TYPE,
        pub: '', // TODO: only address is supported for now.
        address: '',
        addresses: {
          [this.networkId]: normalizedAddress,
        },
      },
    ]);
  }
}
