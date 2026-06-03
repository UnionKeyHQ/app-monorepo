import { memo, useCallback, useEffect, useMemo, useState } from 'react';

import { useIntl } from 'react-intl';

import type { IIconButtonProps, IStackProps } from '@unionkey/components';
import { IconButton, useMedia } from '@unionkey/components';
import { useRouteIsFocused as useIsFocused } from '@unionkey/kit/src/hooks/useRouteIsFocused';
import {
  EAppEventBusNames,
  appEventBus,
} from '@unionkey/shared/src/eventBus/appEventBus';
import { ETranslations } from '@unionkey/shared/src/locale';
import { defaultLogger } from '@unionkey/shared/src/logger/logger';
import type { EWatchlistFrom } from '@unionkey/shared/src/logger/scopes/market/scenes/token';

import { useWatchListAction } from './wachListHooks';

export const useStarChecked = ({
  coingeckoId,
  tabIndex,
  from,
}: {
  coingeckoId: string;
  tabIndex?: number;
  from: EWatchlistFrom;
}) => {
  const actions = useWatchListAction();

  const [checked, setIsChecked] = useState(() =>
    actions.isInWatchList(coingeckoId),
  );

  const isFocused = useIsFocused();

  const { gtMd } = useMedia();

  const onSwitchMarketHomeTabCallback = useCallback(
    ({ tabIndex: currentTabIndex }: { tabIndex: number }) => {
      if (currentTabIndex === tabIndex) {
        setIsChecked(actions.isInWatchList(coingeckoId));
      }
    },
    [actions, coingeckoId, tabIndex],
  );

  useEffect(() => {
    if (gtMd && tabIndex) {
      appEventBus.on(
        EAppEventBusNames.SwitchMarketHomeTab,
        onSwitchMarketHomeTabCallback,
      );
      return () => {
        appEventBus.off(
          EAppEventBusNames.SwitchMarketHomeTab,
          onSwitchMarketHomeTabCallback,
        );
      };
    }
  }, [gtMd, onSwitchMarketHomeTabCallback, tabIndex]);

  useEffect(() => {
    if (isFocused) {
      setIsChecked(actions.isInWatchList(coingeckoId));
    }
  }, [actions, coingeckoId, isFocused]);

  const handlePress = useCallback(async () => {
    if (checked) {
      actions.removeFormWatchList(coingeckoId);
      defaultLogger.market.token.removeFromWatchlist({
        tokenSymbol: coingeckoId,
        removeWatchlistFrom: from,
      });
    } else {
      await actions.addIntoWatchList(coingeckoId);
      defaultLogger.market.token.addToWatchList({
        tokenSymbol: coingeckoId,
        addWatchlistFrom: from,
      });
    }
    setIsChecked(!checked);
  }, [checked, actions, coingeckoId, from]);
  return useMemo(
    () => ({
      checked,
      setIsChecked,
      onPress: handlePress,
    }),
    [checked, handlePress],
  );
};

function BasicMarketStar({
  coingeckoId,
  size,
  tabIndex,
  from,
  ...props
}: {
  tabIndex?: number;
  size?: IIconButtonProps['size'];
  coingeckoId: string;
  from: EWatchlistFrom;
} & IStackProps) {
  const intl = useIntl();
  const { onPress, checked } = useStarChecked({
    tabIndex,
    coingeckoId,
    from,
  });

  return (
    <IconButton
      title={intl.formatMessage({
        id: checked
          ? ETranslations.market_remove_from_watchlist
          : ETranslations.market_add_to_watchlist,
      })}
      icon={checked ? 'StarSolid' : 'StarOutline'}
      variant="tertiary"
      size={size}
      iconSize={size ? undefined : '$5'}
      iconProps={{
        color: checked ? '$iconActive' : '$iconDisabled',
      }}
      onPress={onPress}
      {...props}
    />
  );
}

export const MarketStar = memo(BasicMarketStar);
