import { useCallback, useState } from 'react';

import { useIntl } from 'react-intl';

import type { IPageNavigationProp } from '@unionkeyhq/components';
import { SegmentControl, YStack } from '@unionkeyhq/components';
import { AccountSelectorProviderMirror } from '@unionkeyhq/kit/src/components/AccountSelector';
import useAppNavigation from '@unionkeyhq/kit/src/hooks/useAppNavigation';
import type { EJotaiContextStoreNames } from '@unionkeyhq/kit-bg/src/states/jotai/atoms';
import { ETranslations } from '@unionkeyhq/shared/src/locale';
import type { IModalSwapParamList } from '@unionkeyhq/shared/src/routes';
import { EModalSwapRoutes } from '@unionkeyhq/shared/src/routes';
import { EAccountSelectorSceneName } from '@unionkeyhq/shared/types';
import type { IFetchLimitOrderRes } from '@unionkeyhq/shared/types/swap/types';

import LimitOrderList from '../components/LimitOrderList';
import { SwapProviderMirror } from '../SwapProviderMirror';

const LimitOrderListModal = ({
  storeName,
}: {
  storeName: EJotaiContextStoreNames;
}) => {
  const navigation =
    useAppNavigation<IPageNavigationProp<IModalSwapParamList>>();
  const [limitOrderSelectedTab, setLimitOrderSelectedTab] = useState<
    'open' | 'history'
  >('open');
  const onClickCell = useCallback(
    (item: IFetchLimitOrderRes) => {
      navigation.push(EModalSwapRoutes.LimitOrderDetail, {
        orderId: item.orderId,
        orderItem: item,
        storeName,
      });
    },
    [navigation, storeName],
  );
  const intl = useIntl();
  return (
    <YStack px="$4" pt="$2" gap="$4" flex={1}>
      <SegmentControl
        w="100%"
        fullWidth
        options={[
          {
            label: intl.formatMessage({ id: ETranslations.Limit_open_order }),
            value: 'open',
          },
          {
            label: intl.formatMessage({
              id: ETranslations.Limit_order_history,
            }),
            value: 'history',
          },
        ]}
        onChange={(value) => {
          setLimitOrderSelectedTab(value as 'open' | 'history');
        }}
        value={limitOrderSelectedTab}
      />

      <LimitOrderList onClickCell={onClickCell} type={limitOrderSelectedTab} />
    </YStack>
  );
};

const LimitOrderListModalWithSwapProvider = ({
  storeName,
}: {
  storeName: EJotaiContextStoreNames;
}) => (
  <SwapProviderMirror storeName={storeName}>
    <LimitOrderListModal storeName={storeName} />
  </SwapProviderMirror>
);

export default function LimitOrderListModalWithAllProvider({
  storeName,
}: {
  storeName: EJotaiContextStoreNames;
}) {
  return (
    <AccountSelectorProviderMirror
      config={{
        sceneName: EAccountSelectorSceneName.swap,
      }}
      enabledNum={[0, 1]}
    >
      <LimitOrderListModalWithSwapProvider storeName={storeName} />
    </AccountSelectorProviderMirror>
  );
}
