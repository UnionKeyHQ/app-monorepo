import { useMemo } from 'react';

import { useIntl } from 'react-intl';

import type { IPageNavigationProp } from '@unionkey/components';
import { Icon, SizableText, Spinner, XStack } from '@unionkey/components';
import useAppNavigation from '@unionkey/kit/src/hooks/useAppNavigation';
import { useSwapTypeSwitchAtom } from '@unionkey/kit/src/states/jotai/contexts/swap';
import type { EJotaiContextStoreNames } from '@unionkey/kit-bg/src/states/jotai/atoms';
import { useInAppNotificationAtom } from '@unionkey/kit-bg/src/states/jotai/atoms';
import { ETranslations } from '@unionkey/shared/src/locale';
import type { IModalSwapParamList } from '@unionkey/shared/src/routes';
import { EModalRoutes, EModalSwapRoutes } from '@unionkey/shared/src/routes';
import {
  EProtocolOfExchange,
  ESwapLimitOrderStatus,
  ESwapTabSwitchType,
} from '@unionkey/shared/types/swap/types';

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
