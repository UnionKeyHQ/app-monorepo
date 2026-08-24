import { useCallback } from 'react';

import { useClipboard } from '@unionkeyhq/components';
import { EModalReceiveRoutes, EModalRoutes } from '@unionkeyhq/shared/src/routes';
import accountUtils from '@unionkeyhq/shared/src/utils/accountUtils';
import type { IToken } from '@unionkeyhq/shared/types/token';

import backgroundApiProxy from '../background/instance/backgroundApiProxy';

import useAppNavigation from './useAppNavigation';

export const useCopyAccountAddress = () => {
  const appNavigation = useAppNavigation();
  const { copyText } = useClipboard();
  return useCallback(
    async ({
      accountId,
      networkId,
      token,
    }: {
      accountId: string;
      networkId: string;
      token?: IToken;
    }) => {
      if (
        accountUtils.isHwAccount({ accountId }) ||
        accountUtils.isQrAccount({ accountId })
      ) {
        const walletId = accountUtils.getWalletIdFromAccountId({ accountId });
        appNavigation.pushModal(EModalRoutes.ReceiveModal, {
          screen: EModalReceiveRoutes.ReceiveToken,
          params: {
            networkId,
            accountId,
            walletId,
            token,
          },
        });
      } else {
        const account = await backgroundApiProxy.serviceAccount.getAccount({
          accountId,
          networkId,
        });
        copyText(account.address);
      }
    },
    [appNavigation, copyText],
  );
};
