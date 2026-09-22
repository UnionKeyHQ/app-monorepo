import { useRoute } from '@react-navigation/core';

import type { IUnsignedMessageBtc } from '@unionkeyhq/engine/src/vaults/impl/btc/types';
import type { IUnsignedMessageEvm } from '@unionkeyhq/engine/src/vaults/impl/evm/Vault';
import type { LNURLDetails } from '@unionkeyhq/engine/src/vaults/impl/lightning-network/types/lnurl';
import type { IEncodedTx } from '@unionkeyhq/engine/src/vaults/types';
import debugLogger from '@unionkeyhq/shared/src/logger/debugLogger';
import type { IDappSourceInfo } from '@unionkeyhq/shared/types';

export type IDappSignAndSendParams = {
  unsignedMessage?: IUnsignedMessageEvm | IUnsignedMessageBtc;
  encodedTx?: IEncodedTx;
  signOnly?: boolean;
  _$t?: number;
  // Support cosmos dapp
  networkId?: string;
  // Support webln
  walletId?: string;
  accountId?: string;
  lnurlDetails?: LNURLDetails;
};

export type IDappInscribeTransferParams = {
  ticker?: string;
  amount?: string;
};

export type IDappConnectionParams = {
  networkId?: string;
  accountIdentify?: string;
};

// TODO rename useDappQuery
function useDappParams() {
  const route = useRoute();
  const query = (route.params as { query: string })?.query ?? '';
  let queryInfo: {
    sourceInfo?: IDappSourceInfo;
  } & IDappSignAndSendParams &
    IDappInscribeTransferParams = {};

  try {
    if (query) {
      queryInfo = JSON.parse(query);
    }
    debugLogger.sendTx.info('useDappParams:', queryInfo);
  } catch (error) {
    debugLogger.sendTx.info('useDappParams:', query);
    console.error(`parse dapp query error: ${query}`);
  }

  return queryInfo;
}

export default useDappParams;
