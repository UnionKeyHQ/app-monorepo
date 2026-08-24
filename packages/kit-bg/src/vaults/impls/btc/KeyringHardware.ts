/* eslint-disable @typescript-eslint/no-unused-vars */

import BigNumber from 'bignumber.js';
import * as BitcoinJS from 'bitcoinjs-lib';

import {
  checkBtcAddressIsUsed,
  getBtcForkNetwork,
  isTaprootPath,
} from '@unionkeyhq/core/src/chains/btc/sdkBtc';
import type {
  IBtcInput,
  IBtcOutput,
  IEncodedTxBtc,
} from '@unionkeyhq/core/src/chains/btc/types';
import coreChainApi from '@unionkeyhq/core/src/instance/coreChainApi';
import type {
  ICoreApiGetAddressItem,
  ISignedMessagePro,
  ISignedTxPro,
} from '@unionkeyhq/core/src/types';
import { AddressNotSupportSignMethodError } from '@unionkeyhq/shared/src/errors';
import {
  convertDeviceError,
  convertDeviceResponse,
} from '@unionkeyhq/shared/src/errors/utils/deviceErrorUtils';
import { CoreSDKLoader } from '@unionkeyhq/shared/src/hardware/instance';
import { defaultLogger } from '@unionkeyhq/shared/src/logger/logger';
import accountUtils from '@unionkeyhq/shared/src/utils/accountUtils';
import { checkIsDefined } from '@unionkeyhq/shared/src/utils/assertUtils';
import bufferUtils from '@unionkeyhq/shared/src/utils/bufferUtils';

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
} from '@onekeyfe/hd-core';
import type { Messages } from '@onekeyfe/hd-transport';

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
      showOnOneKey: false,
    };
  }
}
