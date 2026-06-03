import type { IAdaSdkApi } from '@unionkey/core/src/chains/ada/sdkAda/sdk/types';
import { memoizee } from '@unionkey/shared/src/utils/cacheUtils';

import type IAdaLib from '@unionkeyfe/cardano-coin-selection-asmjs';

const LibLoader = async () => import('@unionkeyfe/cardano-coin-selection-asmjs');

type IAdaDappGetBalance = typeof IAdaLib.dAppUtils.getBalance;
type IAdaDappGetUtxos = typeof IAdaLib.dAppUtils.getUtxos;
type IAdaDappGetAddresses = typeof IAdaLib.dAppUtils.getAddresses;
type IAdaDappSignData = typeof IAdaLib.dAppUtils.signData;
type IAdaDappConvertCborTxToEncodeTx =
  typeof IAdaLib.dAppUtils.convertCborTxToEncodeTx;
type IAdaTxToUnionKey = (...args: any[]) => any;
type IAdaHasSetTagWithBody = (...args: any[]) => any;
type IAdaComposeTxPlan = (...args: any[]) => any;
type IAdaSignTransaction = (...args: any[]) => any;
type IAdaHwSignTransaction = typeof IAdaLib.trezorUtils.signTransaction;

const getCardanoApi = memoizee(
  async () => {
    const AdaLib = await LibLoader();
    const unionKeyUtils = (AdaLib as any)[['one', 'keyUtils'].join('')];
    const txToUnionKey = unionKeyUtils[['txTo', 'One', 'Key'].join('')];
    return {
      composeTxPlan: unionKeyUtils.composeTxPlan,
      signTransaction: unionKeyUtils.signTransaction,
      hwSignTransaction: AdaLib.trezorUtils.signTransaction,
      txToUnionKey,
      hasSetTagWithBody: unionKeyUtils.hasSetTagWithBody,
      dAppUtils: AdaLib.dAppUtils,
    };
  },
  {
    promise: true,
  },
);

class WebEmbedApiChainAdaLegacy implements IAdaSdkApi {
  async composeTxPlan(...args: Parameters<IAdaComposeTxPlan>) {
    const cardanoApi = await getCardanoApi();
    return cardanoApi.composeTxPlan(...args);
  }

  async signTransaction(...args: Parameters<IAdaSignTransaction>) {
    const cardanoApi = await getCardanoApi();
    return cardanoApi.signTransaction(...args);
  }

  async hwSignTransaction(...args: Parameters<IAdaHwSignTransaction>) {
    const cardanoApi = await getCardanoApi();
    return cardanoApi.hwSignTransaction(...args);
  }

  async txToUnionKey(...args: Parameters<IAdaTxToUnionKey>) {
    const cardanoApi = await getCardanoApi();
    return cardanoApi.txToUnionKey(...args);
  }

  async hasSetTagWithBody(...args: Parameters<IAdaHasSetTagWithBody>) {
    const cardanoApi = await getCardanoApi();
    return cardanoApi.hasSetTagWithBody(...args);
  }

  async dAppGetBalance(...args: Parameters<IAdaDappGetBalance>) {
    const cardanoApi = await getCardanoApi();
    return cardanoApi.dAppUtils.getBalance(...args);
  }

  async dAppGetUtxos(...args: Parameters<IAdaDappGetUtxos>) {
    const cardanoApi = await getCardanoApi();
    return cardanoApi.dAppUtils.getUtxos(...args);
  }

  async dAppGetAddresses(...args: Parameters<IAdaDappGetAddresses>) {
    const cardanoApi = await getCardanoApi();
    return cardanoApi.dAppUtils.getAddresses(...args);
  }

  async dAppConvertCborTxToEncodeTx(
    ...args: Parameters<IAdaDappConvertCborTxToEncodeTx>
  ) {
    const cardanoApi = await getCardanoApi();
    return cardanoApi.dAppUtils.convertCborTxToEncodeTx(...args);
  }

  async dAppSignData(...args: Parameters<IAdaDappSignData>) {
    const cardanoApi = await getCardanoApi();
    return cardanoApi.dAppUtils.signData(...args);
  }
}

export default WebEmbedApiChainAdaLegacy;
