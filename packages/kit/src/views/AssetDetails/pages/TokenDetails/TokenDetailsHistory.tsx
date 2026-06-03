import { memo, useCallback, useEffect, useState } from 'react';

import { useTabIsRefreshingFocused } from '@unionkey/components';
import backgroundApiProxy from '@unionkey/kit/src/background/instance/backgroundApiProxy';
import { TxHistoryListView } from '@unionkey/kit/src/components/TxHistoryListView';
import useAppNavigation from '@unionkey/kit/src/hooks/useAppNavigation';
import { usePromiseResult } from '@unionkey/kit/src/hooks/usePromiseResult';
import { ProviderJotaiContextHistoryList } from '@unionkey/kit/src/states/jotai/contexts/historyList';
import { useSettingsPersistAtom } from '@unionkey/kit-bg/src/states/jotai/atoms';
import { POLLING_INTERVAL_FOR_HISTORY } from '@unionkey/shared/src/consts/walletConsts';
import {
  EAppEventBusNames,
  appEventBus,
} from '@unionkey/shared/src/eventBus/appEventBus';
import { EModalAssetDetailRoutes } from '@unionkey/shared/src/routes/assetDetails';
import type { IAccountHistoryTx } from '@unionkey/shared/types/history';
import { EDecodedTxStatus } from '@unionkey/shared/types/tx';

import type { IProps } from '.';

function TokenDetailsHistory(props: IProps) {
  const navigation = useAppNavigation();

  const { accountId, networkId, tokenInfo, ListHeaderComponent, isTabView } =
    props;

  const [historyInit, setHistoryInit] = useState(false);
  const { isFocused } = useTabIsRefreshingFocused();
  const [settings] = useSettingsPersistAtom();

  /**
   * since some tokens are slow to load history,
   * they are loaded separately from the token details
   * so as not to block the display of the top details.
   */
  const {
    result: tokenHistory,
    isLoading: isLoadingTokenHistory,
    run,
  } = usePromiseResult(
    async () => {
      const r = await backgroundApiProxy.serviceHistory.fetchAccountHistory({
        accountId,
        networkId,
        tokenIdOnNetwork: tokenInfo.address,
        filterScam: settings.isFilterScamHistoryEnabled,
      });
      setHistoryInit(true);
      return r.txs;
    },
    [
      accountId,
      networkId,
      settings.isFilterScamHistoryEnabled,
      tokenInfo.address,
    ],
    {
      watchLoading: true,
      pollingInterval: POLLING_INTERVAL_FOR_HISTORY,
      overrideIsFocused: (isPageFocused) =>
        isPageFocused && (isTabView ? isFocused : true),
    },
  );

  const handleHistoryItemPress = useCallback(
    async (tx: IAccountHistoryTx) => {
      if (
        tx.decodedTx.status === EDecodedTxStatus.Pending &&
        tx.isLocalCreated
      ) {
        const localTx =
          await backgroundApiProxy.serviceHistory.getLocalHistoryTxById({
            accountId,
            networkId,
            historyId: tx.id,
          });

        // tx has been replaced by another tx
        if (!localTx || localTx.replacedNextId) {
          return;
        }
      }

      navigation.push(EModalAssetDetailRoutes.HistoryDetails, {
        accountId,
        networkId,
        accountAddress:
          await backgroundApiProxy.serviceAccount.getAccountAddressForApi({
            accountId,
            networkId,
          }),
        xpub: await backgroundApiProxy.serviceAccount.getAccountXpub({
          accountId,
          networkId,
        }),
        historyTx: tx,
      });
    },
    [accountId, navigation, networkId],
  );

  useEffect(() => {
    const reloadCallback = () => run({ alwaysSetState: true });
    appEventBus.on(EAppEventBusNames.HistoryTxStatusChanged, reloadCallback);
    return () => {
      appEventBus.off(EAppEventBusNames.HistoryTxStatusChanged, reloadCallback);
    };
  }, [run]);

  return (
    <ProviderJotaiContextHistoryList>
      <TxHistoryListView
        hideValue
        initialized={historyInit}
        isLoading={isLoadingTokenHistory}
        data={tokenHistory ?? []}
        onPressHistory={handleHistoryItemPress}
        ListHeaderComponent={ListHeaderComponent as React.ReactElement}
      />
    </ProviderJotaiContextHistoryList>
  );
}

export default memo(TokenDetailsHistory);
