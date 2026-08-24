import type { ComponentProps } from 'react';
import { useCallback } from 'react';

import { useIntl } from 'react-intl';

import type { IKeyOfIcons } from '@unionkeyhq/components';
import { ActionList } from '@unionkeyhq/components';
import { ensureSensitiveTextEncoded } from '@unionkeyhq/core/src/secret';
import backgroundApiProxy from '@unionkeyhq/kit/src/background/instance/backgroundApiProxy';
import useAppNavigation from '@unionkeyhq/kit/src/hooks/useAppNavigation';
import useLiteCard from '@unionkeyhq/kit/src/views/LiteCard/hooks/useLiteCard';
import type { IDBWallet } from '@unionkeyhq/kit-bg/src/dbs/local/types';
import { ETranslations } from '@unionkeyhq/shared/src/locale';
import { defaultLogger } from '@unionkeyhq/shared/src/logger/logger';
import platformEnv from '@unionkeyhq/shared/src/platformEnv';
import {
  EModalKeyTagRoutes,
  EModalRoutes,
  EOnboardingPages,
} from '@unionkeyhq/shared/src/routes';
import { EReasonForNeedPassword } from '@unionkeyhq/shared/types/setting';

export function WalletBackupActions({
  wallet,
  children,
  onSelected,
  actionListProps,
}: {
  wallet: IDBWallet | undefined;
  children: React.ReactNode;
  onSelected?: () => void;
  actionListProps?: Partial<ComponentProps<typeof ActionList>>;
}) {
  const navigation = useAppNavigation();
  const intl = useIntl();

  const liteCard = useLiteCard();

  const handleBackupPhrase = useCallback(async () => {
    if (!wallet?.id) {
      return;
    }
    const { mnemonic } =
      await backgroundApiProxy.serviceAccount.getHDAccountMnemonic({
        walletId: wallet?.id,
        reason: EReasonForNeedPassword.Security,
      });
    if (mnemonic) ensureSensitiveTextEncoded(mnemonic);
    navigation.pushModal(EModalRoutes.OnboardingModal, {
      screen: EOnboardingPages.BeforeShowRecoveryPhrase,
      params: {
        mnemonic,
        isBackup: true,
        isWalletBackedUp: wallet.backuped,
        walletId: wallet.id,
      },
    });

    defaultLogger.account.wallet.backupWallet('manualBackup');
    onSelected?.();
  }, [navigation, wallet?.id, wallet?.backuped, onSelected]);

  const handleBackupLiteCard = useCallback(async () => {
    onSelected?.();
    await liteCard.backupWallet(wallet?.id);

    defaultLogger.account.wallet.backupWallet('liteCard');
  }, [onSelected, liteCard, wallet?.id]);

  const handleBackupKeyTag = useCallback(async () => {
    if (wallet) {
      const { mnemonic: encodedText } =
        await backgroundApiProxy.serviceAccount.getHDAccountMnemonic({
          walletId: wallet.id,
          reason: EReasonForNeedPassword.Security,
        });
      if (encodedText) ensureSensitiveTextEncoded(encodedText);
      navigation.pushModal(EModalRoutes.KeyTagModal, {
        screen: EModalKeyTagRoutes.BackupDotMap,
        params: {
          wallet,
          encodedText,
          title: wallet.name,
        },
      });
      defaultLogger.account.wallet.backupWallet('keyTag');
      onSelected?.();
    }
  }, [navigation, wallet, onSelected]);

  return (
    <ActionList
      placement="bottom-start"
      title={intl.formatMessage({ id: ETranslations.global_backup })}
      items={[
        {
          label: intl.formatMessage({
            id: ETranslations.manual_backup,
          }),
          icon: 'SignatureOutline' as IKeyOfIcons,
          onPress: () => void handleBackupPhrase(),
        },
        // platformEnv.isNative && {
        //   label: intl.formatMessage({
        //     id: ETranslations.global_unionkey_lite,
        //   }),
        //   icon: 'UnionKeyLiteOutline' as IKeyOfIcons,
        //   onPress: () => void handleBackupLiteCard(),
        // },
        {
          label: intl.formatMessage({
            id: ETranslations.global_unionkey_keytag,
          }),
          icon: 'UnionKeyKeytagOutline' as IKeyOfIcons,
          onPress: () => void handleBackupKeyTag(),
        },
      ].filter(Boolean)}
      renderTrigger={children}
      {...actionListProps}
    />
  );
}
