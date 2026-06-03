import { useCallback, useState } from 'react';

import { useIntl } from 'react-intl';

import type { ICheckedState } from '@unionkey/components';
import { Checkbox, Dialog, Toast } from '@unionkey/components';
import { AccountSelectorProviderMirror } from '@unionkey/kit/src/components/AccountSelector';
import type { IAccountSelectorContextData } from '@unionkey/kit/src/states/jotai/contexts/accountSelector';
import { useAccountSelectorActions } from '@unionkey/kit/src/states/jotai/contexts/accountSelector';
import type { IDBWallet } from '@unionkey/kit-bg/src/dbs/local/types';
import { ETranslations } from '@unionkey/shared/src/locale';
import { defaultLogger } from '@unionkey/shared/src/logger/logger';

export function WalletRemoveDialog({
  defaultValue,
  wallet,
  showCheckBox,
}: {
  defaultValue: boolean;
  wallet?: IDBWallet;
  showCheckBox: boolean;
}) {
  const intl = useIntl();
  const [value, changeValue] = useState(defaultValue);
  const handleChange = useCallback((checked: ICheckedState) => {
    changeValue(!!checked);
  }, []);
  const actions = useAccountSelectorActions();
  return (
    <>
      {showCheckBox ? (
        <Checkbox
          value={value}
          onChange={handleChange}
          label={intl.formatMessage({
            id: ETranslations.remove_wallet_double_confirm_message,
          })}
        />
      ) : null}
      <Dialog.Footer
        onConfirmText={intl.formatMessage({ id: ETranslations.global_remove })}
        confirmButtonProps={{
          disabled: showCheckBox && !value,
          variant: 'destructive',
        }}
        onConfirm={async () => {
          await actions.current.removeWallet({
            walletId: wallet?.id || '',
          });
          defaultLogger.account.wallet.deleteWallet();
          Toast.success({
            title: intl.formatMessage({
              id: ETranslations.feedback_change_saved,
            }),
          });
        }}
      />
    </>
  );
}

export function showWalletRemoveDialog({
  title,
  description,
  defaultChecked,
  wallet,
  config,
  showCheckBox,
}: {
  defaultChecked: boolean;
  title: string;
  description: string;
  wallet?: IDBWallet;
  config: IAccountSelectorContextData | undefined;
  showCheckBox: boolean;
}) {
  return Dialog.show({
    icon: 'ErrorOutline',
    tone: 'destructive',
    title,
    description,
    renderContent: config ? (
      <AccountSelectorProviderMirror enabledNum={[0]} config={config}>
        <WalletRemoveDialog
          wallet={wallet}
          defaultValue={defaultChecked}
          showCheckBox={showCheckBox}
        />
      </AccountSelectorProviderMirror>
    ) : null,
  });
}
