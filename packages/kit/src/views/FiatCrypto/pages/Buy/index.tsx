import { useRoute } from '@react-navigation/core';
import { useIntl } from 'react-intl';

import { AccountSelectorProviderMirror } from '@unionkey/kit/src/components/AccountSelector';
import { ETranslations } from '@unionkey/shared/src/locale';
import type {
  EModalFiatCryptoRoutes,
  IModalFiatCryptoParamList,
} from '@unionkey/shared/src/routes';
import { EAccountSelectorSceneName } from '@unionkey/shared/types';

import { HomeTokenListProviderMirror } from '../../../Home/components/HomeTokenListProvider/HomeTokenListProviderMirror';
import SellOrBuy from '../../components/SellOrBuy';
import { TokenDataContainer } from '../../components/TokenDataContainer';

import type { RouteProp } from '@react-navigation/core';

const BuyPage = () => {
  const route =
    useRoute<
      RouteProp<IModalFiatCryptoParamList, EModalFiatCryptoRoutes.BuyModal>
    >();
  const { networkId, accountId, tokens = [], map = {} } = route.params;
  const intl = useIntl();
  return (
    <AccountSelectorProviderMirror
      config={{
        sceneName: EAccountSelectorSceneName.home,
        sceneUrl: '',
      }}
      enabledNum={[0]}
    >
      <HomeTokenListProviderMirror>
        <TokenDataContainer
          networkId={networkId}
          accountId={accountId}
          initialMap={map}
          initialTokens={tokens}
        >
          <SellOrBuy
            title={intl.formatMessage({ id: ETranslations.global_buy })}
            type="buy"
            networkId={networkId}
            accountId={accountId}
          />
        </TokenDataContainer>
      </HomeTokenListProviderMirror>
    </AccountSelectorProviderMirror>
  );
};

export default BuyPage;
