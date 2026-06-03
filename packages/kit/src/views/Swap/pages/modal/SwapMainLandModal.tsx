import { useEffect } from 'react';

import { useRoute } from '@react-navigation/core';
import { useIntl } from 'react-intl';

import { EPageType, Page } from '@unionkey/components';
import backgroundApiProxy from '@unionkey/kit/src/background/instance/backgroundApiProxy';
import { AccountSelectorProviderMirror } from '@unionkey/kit/src/components/AccountSelector';
import { useActiveAccount } from '@unionkey/kit/src/states/jotai/contexts/accountSelector';
import { useSettingsAtom } from '@unionkey/kit-bg/src/states/jotai/atoms';
import { ETranslations } from '@unionkey/shared/src/locale';
import { defaultLogger } from '@unionkey/shared/src/logger/logger';
import platformEnv from '@unionkey/shared/src/platformEnv';
import type {
  EModalSwapRoutes,
  IModalSwapParamList,
} from '@unionkey/shared/src/routes';
import { EAccountSelectorSceneName } from '@unionkey/shared/types';

import SwapMainLandWithPageType from '../components/SwapMainLand';

import type { RouteProp } from '@react-navigation/core';

const SwapMainLandModalPage = () => {
  const intl = useIntl();
  const route =
    useRoute<RouteProp<IModalSwapParamList, EModalSwapRoutes.SwapMainLand>>();
  const {
    importFromToken,
    importNetworkId,
    importToToken,
    swapTabSwitchType,
    importDeriveType,
    swapSource,
  } = route.params ?? {};
  const { activeAccount } = useActiveAccount({
    num: 0,
  });
  const [{ swapToAnotherAccountSwitchOn }, setSettings] = useSettingsAtom();
  useEffect(() => {
    // when modal swap open, reset swapToAnotherAccountSwitchOn
    if (swapToAnotherAccountSwitchOn) {
      setSettings((v) => ({
        ...v,
        swapToAnotherAccountSwitchOn: false,
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setSettings]);
  useEffect(() => {
    if (importDeriveType && importNetworkId && activeAccount.ready) {
      void backgroundApiProxy.serviceNetwork.saveGlobalDeriveTypeForNetwork({
        networkId: importNetworkId,
        deriveType: importDeriveType,
      });
    }
  }, [importDeriveType, importNetworkId, activeAccount.ready]);

  useEffect(() => {
    if (swapSource) {
      defaultLogger.swap.enterSwap.enterSwap({
        enterFrom: swapSource,
      });
    }
  }, [swapSource]);

  return (
    <Page skipLoading={platformEnv.isNativeIOS}>
      <Page.Header
        title={intl.formatMessage({ id: ETranslations.global_trade })}
      />
      <SwapMainLandWithPageType
        pageType={EPageType.modal}
        swapInitParams={{
          importFromToken,
          importNetworkId,
          importToToken,
          swapTabSwitchType,
        }}
      />
    </Page>
  );
};

export default function SwapMainLandModal() {
  return (
    <AccountSelectorProviderMirror
      config={{
        sceneName: EAccountSelectorSceneName.swap,
      }}
      enabledNum={[0, 1]}
    >
      <SwapMainLandModalPage />
    </AccountSelectorProviderMirror>
  );
}
