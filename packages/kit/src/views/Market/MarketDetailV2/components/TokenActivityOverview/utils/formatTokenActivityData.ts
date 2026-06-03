import type { IMarketTokenDetail } from '@unionkey/shared/types/marketV2';

export function formatTokenActivityData(
  tokenDetail: IMarketTokenDetail | undefined,
  selectedTimeRange: string,
): {
  buys: number;
  sells: number;
  buyVolume: number;
  sellVolume: number;
  buyers: number;
  sellers: number;
} {
  let buys = 0;
  let sells = 0;
  let buyVolume = 0;
  let sellVolume = 0;
  let buyers = 0;
  let sellers = 0;

  if (tokenDetail) {
    switch (selectedTimeRange) {
      case '5m':
        buys = Number(tokenDetail.buy5mCount) || 0;
        sells = Number(tokenDetail.sell5mCount) || 0;
        buyVolume = Number(tokenDetail.volumeBuy5m) || 0;
        sellVolume = Number(tokenDetail.volumeSell5m) || 0;
        buyers = Number(tokenDetail.buyer5mCount) || buys;
        sellers = Number(tokenDetail.seller5mCount) || sells;
        break;
      case '4h':
        buys = Number(tokenDetail.buy4hCount) || 0;
        sells = Number(tokenDetail.sell4hCount) || 0;
        buyVolume = Number(tokenDetail.volumeBuy4h) || 0;
        sellVolume = Number(tokenDetail.volumeSell4h) || 0;
        buyers = Number(tokenDetail.buyer4hCount) || buys;
        sellers = Number(tokenDetail.seller4hCount) || sells;
        break;
      case '24h':
        buys = Number(tokenDetail.buy24hCount) || 0;
        sells = Number(tokenDetail.sell24hCount) || 0;
        buyVolume = Number(tokenDetail.volumeBuy24h) || 0;
        sellVolume = Number(tokenDetail.volumeSell24h) || 0;
        buyers = Number(tokenDetail.buyer24hCount) || buys;
        sellers = Number(tokenDetail.seller24hCount) || sells;
        break;
      case '1h':
      default:
        buys = Number(tokenDetail.buy1hCount) || 0;
        sells = Number(tokenDetail.sell1hCount) || 0;
        buyVolume = Number(tokenDetail.volumeBuy1h) || 0;
        sellVolume = Number(tokenDetail.volumeSell1h) || 0;
        buyers = Number(tokenDetail.buyer1hCount) || buys;
        sellers = Number(tokenDetail.seller1hCount) || sells;
        break;
    }
  }
  return { buys, sells, buyVolume, sellVolume, buyers, sellers };
}
