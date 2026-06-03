import { useCallback } from 'react';

import { useIntl } from 'react-intl';

import { Dialog, Toast } from '@unionkey/components';
import { ETranslations } from '@unionkey/shared/src/locale';
import platformEnv from '@unionkey/shared/src/platformEnv';

import backgroundApiProxy from '../../../background/instance/backgroundApiProxy';
import { LazyLoadPage } from '../../../components/LazyLoadPage';
import { useLoginUnionKeyId } from '../../../hooks/useLoginUnionKeyId';

import { getPrimePaymentApiKey } from './getPrimePaymentApiKey';
import { usePrimeAuthV2 } from './usePrimeAuthV2';

const PrimePurchaseDialog = LazyLoadPage(
  () => import('../components/PrimePurchaseDialog/PrimePurchaseDialog'),
  100,
  true,
);

export function usePrimeRequirements() {
  const { user, isLoggedIn, logout } = usePrimeAuthV2();
  const { loginUnionKeyId } = useLoginUnionKeyId();

  const intl = useIntl();
  const ensureUnionKeyIDLoggedIn = useCallback(
    async ({
      skipDialogConfirm,
    }: {
      skipDialogConfirm?: boolean;
    } = {}) => {
      const isLoggedInInBackground: boolean =
        await backgroundApiProxy.servicePrime.isLoggedIn();
      if (!isLoggedInInBackground || !isLoggedIn) {
        // logout before login, make sure local privy cache is cleared
        void logout();

        const onConfirm = async () => {
          await loginUnionKeyId();
        };
        if (!skipDialogConfirm) {
          const dialog = Dialog.show({
            title: intl.formatMessage({
              id: ETranslations.prime_not_logged_in_title,
            }),
            description: intl.formatMessage({
              id: ETranslations.prime_not_logged_in_description,
            }),
            onConfirmText: intl.formatMessage({
              id: ETranslations.global_continue,
            }),
            onConfirm: async () => {
              await dialog.close();
              await onConfirm();
            },
          });
        } else {
          await onConfirm();
        }
        throw new Error('Prime is not logged in');
      }
    },
    [isLoggedIn, logout, intl, loginUnionKeyId],
  );

  const ensurePrimeSubscriptionActive = useCallback(
    async ({
      skipDialogConfirm,
    }: {
      skipDialogConfirm?: boolean;
    } = {}) => {
      await ensureUnionKeyIDLoggedIn({
        skipDialogConfirm,
      });
      const isPrimeSubscriptionActive: boolean =
        await backgroundApiProxy.servicePrime.isPrimeSubscriptionActive();
      if (!isPrimeSubscriptionActive) {
        const onConfirm = async () => {
          const { isSandboxKey } = await getPrimePaymentApiKey({
            apiKeyType: 'web',
          });
          if (
            platformEnv.isRuntimeBrowser &&
            isSandboxKey &&
            !user.isEnableSandboxPay
          ) {
            Toast.error({
              title: 'Your account is not eligible for sandbox payment',
            });
          }
          const purchaseDialog = Dialog.show({
            renderContent: (
              <PrimePurchaseDialog
                onPurchase={() => {
                  void purchaseDialog.close();
                }}
              />
            ),
          });
        };
        if (!skipDialogConfirm) {
          const dialog = Dialog.show({
            title: intl.formatMessage({
              id: ETranslations.prime_not_subscribed_title,
            }),
            description: intl.formatMessage({
              id: ETranslations.prime_not_subscribed_description,
            }),
            onConfirmText: intl.formatMessage({
              id: ETranslations.global_continue,
            }),
            onConfirm: async () => {
              await dialog.close();
              await onConfirm();
            },
          });
        } else {
          await onConfirm();
        }
        throw new Error('Prime subscription is not active');
      }
    },
    [ensureUnionKeyIDLoggedIn, intl, user.isEnableSandboxPay],
  );

  return {
    ensureUnionKeyIDLoggedIn,
    ensurePrimeSubscriptionActive,
  };
}
