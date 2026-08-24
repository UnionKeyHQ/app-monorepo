import adaWebSdk from '@unionkeyhq/core/src/chains/ada/sdkAda/sdk/adaWebSdk';
import type { IAdaSdkApi } from '@unionkeyhq/core/src/chains/ada/sdkAda/sdk/types';
import timerUtils from '@unionkeyhq/shared/src/utils/timerUtils';

export default class OffscreenApiAdaSdk implements IAdaSdkApi {
  async sayHello() {
    await timerUtils.wait(3000);
    return 'Hello World: OffscreenApiAdaSdk';
  }

  async composeTxPlan(...args: any[]) {
    const api = await adaWebSdk.getCardanoApi();
    // @ts-ignore
    return api.composeTxPlan(...args);
  }

  async signTransaction(...args: any[]) {
    const api = await adaWebSdk.getCardanoApi();
    // @ts-ignore
    return api.signTransaction(...args);
  }

  async hwSignTransaction(...args: any[]) {
    const api = await adaWebSdk.getCardanoApi();
    // @ts-ignore
    return api.hwSignTransaction(...args);
  }

  async txToUnionKey(...args: any[]) {
    const api = await adaWebSdk.getCardanoApi();
    // @ts-ignore
    return api.txToUnionKey(...args);
  }

  async hasSetTagWithBody(...args: any[]) {
    const api = await adaWebSdk.getCardanoApi();
    // @ts-ignore
    return api.hasSetTagWithBody(...args);
  }

  async dAppGetBalance(...args: any[]) {
    const api = await adaWebSdk.getCardanoApi();
    // @ts-ignore
    return api.dAppGetBalance(...args);
  }

  async dAppGetAddresses(...args: any[]) {
    const api = await adaWebSdk.getCardanoApi();
    // @ts-ignore
    return api.dAppGetAddresses(...args);
  }

  async dAppGetUtxos(...args: any[]) {
    const api = await adaWebSdk.getCardanoApi();
    // @ts-ignore
    return api.dAppGetUtxos(...args);
  }

  async dAppConvertCborTxToEncodeTx(...args: any[]) {
    const api = await adaWebSdk.getCardanoApi();
    // @ts-ignore
    return api.dAppConvertCborTxToEncodeTx(...args);
  }

  async dAppSignData(...args: any[]) {
    const api = await adaWebSdk.getCardanoApi();
    // @ts-ignore
    return api.dAppSignData(...args);
  }
}
