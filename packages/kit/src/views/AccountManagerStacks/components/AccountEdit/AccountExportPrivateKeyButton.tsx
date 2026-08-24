import type { IKeyOfIcons } from '@unionkeyhq/components';
import { ActionList } from '@unionkeyhq/components';
import { ensureSensitiveTextEncoded } from '@unionkeyhq/core/src/secret';
import type { IExportKeyType } from '@unionkeyhq/core/src/types';
import backgroundApiProxy from '@unionkeyhq/kit/src/background/instance/backgroundApiProxy';
import useAppNavigation from '@unionkeyhq/kit/src/hooks/useAppNavigation';
import type {
  IDBAccount,
  IDBIndexedAccount,
  IDBWallet,
} from '@unionkeyhq/kit-bg/src/dbs/local/types';
import {
  EAccountManagerStacksRoutes,
  EModalRoutes,
  EOnboardingPages,
} from '@unionkeyhq/shared/src/routes';

export function AccountExportPrivateKeyButton({
  testID,
  accountName,
  indexedAccount,
  account,
  onClose,
  icon,
  label,
  exportType,
  wallet,
}: {
  testID?: string;
  accountName?: string;
  indexedAccount?: IDBIndexedAccount;
  account?: IDBAccount;
  onClose: () => void;
  icon: IKeyOfIcons;
  label: string;
  exportType: IExportKeyType;
  wallet?: IDBWallet;
}) {
  const navigation = useAppNavigation();

  return (
    <ActionList.Item
      testID={testID}
      icon={icon}
      label={label}
      onClose={onClose}
      onPress={async () => {
        if (
          await backgroundApiProxy.serviceAccount.checkIsWalletNotBackedUp({
            walletId: wallet?.id ?? '',
          })
        ) {
          onClose?.();
          return;
        }

        if (exportType === 'mnemonic') {
          onClose?.();
          const { mnemonic } =
            await backgroundApiProxy.serviceAccount.getTonImportedAccountMnemonic(
              {
                accountId: account?.id ?? '',
              },
            );
          if (mnemonic) ensureSensitiveTextEncoded(mnemonic);
          navigation.pushModal(EModalRoutes.OnboardingModal, {
            screen: EOnboardingPages.BeforeShowRecoveryPhrase,
            params: {
              mnemonic,
              isBackup: true,
              isWalletBackedUp: wallet?.backuped,
            },
          });
          return;
        }
        navigation.pushModal(EModalRoutes.AccountManagerStacks, {
          screen: EAccountManagerStacksRoutes.ExportPrivateKeysPage,
          params: {
            indexedAccount,
            account,
            accountName,
            title: label,
            exportType,
          },
        });
      }}
    />
  );
}
