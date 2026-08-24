import type { IDialogShowProps } from '@unionkeyhq/components';
import { Dialog } from '@unionkeyhq/components';
import { appLocale } from '@unionkeyhq/shared/src/locale/appLocale';
import { ETranslations } from '@unionkeyhq/shared/src/locale/enum/translations';

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
