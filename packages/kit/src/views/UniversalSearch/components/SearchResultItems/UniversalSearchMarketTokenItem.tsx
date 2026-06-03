import { useCallback } from 'react';

import { XStack } from '@unionkey/components';
import { ListItem } from '@unionkey/kit/src/components/ListItem';
import useAppNavigation from '@unionkey/kit/src/hooks/useAppNavigation';
import { useUniversalSearchActions } from '@unionkey/kit/src/states/jotai/contexts/universalSearch';
import { defaultLogger } from '@unionkey/shared/src/logger/logger';
import { EWatchlistFrom } from '@unionkey/shared/src/logger/scopes/market/scenes/token';
import { ETabMarketRoutes, ETabRoutes } from '@unionkey/shared/src/routes';
import type { IUniversalSearchMarketToken } from '@unionkey/shared/types/search';
import { ESearchStatus } from '@unionkey/shared/types/search';

import { MarketStar } from '../../../Market/components/MarketStar';
import { MarketTokenIcon } from '../../../Market/components/MarketTokenIcon';
import { MarketTokenPrice } from '../../../Market/components/MarketTokenPrice';

interface IUniversalSearchMarketTokenItemProps {
  item: IUniversalSearchMarketToken;
  searchStatus: ESearchStatus;
}

export function UniversalSearchMarketTokenItem({
  item,
  searchStatus,
}: IUniversalSearchMarketTokenItemProps) {
  const navigation = useAppNavigation();
  const universalSearchActions = useUniversalSearchActions();
  const { image, coingeckoId, price, symbol, name, lastUpdated } = item.payload;

  const handlePress = useCallback(() => {
    navigation.pop();
    setTimeout(async () => {
      navigation.switchTab(ETabRoutes.Market);
      navigation.push(ETabMarketRoutes.MarketDetail, {
        token: coingeckoId,
      });
      defaultLogger.market.token.searchToken({
        tokenSymbol: coingeckoId,
        from:
          searchStatus === ESearchStatus.init ? 'trendingList' : 'searchList',
      });
      setTimeout(() => {
        universalSearchActions.current.addIntoRecentSearchList({
          id: coingeckoId,
          text: symbol,
          type: item.type,
          timestamp: Date.now(),
        });
      }, 10);
    }, 80);
  }, [
    coingeckoId,
    item.type,
    navigation,
    searchStatus,
    symbol,
    universalSearchActions,
  ]);

  return (
    <ListItem
      jc="space-between"
      onPress={handlePress}
      renderAvatar={<MarketTokenIcon uri={image} size="lg" />}
      title={symbol.toUpperCase()}
      subtitle={name}
      subtitleProps={{
        numberOfLines: 1,
      }}
    >
      <XStack>
        <MarketTokenPrice
          price={String(price)}
          size="$bodyLgMedium"
          lastUpdated={lastUpdated}
          tokenName={name}
          tokenSymbol={symbol}
        />
        <MarketStar
          coingeckoId={coingeckoId}
          ml="$3"
          from={EWatchlistFrom.search}
        />
      </XStack>
    </ListItem>
  );
}
