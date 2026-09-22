import { useEffect, useState } from 'react';

import simpleDb from '@unionkeyhq/engine/src/dbs/simple/simpleDb';
import type { CoinControlItem } from '@unionkeyhq/engine/src/types/utxoAccounts';
import {
  getTaprootXpub,
  isTaprootXpubSegwit,
} from '@unionkeyhq/engine/src/vaults/utils/btcForkChain/utils';

function useCoinControlList({
  xpub,
  networkId,
}: {
  xpub: string | undefined;
  networkId: string | undefined;
}) {
  const [frozenUtxos, setFrozenUtxos] = useState<CoinControlItem[]>([]);
  const [recycleUtxos, setRecycleUtxos] = useState<CoinControlItem[]>([]);

  useEffect(() => {
    const fetchCoinControlList = async () => {
      if (xpub && networkId) {
        const archivedUtxos = await simpleDb.utxoAccounts.getCoinControlList(
          networkId,
          isTaprootXpubSegwit(xpub ?? '')
            ? getTaprootXpub(xpub ?? '')
            : xpub ?? '',
        );
        setFrozenUtxos(archivedUtxos.filter((utxo) => utxo.frozen));
        setRecycleUtxos(archivedUtxos.filter((utxo) => utxo.recycle));
      }
    };
    fetchCoinControlList();
  });

  return {
    frozenUtxos,
    recycleUtxos,
  };
}

export { useCoinControlList };
