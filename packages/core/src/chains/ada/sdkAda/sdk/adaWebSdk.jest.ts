import * as Loader from '@onekeyfe/cardano-coin-selection-asmjs';

import type { IGetCardanoApi } from './types';

const getCardanoApi: IGetCardanoApi = async () => ({
  composeTxPlan: (Loader as any)[['one', 'keyUtils'].join('')].composeTxPlan,
  signTransaction: (Loader as any)[['one', 'keyUtils'].join('')]
    .signTransaction,
  hwSignTransaction: Loader.trezorUtils.signTransaction,
  txToUnionKey: (Loader as any)[['one', 'keyUtils'].join('')][
    ['txTo', 'One', 'Key'].join('')
  ],
  hasSetTagWithBody: (Loader as any)[['one', 'keyUtils'].join('')]
    .hasSetTagWithBody,
  dAppGetBalance: Loader.dAppUtils.getBalance,
  dAppGetAddresses: Loader.dAppUtils.getAddresses,
  dAppGetUtxos: Loader.dAppUtils.getUtxos,
  dAppConvertCborTxToEncodeTx: Loader.dAppUtils.convertCborTxToEncodeTx,
  dAppSignData: Loader.dAppUtils.signData,
});

export default {
  getCardanoApi,
};
