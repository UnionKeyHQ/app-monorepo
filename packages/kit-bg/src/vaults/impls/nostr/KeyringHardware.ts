/* eslint-disable @typescript-eslint/no-unused-vars */

import { validateEvent } from '@unionkey/core/src/chains/nostr/sdkNostr';
import type { IEncodedTxNostr } from '@unionkey/core/src/chains/nostr/types';
import coreChainApi from '@unionkey/core/src/instance/coreChainApi';
import type {
  ICoreApiGetAddressItem,
  ISignedMessagePro,
  ISignedTxPro,
} from '@unionkey/core/src/types';
import { UnionKeyHardwareError } from '@unionkey/shared/src/errors';
import { convertDeviceError } from '@unionkey/shared/src/errors/utils/deviceErrorUtils';
import accountUtils from '@unionkey/shared/src/utils/accountUtils';
import { checkIsDefined } from '@unionkey/shared/src/utils/assertUtils';
import type { IDeviceSharedCallParams } from '@unionkey/shared/types/device';

import { KeyringHardwareBase } from '../../base/KeyringHardwareBase';

import type { IDBAccount } from '../../../dbs/local/types';
import type {
  IBuildHwAllNetworkPrepareAccountsParams,
  IHwSdkNetwork,
  IPrepareHardwareAccountsParams,
  ISignMessageParams,
  ISignTransactionParams,
} from '../../types';
import type { AllNetworkAddressParams } from '@onekeyfe/hd-core';

export class KeyringHardware extends KeyringHardwareBase {
  override coreApi = coreChainApi.evm.hd;

  override hwSdkNetwork: IHwSdkNetwork = 'nostr';

  override async buildHwAllNetworkPrepareAccountsParams(
    params: IBuildHwAllNetworkPrepareAccountsParams,
  ): Promise<AllNetworkAddressParams | undefined> {
    return {
      network: this.hwSdkNetwork,
      path: params.path,
      showOnUnionKey: false,
    };
  }

  override prepareAccounts(
    params: IPrepareHardwareAccountsParams,
  ): Promise<IDBAccount[]> {
    return this.basePrepareHdNormalAccounts(params, {
      buildAddressesInfo: async ({ usedIndexes }) => {
        const addressesInfo = await this.baseGetDeviceAccountPublicKeys({
          params,
          usedIndexes,
          sdkGetPublicKeysFn: async ({
            connectId,
            deviceId,
            pathPrefix,
            template,
            showOnUnionkeyFn,
          }) => {
            const buildFullPath = (p: { index: number }) =>
              accountUtils.buildPathFromTemplate({
                template,
                index: p.index,
              });

            const allNetworkAccounts = await this.getAllNetworkPrepareAccounts({
              params,
              usedIndexes,
              hwSdkNetwork: this.hwSdkNetwork,
              buildPath: buildFullPath,
              buildResultAccount: ({ account, index }) => ({
                path: account.path,
                publickey: account.payload?.publickey || '',
                npub: account.payload?.npub || '',
              }),
            });
            if (allNetworkAccounts) {
              return allNetworkAccounts;
            }
            throw new Error('use sdk allNetworkGetAddress instead');

            // const sdk = await this.getHardwareSDKInstance();
            // const response = await sdk.nostrGetPublicKey(connectId, deviceId, {
            //   ...params.deviceParams.deviceCommonParams,
            //   bundle: usedIndexes.map((index, arrIndex) => ({
            //     path: `${pathPrefix}/${index}'/0/0`,
            //     showOnUnionKey: showOnUnionkeyFn(arrIndex),
            //   })),
            // });
            // return response;
          },
        });
        const ret: ICoreApiGetAddressItem[] = [];
        for (const addressInfo of addressesInfo) {
          const { publickey, path, npub } = addressInfo;
          const item: ICoreApiGetAddressItem = {
            address: npub ?? '',
            path,
            publicKey: publickey || '',
          };
          ret.push(item);
        }
        return ret;
      },
    });
  }

