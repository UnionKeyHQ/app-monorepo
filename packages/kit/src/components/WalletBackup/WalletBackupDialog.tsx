import type { IDialogShowProps } from '@unionkey/components';
import { Button, Dialog, XStack, YStack } from '@unionkey/components';
import type { IDBWallet } from '@unionkey/kit-bg/src/dbs/local/types';
import { ETranslations } from '@unionkey/shared/src/locale';
import { appLocale } from '@unionkey/shared/src/locale/appLocale';

import { WalletBackupActions } from './WalletBackupActions';

export const showWalletBackupDialog = ({
  wallet,
  ...dialogProps
}: IDialogShowProps & {
  wallet: IDBWallet | undefined;
}) => {
  const dialog = Dialog.show({
    title: appLocale.intl.formatMessage({
      id: ETranslations.wallet_backup_prompt,
    }),
    description: appLocale.intl.formatMessage({
      id: ETranslations.wallet_backup_backup_reminder,
    }),
    icon: 'ErrorOutline',
    tone: 'destructive',
    renderContent: (
      <XStack gap="$2.5">
        <Button
          size="medium"
          variant="secondary"
          onPress={() => dialog.close()}
          flexGrow={1}
          flexShrink={0}
        >
          {appLocale.intl.formatMessage({
            id: ETranslations.global_cancel,
          })}
        </Button>
        <YStack flexGrow={1} flexShrink={0}>
          <WalletBackupActions
            wallet={wallet}
            onSelected={() => dialog.close()}
          >
            <Button size="medium" variant="primary">
              {appLocale.intl.formatMessage({
                id: ETranslations.global_backup,
              })}
            </Button>
          </WalletBackupActions>
        </YStack>
      </XStack>
    ),
    showFooter: false,

    ...dialogProps,
  });
};
