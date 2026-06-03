import { Dialog, Stack } from '@unionkey/components';
import type { ITutorialsListItem } from '@unionkey/kit/src/components/TutorialsList';
import { TutorialsList } from '@unionkey/kit/src/components/TutorialsList';
import type { IUnionKeyError } from '@unionkey/shared/src/errors/types/errorTypes';
import { EUnionKeyErrorClassNames } from '@unionkey/shared/src/errors/types/errorTypes';
import errorUtils from '@unionkey/shared/src/errors/utils/errorUtils';
import { ETranslations } from '@unionkey/shared/src/locale';
import { appLocale } from '@unionkey/shared/src/locale/appLocale';

function showDialog() {
  const tutorials: ITutorialsListItem[] = [
    {
      title: appLocale.intl.formatMessage({
        id: ETranslations.create_qr_bassed_hidden_wallet_create_standard_wallet_title,
      }),
      description: appLocale.intl.formatMessage({
        id: ETranslations.create_qr_bassed_hidden_wallet_create_standard_wallet_desc,
      }),
    },
    {
      title: appLocale.intl.formatMessage({
        id: ETranslations.create_qr_bassed_hidden_wallet_create_hidden_wallet_title,
      }),
      description: appLocale.intl.formatMessage({
        id: ETranslations.create_qr_bassed_hidden_wallet_create_hidden_wallet_desc,
      }),
    },
  ];
  Dialog.show({
    title: appLocale.intl.formatMessage({
      id: ETranslations.create_qr_based_hidden_wallet_dialog_title,
    }),
    showConfirmButton: false,
    onCancelText: appLocale.intl.formatMessage({
      id: ETranslations.global_close,
    }),
    renderContent: (
      <Stack>
        <TutorialsList tutorials={tutorials} />
      </Stack>
    ),
  });
}

function showDialogIfErrorMatched(error: IUnionKeyError | unknown) {
  if (
    errorUtils.isErrorByClassName({
      error,
      className: [
        EUnionKeyErrorClassNames.UnionKeyErrorAirGapStandardWalletRequiredWhenCreateHiddenWallet,
      ],
    })
  ) {
    showDialog();
  }
}

export default { showDialog, showDialogIfErrorMatched };
