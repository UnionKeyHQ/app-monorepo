import type { FC } from 'react';
import { memo, useMemo } from 'react';

import type { IMarketTokenChart } from '@unionkey/shared/types/market';

import { useThemeVariant } from '../../../../hooks/useThemeVariant';

import ChartViewAdapter from './ChartViewAdapter';

import type { BusinessDay, UTCTimestamp } from 'lightweight-charts';

type IOnHoverFunction = ({
  time,
  price,
}: {
  time?: UTCTimestamp | BusinessDay | Date | string;
  price?: number | string | { close?: number };
}) => void;
interface IChartViewProps {
  data: IMarketTokenChart;
  onHover: IOnHoverFunction;
  height: number;
  isFetching: boolean;
}

const ChartView: FC<IChartViewProps> = ({
  data,
  onHover,
  height,
  isFetching,
}) => {
  const theme = useThemeVariant();
  const { lineColor, topColor, bottomColor } = useMemo(() => {
    const firstPoint = data[0];
    const lastPoint = data[data.length - 1];
    const firstPrice = firstPoint?.[1] ?? 0;
    const lastPrice = lastPoint
      ? lastPoint.length >= 5
        ? lastPoint[4]
        : lastPoint[1]
      : firstPrice;
    const changePercent =
      firstPrice > 0 ? ((lastPrice - firstPrice) / firstPrice) * 100 : 0;
    const isFlat = Math.abs(changePercent) < 0.1;
    const isPositive = changePercent >= 0;

    if (isFlat) {
      return theme === 'dark'
        ? {
            lineColor: 'rgba(160, 167, 174, 0.95)',
            topColor: 'rgba(160, 167, 174, 0.16)',
            bottomColor: 'rgba(160, 167, 174, 0)',
          }
        : {
            lineColor: 'rgba(86, 94, 102, 0.95)',
            topColor: 'rgba(86, 94, 102, 0.14)',
            bottomColor: 'rgba(86, 94, 102, 0)',
          };
    }

    if (isPositive) {
      return theme === 'dark'
        ? {
            lineColor: 'rgba(70, 254, 165, 0.95)',
            topColor: 'rgba(70, 254, 165, 0.18)',
            bottomColor: 'rgba(70, 254, 165, 0)',
          }
        : {
            lineColor: 'rgba(0, 113, 63, 0.95)',
            topColor: 'rgba(0, 113, 63, 0.16)',
            bottomColor: 'rgba(0, 113, 63, 0)',
          };
    }

    return theme === 'dark'
      ? {
          lineColor: 'rgba(255, 149, 146, 0.95)',
          topColor: 'rgba(255, 149, 146, 0.18)',
          bottomColor: 'rgba(255, 149, 146, 0)',
        }
      : {
          lineColor: 'rgba(196, 0, 6, 0.95)',
          topColor: 'rgba(196, 0, 6, 0.16)',
          bottomColor: 'rgba(196, 0, 6, 0)',
        };
  }, [data, theme]);

  return (
    <ChartViewAdapter
      isFetching={isFetching}
      height={height}
      data={data}
      lineColor={lineColor}
      topColor={topColor}
      bottomColor={bottomColor}
      onHover={onHover}
    />
  );
};
ChartView.displayName = 'ChartView';
export default memo(ChartView);
