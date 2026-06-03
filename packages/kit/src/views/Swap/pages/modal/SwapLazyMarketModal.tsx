import { useLayoutEffect } from 'react';

import { useIntl } from 'react-intl';

import { Page, Spinner, Stack } from '@unionkey/components';
import type { IPageScreenProps } from '@unionkey/components';
import { AccountSelectorProviderMirror } from '@unionkey/kit/src/components/AccountSelector';
import { useLazyMarketTradeActions } from '@unionkey/kit/src/views/Market/components/tradeHook';
import { ETranslations } from '@unionkey/shared/src/locale';
import type {
  EModalSwapRoutes,
  IModalSwapParamList,
} from '@unionkey/shared/src/routes/swap';
import { EAccountSelectorSceneName } from '@unionkey/shared/types';

function BaseSwapLazyMarketModal({
  route,
}: IPageScreenProps<
  IModalSwapParamList,
  EModalSwapRoutes.SwapLazyMarketModal
>) {
  const { coinGeckoId } = route.params;
  const intl = useIntl();

  const { onSwap } = useLazyMarketTradeActions(coinGeckoId);

  useLayoutEffect(() => {
    void onSwap();
  }, [onSwap]);

  return (
    <Page>
      <Page.Header
        title={intl.formatMessage({ id: ETranslations.global_trade })}
      />
      <Page.Body>
        <Stack flex={1} ai="center" jc="center">
          <Spinner size="large" />
        </Stack>
      </Page.Body>
    </Page>
  );
}

export default function SwapLazyMarketModal(
  props: IPageScreenProps<
    IModalSwapParamList,
    EModalSwapRoutes.SwapLazyMarketModal
  >,
) {
  return (
    <AccountSelectorProviderMirror
      config={{
        sceneName: EAccountSelectorSceneName.home,
        sceneUrl: '',
      }}
      enabledNum={[0]}
    >
      <BaseSwapLazyMarketModal {...props} />
    </AccountSelectorProviderMirror>
  );
}
