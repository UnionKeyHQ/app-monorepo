import { Toast } from '@unionkey/components';
import { ETranslations } from '@unionkey/shared/src/locale';
import { appLocale } from '@unionkey/shared/src/locale/appLocale';
import accountUtils from '@unionkey/shared/src/utils/accountUtils';

function toastSuccessWhenImportAddressOrPrivateKey({
  isOverrideAccounts,
  accountId,
}: {
  isOverrideAccounts: boolean;
  accountId: string;
}) {
  if (accountId) {
    if (
      isOverrideAccounts &&
      !accountUtils.isUrlAccountFn({
        accountId,
      })
    ) {
      Toast.success({
        title: appLocale.intl.formatMessage({
          id: ETranslations.feedback_wallet_exists_title,
        }),
        message: appLocale.intl.formatMessage({
          id: ETranslations.feedback_wallet_exists_desc,
        }),
      });
    } else {
      Toast.success({
        title: appLocale.intl.formatMessage({
          id: ETranslations.global_success,
        }),
      });
    }
  }
}

export default {
  toastSuccessWhenImportAddressOrPrivateKey,
};
