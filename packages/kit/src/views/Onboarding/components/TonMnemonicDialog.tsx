import type { IDialogShowProps } from '@unionkey/components';
import { Dialog } from '@unionkey/components';
import { appLocale } from '@unionkey/shared/src/locale/appLocale';
import { ETranslations } from '@unionkey/shared/src/locale/enum/translations';

export function showTonMnemonicDialog({ onConfirm }: IDialogShowProps) {
  Dialog.show({
    showExitButton: false,
    dismissOnOverlayPress: false,
    onConfirm,
    icon: 'LightBulbOutline',
    title: appLocale.intl.formatMessage({
      id: ETranslations.global_import_ton,
    }),
    description: appLocale.intl.formatMessage({
      id: ETranslations.global_import_ton_desc,
    }),
  });
}
