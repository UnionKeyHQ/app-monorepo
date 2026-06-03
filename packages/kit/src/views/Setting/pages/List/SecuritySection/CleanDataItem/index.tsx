import { useCallback } from 'react';

import { useIntl } from 'react-intl';

import type { IPageNavigationProp } from '@unionkey/components';
import { ActionList, Dialog, Toast } from '@unionkey/components';
import backgroundApiProxy from '@unionkey/kit/src/background/instance/backgroundApiProxy';
import { ListItem } from '@unionkey/kit/src/components/ListItem';
import useAppNavigation from '@unionkey/kit/src/hooks/useAppNavigation';
import { useResetApp } from '@unionkey/kit/src/views/Setting/hooks';
import {
  EAppEventBusNames,
  appEventBus,
} from '@unionkey/shared/src/eventBus/appEventBus';
import { ETranslations } from '@unionkey/shared/src/locale';
import { EModalSettingRoutes } from '@unionkey/shared/src/routes';
import type { IModalSettingParamList } from '@unionkey/shared/src/routes';

export const CleanDataItem = () => {
  const intl = useIntl();
  const resetApp = useResetApp();
  const navigation =
    useAppNavigation<IPageNavigationProp<IModalSettingParamList>>();
  const toSettingClearAppCachePage = useCallback(() => {
    navigation.push(EModalSettingRoutes.SettingClearAppCache);
  }, [navigation]);
  return (
    <ActionList
      offset={{ mainAxis: -4, crossAxis: -10 }}
      title={intl.formatMessage({ id: ETranslations.settings_clear_data })}
      renderTrigger={
        <ListItem
          title={intl.formatMessage({ id: ETranslations.settings_clear_data })}
          icon="FolderDeleteOutline"
          testID="setting-clear-data"
        >
          <ListItem.DrillIn name="ChevronDownSmallOutline" />
        </ListItem>
      }
      items={[
        {
          label: intl.formatMessage({
            id: ETranslations.settings_clear_cache_on_app,
          }),
          onPress: toSettingClearAppCachePage,
        },
        {
          label: intl.formatMessage({
            id: ETranslations.settings_clear_pending_transactions,
          }),
          onPress: () => {
            Dialog.show({
              title: intl.formatMessage({
                id: ETranslations.settings_clear_pending_transactions,
              }),
              description: intl.formatMessage({
                id: ETranslations.settings_clear_pending_transactions_desc,
              }),
              tone: 'destructive',
              onConfirmText: intl.formatMessage({
                id: ETranslations.global_clear,
              }),
              onConfirm: async () => {
                await backgroundApiProxy.serviceSetting.clearPendingTransaction();
                appEventBus.emit(
                  EAppEventBusNames.ClearLocalHistoryPendingTxs,
                  undefined,
                );
                Toast.success({
                  title: intl.formatMessage({
                    id: ETranslations.global_success,
                  }),
                });
              },
            });
          },
        },
        {
          label: intl.formatMessage({ id: ETranslations.settings_reset_app }),
          destructive: true,
          onPress: resetApp,
          testID: 'setting-erase-data',
        },
      ]}
    />
  );
};
