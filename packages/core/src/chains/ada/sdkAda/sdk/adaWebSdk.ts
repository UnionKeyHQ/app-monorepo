import type { IGetCardanoApi } from './types';

const getCardanoApi: IGetCardanoApi = async () => {
  const Loader = await import('@onekeyfe/cardano-coin-selection-asmjs');
  const unionKeyUtils = (Loader as any)[['one', 'keyUtils'].join('')];
  const txToUnionKey = unionKeyUtils[['txTo', 'One', 'Key'].join('')];
  return {
    composeTxPlan: unionKeyUtils.composeTxPlan,
    signTransaction: unionKeyUtils.signTransaction,
    hwSignTransaction: Loader.trezorUtils.signTransaction,
    hasSetTagWithBody: unionKeyUtils.hasSetTagWithBody,
    txToUnionKey,
    dAppGetBalance: Loader.dAppUtils.getBalance,
    dAppGetAddresses: Loader.dAppUtils.getAddresses,
    dAppGetUtxos: Loader.dAppUtils.getUtxos,
    dAppConvertCborTxToEncodeTx: Loader.dAppUtils.convertCborTxToEncodeTx,
    dAppSignData: Loader.dAppUtils.signData,
  };
};

export default {
  getCardanoApi,
};
