import { useIntl } from 'react-intl';

import backgroundApiProxy from '@unionkey/kit/src/background/instance/backgroundApiProxy';
import { AccountSelectorProviderMirror } from '@unionkey/kit/src/components/AccountSelector';
import useAppNavigation from '@unionkey/kit/src/hooks/useAppNavigation';
import { useActiveAccount } from '@unionkey/kit/src/states/jotai/contexts/accountSelector';
import type { IDBWallet } from '@unionkey/kit-bg/src/dbs/local/types';
import { ETranslations } from '@unionkey/shared/src/locale';
import {
  EAccountManagerStacksRoutes,
  EModalRoutes,
} from '@unionkey/shared/src/routes';
import networkUtils from '@unionkey/shared/src/utils/networkUtils';
import { EAccountSelectorSceneName } from '@unionkey/shared/types';

import { WalletOptionItem } from './WalletOptionItem';

function BatchCreateAccountButtonView({
  wallet,
}: {
  wallet: IDBWallet | undefined;
}) {
  const intl = useIntl();
  const navigation = useAppNavigation();
  const { activeAccount } = useActiveAccount({ num: 0 });

  return (
    <WalletOptionItem
      testID="account-batch-add-account"
      icon="Back10Outline"
      label={intl.formatMessage({ id: ETranslations.global_bulk_add_accounts })}
      onPress={async () => {
        await backgroundApiProxy.serviceAccount.generateWalletsMissingMetaWithUserInteraction(
          {
            walletId: wallet?.id || '',
          },
        );
        await backgroundApiProxy.serviceBatchCreateAccount.prepareBatchCreate();
        navigation.pushModal(EModalRoutes.AccountManagerStacks, {
          screen: EAccountManagerStacksRoutes.BatchCreateAccountPreview,
          params: {
            walletId: wallet?.id || '',
            networkId: networkUtils.toNetworkIdFallback({
              networkId: activeAccount?.network?.id,
            }),
          },
        });
      }}
    />
  );
}

export function BatchCreateAccountButton({
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
      <BatchCreateAccountButtonView wallet={wallet} />
    </AccountSelectorProviderMirror>
  );
}
