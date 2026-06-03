import { useCallback } from 'react';

import { useIntl } from 'react-intl';

import { Page, YStack } from '@unionkey/components';
import { ListItem } from '@unionkey/kit/src/components/ListItem';
import { getNetworkIdsMap } from '@unionkey/shared/src/config/networkIds';
import { IMPL_EVM } from '@unionkey/shared/src/engine/engineConsts';
import { ETranslations } from '@unionkey/shared/src/locale';
import type { IOnboardingParamList } from '@unionkey/shared/src/routes';
import { EOnboardingPages } from '@unionkey/shared/src/routes';

import { NetworkAvatarGroup } from '../../../components/NetworkAvatar';
import useAppNavigation from '../../../hooks/useAppNavigation';

export function ConnectWalletSelectNetworksPage() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { btc, eth, cosmoshub, bsc, polygon, avalanche, sol } =
    getNetworkIdsMap();
  const intl = useIntl();

  const navigation = useAppNavigation();

  const handlePress = useCallback(
    (params: IOnboardingParamList[EOnboardingPages.ConnectWallet]) => {
      console.log('handleAddExternalAccount');
      navigation.push(EOnboardingPages.ConnectWallet, params);
    },
    [navigation],
  );

  return (
    <Page scrollEnabled>
      <Page.Header
        title={intl.formatMessage({ id: ETranslations.global_select_network })}
      />
      <Page.Body>
        <YStack>
          {/* <ListItem
            title={intl.formatMessage({
              id: ETranslations.global_multi_networks,
            })}
            drillIn
            renderIcon={() => (
              <NetworkAvatarGroup networkIds={[btc, eth, sol]} />
            )}
            onPress={() =>
              handlePress({
                impl: undefined,
                title: 'Multi-networks',
              })
            }
          /> */}
          <ListItem
            title="EVM"
            drillIn
            renderIcon={() => (
              <NetworkAvatarGroup networkIds={[eth, bsc, avalanche]} />
            )}
            onPress={() =>
              handlePress({
                impl: IMPL_EVM,
                title: 'EVM',
              })
            }
          />
        </YStack>
      </Page.Body>
    </Page>
  );
}

export default ConnectWalletSelectNetworksPage;
