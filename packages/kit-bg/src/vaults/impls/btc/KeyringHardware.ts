/* eslint-disable @typescript-eslint/no-unused-vars */

import BigNumber from 'bignumber.js';
import * as BitcoinJS from 'bitcoinjs-lib';

import {
  checkBtcAddressIsUsed,
  getBtcForkNetwork,
  isTaprootPath,
} from '@unionkey/core/src/chains/btc/sdkBtc';
import type {
  IBtcInput,
  IBtcOutput,
  IEncodedTxBtc,
} from '@unionkey/core/src/chains/btc/types';
import coreChainApi from '@unionkey/core/src/instance/coreChainApi';
import type {
  ICoreApiGetAddressItem,
  ISignedMessagePro,
  ISignedTxPro,
} from '@unionkey/core/src/types';
import { AddressNotSupportSignMethodError } from '@unionkey/shared/src/errors';
import {
  convertDeviceError,
  convertDeviceResponse,
} from '@unionkey/shared/src/errors/utils/deviceErrorUtils';
import { CoreSDKLoader } from '@unionkey/shared/src/hardware/instance';
import { defaultLogger } from '@unionkey/shared/src/logger/logger';
import accountUtils from '@unionkey/shared/src/utils/accountUtils';
import { checkIsDefined } from '@unionkey/shared/src/utils/assertUtils';
import bufferUtils from '@unionkey/shared/src/utils/bufferUtils';

import { KeyringHardwareBase } from '../../base/KeyringHardwareBase';

import { KeyringHardwareBtcBase } from './KeyringHardwareBtcBase';

import type VaultBtc from './Vault';
import type { IDBAccount, IDBUtxoAccount } from '../../../dbs/local/types';
import type {
  IBuildHwAllNetworkPrepareAccountsParams,
  IHwSdkNetwork,
  IPrepareHardwareAccountsParams,
  ISignMessageParams,
  ISignTransactionParams,
} from '../../types';
import type {
  AllNetworkAddressParams,
  RefTransaction,
} from '@unionkeyfe/hd-core';
import type { Messages } from '@unionkeyfe/hd-transport';

export class KeyringHardware extends KeyringHardwareBtcBase {
  override coreApi = coreChainApi.btc.hd;

  override hwSdkNetwork: IHwSdkNetwork = 'btc';

  override async buildHwAllNetworkPrepareAccountsParams({
    template,
    index,
  }: IBuildHwAllNetworkPrepareAccountsParams): Promise<
    AllNetworkAddressParams | undefined
  > {
    return {
      network: this.hwSdkNetwork,
      path: this.buildPrepareAccountsPrefixedPath({ template, index }),
      showOnUnionKey: false,
    };
  }
}
