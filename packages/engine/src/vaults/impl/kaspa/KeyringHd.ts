import { bytesToHex, hexToBytes } from '@noble/hashes/utils';

import type { ExportedSeedCredential } from '@unionkeyhq/engine/src/dbs/base';
import { OneKeyInternalError } from '@unionkeyhq/engine/src/errors';
import { slicePathTemplate } from '@unionkeyhq/engine/src/managers/derivation';
import { getAccountNameInfoByImpl } from '@unionkeyhq/engine/src/managers/impl';
import { Signer } from '@unionkeyhq/engine/src/proxy';
import { batchGetPublicKeys } from '@unionkeyhq/engine/src/secret';
import { AccountType } from '@unionkeyhq/engine/src/types/account';
import type { DBSimpleAccount } from '@unionkeyhq/engine/src/types/account';
import type { UnsignedTx } from '@unionkeyhq/engine/src/types/provider';
import { KeyringHdBase } from '@unionkeyhq/engine/src/vaults/keyring/KeyringHdBase';
import type {
  IPrepareSoftwareAccountsParams,
  ISignCredentialOptions,
  SignedTxResult,
} from '@unionkeyhq/engine/src/vaults/types';
import {
  IMPL_KASPA as COIN_IMPL,
  COINTYPE_KASPA as COIN_TYPE,
} from '@unionkeyhq/shared/src/engine/engineConsts';
import debugLogger from '@unionkeyhq/shared/src/logger/debugLogger';

import {
  addressFromPublicKey,
  privateKeyFromOriginPrivateKey,
  publicKeyFromOriginPubkey,
} from './sdk';
import { signTransaction, toTransaction } from './sdk/transaction';

import type { PrivateKey } from '@kaspa/core-lib';

// @ts-ignore
export class KeyringHd extends KeyringHdBase {
  override async getSigners(password: string, addresses: Array<string>) {
    const dbAccount = await this.getDbAccount();

    if (addresses.length !== 1) {
      throw new OneKeyInternalError('Kaspa signers number should be 1.');
    } else if (addresses[0] !== dbAccount.address) {
      throw new OneKeyInternalError('Wrong address required for signing.');
    }

    const { [dbAccount.path]: privateKey } = await this.getPrivateKeys(
      password,
    );
    if (typeof privateKey === 'undefined') {
      throw new OneKeyInternalError('Unable to get signer.');
    }

    return {
      [dbAccount.address]: new Signer(privateKey, password, 'secp256k1'),
    };
  }

  override async prepareAccounts(
    params: IPrepareSoftwareAccountsParams,
  ): Promise<Array<DBSimpleAccount>> {
    const { password, indexes, names, template } = params;

    const { seed } = (await this.engine.dbApi.getCredential(
      this.walletId,
      password,
    )) as ExportedSeedCredential;

    const { pathPrefix } = slicePathTemplate(template);
    const pubKeyInfos = batchGetPublicKeys(
      'secp256k1',
      seed,
      password,
      pathPrefix,
      indexes.map((index) => `${index.toString()}`),
    );

    if (pubKeyInfos.length !== indexes.length) {
      throw new OneKeyInternalError('Unable to get publick key.');
    }

    const { prefix } = getAccountNameInfoByImpl(COIN_IMPL).default;
    const chainId = await this.getNetworkChainId();

    const ret = [];
    let index = 0;
    for (const info of pubKeyInfos) {
      const {
        path,
        extendedKey: { key: pubkey },
      } = info;

      const originPub = bytesToHex(pubkey);
      const publicKey = publicKeyFromOriginPubkey(pubkey);
      const address = addressFromPublicKey(publicKey, chainId);

      const name = (names || [])[index] || `${prefix} #${indexes[index] + 1}`;
      ret.push({
        id: `${this.walletId}--${path}`,
        name,
        type: AccountType.SIMPLE,
        path,
        coinType: COIN_TYPE,
        pub: originPub,
        address,
      });
      index += 1;
    }
    return ret;
  }

  override async signTransaction(
    unsignedTx: UnsignedTx,
    options: ISignCredentialOptions,
  ): Promise<SignedTxResult> {
    debugLogger.common.info('signTransaction result', unsignedTx);
    const dbAccount = (await this.getDbAccount()) as DBSimpleAccount;
    const sender = dbAccount.address;
    const signers = await this.getSigners(options.password || '', [sender]);
    const signer = signers[sender];

    const chainId = await this.getNetworkChainId();
    const { encodedTx } = unsignedTx.payload;
    const txn = toTransaction(encodedTx);

    const signedTx = await signTransaction(txn, {
      getPublicKey() {
        return publicKeyFromOriginPubkey(
          Buffer.from(hexToBytes(dbAccount.pub)),
        );
      },
      async getPrivateKey(): Promise<PrivateKey> {
        const privateKey = await signer.getPrvkey();
        const publicKey = await signer.getPubkey(true);
        return privateKeyFromOriginPrivateKey(privateKey, publicKey, chainId);
      },
    });

    return {
      txid: '',
      rawTx: signedTx,
    };
  }
}
