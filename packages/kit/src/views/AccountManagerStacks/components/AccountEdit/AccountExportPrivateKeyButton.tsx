import type { IKeyOfIcons } from '@unionkey/components';
import { ActionList } from '@unionkey/components';
import { ensureSensitiveTextEncoded } from '@unionkey/core/src/secret';
import type { IExportKeyType } from '@unionkey/core/src/types';
import backgroundApiProxy from '@unionkey/kit/src/background/instance/backgroundApiProxy';
import useAppNavigation from '@unionkey/kit/src/hooks/useAppNavigation';
import type {
  IDBAccount,
  IDBIndexedAccount,
  IDBWallet,
} from '@unionkey/kit-bg/src/dbs/local/types';
import {
  EAccountManagerStacksRoutes,
  EModalRoutes,
  EOnboardingPages,
} from '@unionkey/shared/src/routes';

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
