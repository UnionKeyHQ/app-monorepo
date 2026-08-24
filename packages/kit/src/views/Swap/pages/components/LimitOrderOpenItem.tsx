import { useMemo } from 'react';

import { useIntl } from 'react-intl';

import type { IPageNavigationProp } from '@unionkeyhq/components';
import { Icon, SizableText, Spinner, XStack } from '@unionkeyhq/components';
import useAppNavigation from '@unionkeyhq/kit/src/hooks/useAppNavigation';
import { useSwapTypeSwitchAtom } from '@unionkeyhq/kit/src/states/jotai/contexts/swap';
import type { EJotaiContextStoreNames } from '@unionkeyhq/kit-bg/src/states/jotai/atoms';
import { useInAppNotificationAtom } from '@unionkeyhq/kit-bg/src/states/jotai/atoms';
import { ETranslations } from '@unionkeyhq/shared/src/locale';
import type { IModalSwapParamList } from '@unionkeyhq/shared/src/routes';
import { EModalRoutes, EModalSwapRoutes } from '@unionkeyhq/shared/src/routes';
import {
  EProtocolOfExchange,
  ESwapLimitOrderStatus,
  ESwapTabSwitchType,
} from '@unionkeyhq/shared/types/swap/types';

const LimitOrderOpenItem = ({
  storeName,
}: {
  storeName: EJotaiContextStoreNames;
}) => {
  const [{ swapLimitOrders, swapLimitOrdersLoading }] =
    useInAppNotificationAtom();
  const intl = useIntl();
  const navigation =
    useAppNavigation<IPageNavigationProp<IModalSwapParamList>>();
  const openLimitOrder = useMemo(
    () =>
      swapLimitOrders.filter(
        (order) => order.status === ESwapLimitOrderStatus.OPEN,
      ),
    [swapLimitOrders],
  );
  const [swapType] = useSwapTypeSwitchAtom();
  return openLimitOrder.length > 0 && swapType === ESwapTabSwitchType.LIMIT ? (
    <XStack
      justifyContent="space-between"
      py="$3.5"
      px="$4"
      bg="$bgSubdued"
      borderRadius="$3"
      hoverStyle={{
        bg: '$bgStrongHover',
      }}
      pressStyle={{
        bg: '$bgStrongActive',
      }}
      onPress={() => {
        navigation.pushModal(EModalRoutes.SwapModal, {
          screen: EModalSwapRoutes.SwapHistoryList,
          params: {
            type: EProtocolOfExchange.LIMIT,
            storeName,
          },
        });
      }}
    >
      <XStack gap="$2" alignItems="center">
        <Icon size={20} name="ClockTimeHistorySolid" color="$iconSubdued" />
        <SizableText size="$bodyMdMedium" color="$text">
          {intl.formatMessage(
            {
              id: ETranslations.Limit_open_limit_order,
            },
            { num: openLimitOrder.length },
          )}
        </SizableText>
      </XStack>
      {swapLimitOrdersLoading ? (
        <Spinner size="small" color="$iconSubdued" />
      ) : (
        <Icon size={20} name="ArrowRightOutline" color="$iconSubdued" />
      )}
    </XStack>
  ) : null;
};

export default LimitOrderOpenItem;
