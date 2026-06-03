export type IGetCardanoApi = () => Promise<IAdaSdkApi>;

export type IEnsureSDKReady = () => Promise<boolean>;

export interface IAdaSdk {
  getCardanoApi: IGetCardanoApi;
  ensureSDKReady: IEnsureSDKReady;
}

export interface IAdaSdkApi {
  composeTxPlan: (...args: any[]) => any;
  signTransaction: (...args: any[]) => any;
  hwSignTransaction: typeof import('@onekeyfe/cardano-coin-selection-asmjs').trezorUtils.signTransaction;
  txToUnionKey: (...args: any[]) => any;
  hasSetTagWithBody: (...args: any[]) => any;
  dAppGetBalance: typeof import('@onekeyfe/cardano-coin-selection-asmjs').dAppUtils.getBalance;
  dAppGetAddresses: typeof import('@onekeyfe/cardano-coin-selection-asmjs').dAppUtils.getAddresses;
  dAppGetUtxos: typeof import('@onekeyfe/cardano-coin-selection-asmjs').dAppUtils.getUtxos;
  dAppConvertCborTxToEncodeTx: typeof import('@onekeyfe/cardano-coin-selection-asmjs').dAppUtils.convertCborTxToEncodeTx;
  dAppSignData: typeof import('@onekeyfe/cardano-coin-selection-asmjs').dAppUtils.signData;
}
