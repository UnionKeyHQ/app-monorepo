import { useIntl } from 'react-intl';

import { AccountSelectorProviderMirror } from '@unionkeyhq/kit/src/components/AccountSelector';
import useAppNavigation from '@unionkeyhq/kit/src/hooks/useAppNavigation';
import type { IDBWallet } from '@unionkeyhq/kit-bg/src/dbs/local/types';
import { ETranslations } from '@unionkeyhq/shared/src/locale';
import {
  EModalDeviceManagementRoutes,
  EModalRoutes,
} from '@unionkeyhq/shared/src/routes';
import { EAccountSelectorSceneName } from '@unionkeyhq/shared/types';

import { WalletOptionItem } from './WalletOptionItem';

function DeviceManagementButtonView({
  wallet,
}: {
  wallet: IDBWallet | undefined;
}) {
  const intl = useIntl();
  const navigation = useAppNavigation();

  return (
    <WalletOptionItem
      testID="account-device-management-details"
      icon="StorageOutline"
      label={intl.formatMessage({ id: ETranslations.global_device_management })}
      onPress={async () => {
        navigation.pushModal(EModalRoutes.DeviceManagementModal, {
          screen: EModalDeviceManagementRoutes.DeviceDetailModal,
          params: {
            walletId: wallet?.id || '',
          },
        });
      }}
    />
  );
}

export function DeviceManagementButton({
  wallet,
}: {
  wallet: IDBWallet | undefined;
}) {
  return (
    <AccountSelectorProviderMirror
      config={{
        sceneName: EAccountSelectorSceneName.home,
      }}
      enabledNum={[0]}
    >
      <DeviceManagementButtonView wallet={wallet} />
    </AccountSelectorProviderMirror>
  );
}
