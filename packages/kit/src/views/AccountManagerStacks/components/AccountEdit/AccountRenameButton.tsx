import { useCallback } from 'react';

import { useIntl } from 'react-intl';

import { ActionList } from '@unionkey/components';
import backgroundApiProxy from '@unionkey/kit/src/background/instance/backgroundApiProxy';
import { showRenameDialog } from '@unionkey/kit/src/components/RenameDialog';
import type {
  IDBAccount,
  IDBIndexedAccount,
  IDBWallet,
} from '@unionkey/kit-bg/src/dbs/local/types';
import { ETranslations } from '@unionkey/shared/src/locale';
import {
  EChangeHistoryContentType,
  EChangeHistoryEntityType,
} from '@unionkey/shared/src/types/changeHistory';
import accountUtils from '@unionkey/shared/src/utils/accountUtils';

import { showUpdateHardwareWalletLegacyXfpDialog } from '../../../Home/components/WalletXfpStatusReminder/WalletXfpStatusReminder';

export function AccountRenameButton({
  name,
  wallet,
  indexedAccount,
  account,
  onClose,
}: {
  name: string;
  wallet: IDBWallet | undefined;
  indexedAccount?: IDBIndexedAccount;
  account?: IDBAccount;
  onClose: () => void;
}) {
  const intl = useIntl();
  const { serviceAccount } = backgroundApiProxy;

  const callShowRenameDialog = useCallback(() => {
    showRenameDialog(name, {
      disabledMaxLengthLabel: true,
      indexedAccount,
      nameHistoryInfo: {
        entityId: indexedAccount?.id || account?.id || '',
        entityType: indexedAccount?.id
          ? EChangeHistoryEntityType.IndexedAccount
          : EChangeHistoryEntityType.Account,
        contentType: EChangeHistoryContentType.Name,
      },
      onSubmit: async (newName) => {
        if (indexedAccount?.id && newName) {
          const walletNew = await serviceAccount.getWalletSafe({
            walletId: wallet?.id || '',
          });
          await serviceAccount.setUniversalIndexedAccountName({
            indexedAccountId: indexedAccount?.id,
            index: indexedAccount?.index,
            walletXfp: walletNew?.xfp,
            name: newName,
            shouldCheckDuplicate: true,
          });
        } else if (account?.id && newName) {
          await serviceAccount.setAccountName({
            accountId: account?.id,
            name: newName,
            shouldCheckDuplicate: true,
          });
        }
      },
    });
  }, [account?.id, indexedAccount, name, serviceAccount, wallet?.id]);

  return (
    <ActionList.Item
      icon="PencilOutline"
      label={intl.formatMessage({ id: ETranslations.global_rename })}
      onClose={onClose}
      onPress={() => {
        if (indexedAccount?.id) {
          void (async () => {
            const isHwWallet = accountUtils.isHwWallet({
              walletId: wallet?.id,
            });
            const isQrWallet = accountUtils.isQrWallet({
              walletId: wallet?.id,
            });
            await serviceAccount.generateWalletsMissingMetaSilently({
              walletId: wallet?.id || '',
            });
            if (!isHwWallet || isQrWallet) {
              // prompt password verify
              await serviceAccount.generateWalletsMissingMetaWithUserInteraction(
                {
                  walletId: wallet?.id || '',
                },
              );
              callShowRenameDialog();
            } else if (isHwWallet) {
              await showUpdateHardwareWalletLegacyXfpDialog({
                walletId: wallet?.id || '',
                onConfirm: () => {
                  callShowRenameDialog();
                },
              });
            }
          })();
        } else {
          callShowRenameDialog();
        }
      }}
    />
  );
}
