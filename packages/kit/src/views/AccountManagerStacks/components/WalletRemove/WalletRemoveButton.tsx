import { useIntl } from 'react-intl';

import { IconButton } from '@unionkey/components';
import { useAccountSelectorContextData } from '@unionkey/kit/src/states/jotai/contexts/accountSelector';
import type { IDBWallet } from '@unionkey/kit-bg/src/dbs/local/types';
import { ETranslations } from '@unionkey/shared/src/locale';
import accountUtils from '@unionkey/shared/src/utils/accountUtils';

import { showWalletRemoveDialog } from './WalletRemoveDialog';

export function WalletRemoveButton({ wallet }: { wallet?: IDBWallet }) {
  const { config } = useAccountSelectorContextData();
  const intl = useIntl();

  const isHwOrQr =
    accountUtils.isHwWallet({ walletId: wallet?.id }) ||
    accountUtils.isQrWallet({ walletId: wallet?.id });

  function getTitleAndDescription() {
    if (isHwOrQr) {
      if (
        accountUtils.isHwHiddenWallet({
          wallet,
        })
      ) {
        return {
          title: intl.formatMessage({ id: ETranslations.remove_device }),
          description: intl.formatMessage({
            id: ETranslations.remove_hidden_wallet_desc,
          }),
        };
      }
      return {
        title: intl.formatMessage({ id: ETranslations.remove_device }),
        description: intl.formatMessage({
          id: ETranslations.remove_device_desc,
        }),
      };
    }

    return {
      title: intl.formatMessage({ id: ETranslations.remove_wallet }),
      description: intl.formatMessage({ id: ETranslations.remove_wallet_desc }),
    };
  }
  const { title, description } = getTitleAndDescription();

  return (
    <IconButton
      title={intl.formatMessage({ id: ETranslations.global_remove })}
      icon="DeleteOutline"
      variant="tertiary"
      onPress={() => {
        showWalletRemoveDialog({
          config,
          title,
          description,
          showCheckBox: !isHwOrQr,
          defaultChecked: false,
          wallet,
        });
      }}
    />
  );
}