  override async signTransaction(
    params: ISignTransactionParams,
  ): Promise<ISignedTxPro> {
    const { unsignedTx } = params;
    const encodedTx = unsignedTx.encodedTx as IEncodedTxNostr;
    const { event } = encodedTx;
    if (!validateEvent(event)) {
      throw new Error('Invalid event');
    }

    const sdk = await this.getHardwareSDKInstance();
    const deviceParams = checkIsDefined(params.deviceParams);
    const { connectId, deviceId } = deviceParams.dbDevice;
    const dbAccount = await this.vault.getAccount();

    let response;
    try {
      response = await sdk.nostrSignEvent(connectId, deviceId, {
        ...params.deviceParams?.deviceCommonParams,
        path: dbAccount.path,
        // @ts-expect-error
        event,
      });
    } catch (error: any) {
      throw new UnionKeyHardwareError(error);
    }

    if (!response.success) {
      throw convertDeviceError(response.payload);
    }

    const { event: signedEvent } = response.payload;
    event.sig = signedEvent.sig;

    return {
      txid: signedEvent.id ?? '',
      rawTx: JSON.stringify(event),
      encodedTx,
    };
  }

  override async signMessage(
    params: ISignMessageParams,
  ): Promise<ISignedMessagePro> {
    const sdk = await this.getHardwareSDKInstance();
    const deviceParams = checkIsDefined(params.deviceParams);
    const { connectId, deviceId } = deviceParams.dbDevice;
    const dbAccount = await this.vault.getAccount();
    const { messages } = params;

    const result = await Promise.all(
      messages.map(async ({ message }) => {
        const response = await sdk.nostrSignSchnorr(connectId, deviceId, {
          ...params.deviceParams?.deviceCommonParams,
          path: dbAccount.path,
          hash: message,
        });
        if (!response.success) {
          throw convertDeviceError(response.payload);
        }
        return response.payload.signature;
      }),
    );
    return result;
  }

  async encrypt(params: {
    pubkey: string;
    plaintext: string;
    password: string;
    deviceParams: IDeviceSharedCallParams | undefined;
  }): Promise<string> {
    const { pubkey, plaintext } = params;
    const sdk = await this.getHardwareSDKInstance();
    const deviceParams = checkIsDefined(params.deviceParams);
    const { connectId, deviceId } = deviceParams.dbDevice;
    const dbAccount = await this.vault.getAccount();

    let response;
    try {
      response = await sdk.nostrEncryptMessage(connectId, deviceId, {
        ...params.deviceParams?.deviceCommonParams,
        path: dbAccount.path,
        pubkey,
        plaintext,
        showOnUnionKey: false,
      });
    } catch (error: any) {
      throw new UnionKeyHardwareError(error);
    }

    if (!response.success) {
      throw convertDeviceError(response.payload);
    }

    return response.payload.encryptedMessage;
  }

  async decrypt(params: {
    pubkey: string;
    ciphertext: string;
    password: string;
    deviceParams: IDeviceSharedCallParams | undefined;
  }): Promise<string> {
    const { pubkey, ciphertext } = params;
    const sdk = await this.getHardwareSDKInstance();
    const deviceParams = checkIsDefined(params.deviceParams);
    const { connectId, deviceId } = deviceParams.dbDevice;
    const dbAccount = await this.vault.getAccount();

    let response;
    try {
      response = await sdk.nostrDecryptMessage(connectId, deviceId, {
        ...params.deviceParams?.deviceCommonParams,
        path: dbAccount.path,
        pubkey,
        ciphertext,
        showOnUnionKey: false,
      });
    } catch (error: any) {
      throw new UnionKeyHardwareError(error);
    }

    if (!response.success) {
      throw convertDeviceError(response.payload);
    }

    return response.payload.decryptedMessage;
  }
}
