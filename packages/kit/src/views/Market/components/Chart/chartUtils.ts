import type { IMarketTokenChart } from '@unionkey/shared/types/market';

import type {
  BusinessDay,
  ChartOptions,
  IChartApi,
  ISeriesApi,
  UTCTimestamp,
} from 'lightweight-charts';

type IDeepPartial<T> = {
  [P in keyof T]?: T[P] extends (infer U)[]
    ? IDeepPartial<U>[]
    : T[P] extends readonly (infer X)[]
    ? readonly IDeepPartial<X>[]
    : IDeepPartial<T[P]>;
};

// type IPriceNumber = number;
// type ITimeNumber = number;

export type IOnHoverFunction = ({
  time,
  price,
}: {
  time?: UTCTimestamp | BusinessDay | Date | string;
  price?: number | string | { close?: number };
}) => void;
export interface IChartViewProps {
  data: IMarketTokenChart;
  onHover: IOnHoverFunction;
  height: number;
  isFetching: boolean;
}

export interface IChartViewAdapterProps extends IChartViewProps {
  lineColor: string;
  topColor: string;
  bottomColor: string;
}

interface IUnionkeyChartApi extends IChartApi {
  // eslint-disable-next-line camelcase
  _unionkey_series?: ISeriesApi<'Area'> | any;
  // eslint-disable-next-line camelcase
  _unionkey_volume_series?: any;
  // eslint-disable-next-line camelcase
  _unionkey_series_type?: 'area' | 'candlestick';
}
export function createChartDom(
  createChartFunc: (
    container: HTMLElement,
    options?: IDeepPartial<ChartOptions>,
  ) => IChartApi,
  domNode: HTMLElement,
  onHover: IOnHoverFunction,
  height: number,
) {
  const chart = createChartFunc(domNode, {
    height,
    layout: {
      background: {
        color: 'transparent',
      },
    },
    crosshair: {
      vertLine: { visible: false },
      horzLine: { visible: false },
    },
    grid: {
      vertLines: { visible: false },
      horzLines: { color: 'rgba(160, 167, 174, 0.12)' },
    },
    timeScale: {
      visible: false,
      rightOffset: 6,
      barSpacing: 8,
      minBarSpacing: 4,
      fixLeftEdge: true,
      fixRightEdge: true,
      lockVisibleTimeRangeOnResize: true,
    },
    rightPriceScale: {
      visible: true,
      borderVisible: false,
    },
    handleScale: {
      pinch: false,
      mouseWheel: false,
    },
  });
  const handleResize = () => {
    chart.applyOptions({ width: domNode.clientWidth });
  };
  chart.subscribeCrosshairMove(({ time, seriesPrices }) => {
    onHover({ time, price: seriesPrices.values().next().value });
  });
  chart.timeScale().fitContent();
  window.addEventListener('resize', handleResize);
  // @ts-ignore
  globalThis._unionkey_chart = chart;
  return { chart, handleResize };
}

const isCandleChartData = (
  data: IMarketTokenChart,
): data is [number, number, number, number, number, number][] =>
  Array.isArray(data[0]) && data[0].length >= 5;

const normalizeChartTime = (time: number) =>
  Math.floor(time > 10_000_000_000 ? time / 1000 : time) as UTCTimestamp;

const removeExistingSeries = (chart: IUnionkeyChartApi) => {
  if (chart._unionkey_series) {
    chart.removeSeries(chart._unionkey_series);
    chart._unionkey_series = undefined;
  }
  if (chart._unionkey_volume_series) {
    chart.removeSeries(chart._unionkey_volume_series);
    chart._unionkey_volume_series = undefined;
  }
};

export function updateChartDom({
  lineColor,
  topColor,
  bottomColor,
  data,
}: {
  lineColor: string;
  topColor: string;
  bottomColor: string;
  data: IMarketTokenChart;
}) {
  // @ts-ignore
  const chart = globalThis._unionkey_chart as IUnionkeyChartApi;

  if (isCandleChartData(data)) {
    const candleData = data.map(([time, open, high, low, close]) => ({
      time: normalizeChartTime(time),
      open,
      high,
      low,
      close,
    }));
    const volumeData = data.map(([time, open, , , close, volume]) => ({
      time: normalizeChartTime(time),
      value: volume || 0,
      color:
        close >= open ? 'rgba(0, 113, 63, 0.35)' : 'rgba(196, 0, 6, 0.35)',
    }));

    if (chart._unionkey_series_type !== 'candlestick') {
      removeExistingSeries(chart);
      chart._unionkey_series = chart.addCandlestickSeries({
        upColor: 'rgba(0, 113, 63, 0.95)',
        downColor: 'rgba(196, 0, 6, 0.95)',
        wickUpColor: 'rgba(0, 113, 63, 0.95)',
        wickDownColor: 'rgba(196, 0, 6, 0.95)',
        borderVisible: false,
        priceScaleId: 'right',
      });
      chart._unionkey_volume_series = chart.addHistogramSeries({
        priceFormat: { type: 'volume' },
        priceScaleId: 'volume',
      });
      chart.priceScale('volume').applyOptions({
        scaleMargins: {
          top: 0.78,
          bottom: 0,
        },
      });
      chart._unionkey_series_type = 'candlestick';
    }

    chart._unionkey_series?.setData(candleData);
    chart._unionkey_volume_series?.setData(volumeData);

    if (data.length > 2) {
      chart.timeScale().setVisibleLogicalRange({
        from: Math.max(0, data.length - 64),
        to: data.length + 5,
      });
    }
    return;
  }

  const formattedData = (data as [number, number][]).map(
    ([time, value]) => ({
      time: normalizeChartTime(time),
      value,
    }),
  );
  if (!chart._unionkey_series || chart._unionkey_series_type !== 'area') {
    removeExistingSeries(chart);
    const newSeries = chart.addAreaSeries({
      lineColor,
      topColor,
      bottomColor,
      lineWidth: 2,
      crosshairMarkerBorderColor: '#fff',
      crosshairMarkerRadius: 5,
    });
    newSeries.setData(formattedData);
    chart._unionkey_series = newSeries;
    chart._unionkey_series_type = 'area';
    return;
  }
  const series = chart._unionkey_series as ISeriesApi<'Area'>;
  series.applyOptions({ lineColor, topColor, bottomColor });
  series.setData(formattedData);

  if (data.length > 2) {
    chart
      .timeScale()
      // https://github.com/tradingview/lightweight-charts/issues/1015
      .setVisibleLogicalRange({ from: 0.4, to: data.length - 1.4 });
  }
}

export type IPriceApiProps = {
  networkId: string;
  contract?: string;
  'vs_currency'?: string;
  days: string;
  points?: string;
};
