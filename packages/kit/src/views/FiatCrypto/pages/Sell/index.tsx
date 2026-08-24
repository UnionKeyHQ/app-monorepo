import { useRoute } from '@react-navigation/core';
import { useIntl } from 'react-intl';

import { AccountSelectorProviderMirror } from '@unionkeyhq/kit/src/components/AccountSelector';
import { ETranslations } from '@unionkeyhq/shared/src/locale';
import type {
  EModalFiatCryptoRoutes,
  IModalFiatCryptoParamList,
} from '@unionkeyhq/shared/src/routes';
import { EAccountSelectorSceneName } from '@unionkeyhq/shared/types';

import { HomeTokenListProviderMirror } from '../../../Home/components/HomeTokenListProvider/HomeTokenListProviderMirror';
import SellOrBuy from '../../components/SellOrBuy';
import { TokenDataContainer } from '../../components/TokenDataContainer';

import type { RouteProp } from '@react-navigation/core';

const SellPage = () => {
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
          initialMap={map}
          initialTokens={tokens}
          networkId={networkId}
          accountId={accountId}
        >
          <SellOrBuy
            title={intl.formatMessage({ id: ETranslations.global_cash_out })}
            type="sell"
            networkId={networkId}
            accountId={accountId}
          />
        </TokenDataContainer>
      </HomeTokenListProviderMirror>
    </AccountSelectorProviderMirror>
  );
};

export default SellPage;
