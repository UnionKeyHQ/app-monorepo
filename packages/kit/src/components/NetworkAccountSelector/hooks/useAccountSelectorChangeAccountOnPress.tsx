import { useCallback } from 'react';

import { useIsVerticalLayout } from '@unionkeyhq/components';
import useModalClose from '@unionkeyhq/components/src/Modal/Container/useModalClose';
import {
  AppUIEventBusNames,
  appUIEventBus,
} from '@unionkeyhq/shared/src/eventBus/appUIEventBus';
import debugLogger from '@unionkeyhq/shared/src/logger/debugLogger';

import backgroundApiProxy from '../../../background/instance/backgroundApiProxy';
import { useNavigationActions } from '../../../hooks';
import useAppNavigation from '../../../hooks/useAppNavigation';
import {
  ModalRoutes,
  RootRoutes,
  SendModalRoutes,
} from '../../../routes/routesEnum';
import reducerAccountSelector, {
  EAccountSelectorMode,
} from '../../../store/reducers/reducerAccountSelector';
import { wait } from '../../../utils/helper';
import { ACCOUNT_SELECTOR_CHANGE_ACCOUNT_CLOSE_DRAWER_DELAY } from '../consts';

const { updateIsRefreshDisabled } = reducerAccountSelector.actions;

export function useAccountSelectorChangeAccountOnPress() {
  const closeModal = useModalClose();
  const { closeWalletSelector } = useNavigationActions();
  const navigation = useAppNavigation();
  const isVertical = useIsVerticalLayout();

  const onPressChangeAccount = useCallback(
    async ({
      accountId,
      networkId,
      walletId,
      accountSelectorMode,
    }: {
      accountId?: string;
      networkId?: string;
      walletId?: string;
      accountSelectorMode: EAccountSelectorMode;
    }) => {
      const {
        dispatch,
        serviceNetwork,
        serviceAccount,
        serviceAccountSelector,
      } = backgroundApiProxy;

      closeModal();
      closeWalletSelector();
      await wait(0);

      if (accountSelectorMode === EAccountSelectorMode.Transfer) {
        navigation.navigate(RootRoutes.Modal, {
          screen: ModalRoutes.Send,
          params: {
            screen: SendModalRoutes.PreSendToken,
            params: {
              accountId: accountId || '',
              networkId: networkId || '',
              from: '',
              to: '',
              amount: '',
            },
          },
        });
        return;
      }
      if (accountSelectorMode === EAccountSelectorMode.Wallet) {
        dispatch(updateIsRefreshDisabled(true));

        try {
          if (isVertical) {
            await wait(ACCOUNT_SELECTOR_CHANGE_ACCOUNT_CLOSE_DRAWER_DELAY);
          }
          if (networkId) {
            await serviceNetwork.changeActiveNetwork(networkId);
          }
          if (accountId) {
            await serviceAccount.changeActiveAccount({
              accountId: accountId || '',
              walletId: walletId ?? '',
            });
          }
          await serviceAccountSelector.setSelectedWalletToActive();
          appUIEventBus.emit(AppUIEventBusNames.AccountChanged);
        } catch (error) {
          debugLogger.common.error('onPressChangeAccount ERROR: ', error);
        } finally {
          await wait(100);
          dispatch(updateIsRefreshDisabled(false));
        }
      }
    },
    [closeModal, closeWalletSelector, isVertical, navigation],
  );

  return { onPressChangeAccount };
}
