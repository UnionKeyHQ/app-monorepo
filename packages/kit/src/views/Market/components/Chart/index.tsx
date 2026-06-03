import { useCallback, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

import { useIntl } from 'react-intl';

import {
  EPageType,
  Empty,
  Skeleton,
  Spinner,
  Stack,
  XStack,
  YStack,
  useMedia,
  usePageType,
} from '@unionkey/components';
import useFormatDate from '@unionkey/kit/src/hooks/useFormatDate';
import { ETranslations } from '@unionkey/shared/src/locale';
import platformEnv from '@unionkey/shared/src/platformEnv';
import type { IMarketTokenChart } from '@unionkey/shared/types/market';

import ChartView from './ChartView';
import { PriceLabel } from './PriceLabel';

import type { BusinessDay, UTCTimestamp } from 'lightweight-charts';

type IPriceChartProps = {
  data?: IMarketTokenChart;
  children: ReactNode;
  isFetching: boolean;
  height: number;
};

type IOnHoverFunction = ({
  time,
  price,
}: {
  time?: UTCTimestamp | BusinessDay | Date | string;
  price?: number | string | { close?: number };
}) => void;

const getPointPrice = (point?: IMarketTokenChart[number]) => {
  if (!point) {
    return 0;
  }
  return point.length >= 5 ? point[4] : point[1];
};

const normalizeHoverPrice = (
  value?: number | string | { close?: number },
) => {
  if (value && typeof value === 'object') {
    return Number(value.close ?? 0);
  }
  if (typeof value === 'string') {
    return +value;
  }
  return value;
};

const normalizeHoverTime = (
  value?: UTCTimestamp | BusinessDay | Date | string,
) => {
  if (value instanceof Date) {
    return value;
  }
  if (typeof value === 'number') {
    return new Date(value > 10_000_000_000 ? value : value * 1000);
  }
  if (typeof value === 'string') {
    const timestamp = +value;
    return new Date(timestamp > 10_000_000_000 ? timestamp : timestamp * 1000);
  }
  return undefined;
};

export function PriceChart({
  data,
  isFetching,
  height,
  children,
}: IPriceChartProps) {
  const { formatDate } = useFormatDate();
  const intl = useIntl();
  const pageType = usePageType();

  const [price, setPrice] = useState<string | number | undefined>();
  const [time, setTime] = useState('');
  const { gtMd: gtMdMedia } = useMedia();
  const gtMd = pageType === EPageType.modal ? false : gtMdMedia;
  const basePrice = data?.length ? data[0][1] : 0;
  const latestPrice = data?.length ? getPointPrice(data[data.length - 1]) : 0;
  const currentPrice = useMemo(() => {
    if (!data) {
      return null;
    }
    if (price === 'undefined' || price === undefined) {
      return latestPrice;
    }
    return normalizeHoverPrice(price);
  }, [data, latestPrice, price]);

  const onHover = useCallback<IOnHoverFunction>(
    (hoverData) => {
      // The first data of each hover is an empty string, which needs to be filtered
      if (hoverData.price === '' && hoverData.time === '') {
        return;
      }
      const hoverDate = normalizeHoverTime(hoverData.time);
      const displayTime = hoverDate ? formatDate(hoverDate) : '';
      setTime(displayTime);
      setPrice(hoverData.price);
    },
    [formatDate],
  );

  const priceLabel = (
    <PriceLabel
      opacity={time ? 1 : 0}
      price={currentPrice}
      time={time || ''}
      basePrice={basePrice}
    />
  );

  const emptyView = useMemo(() => {
    if (isFetching) {
      return <Spinner />;
    }
    return (
      <Empty
        title={intl.formatMessage({
          id: ETranslations.global_no_data,
        })}
      />
    );
  }, [intl, isFetching]);

  const viewHeight = useMemo(() => {
    if (gtMd) {
      return height;
    }
    if (platformEnv.isNative) {
      return height * 0.9;
    }
    return height * 0.45;
  }, [gtMd, height]);
  const mdViewHeight = useMemo(
    () => (platformEnv.isNative ? height * 0.65 : height * 0.7),
    [height],
  );
  const chartView =
    data && data.length > 0 ? (
      <ChartView
        isFetching={isFetching}
        height={viewHeight}
        data={data}
        onHover={onHover}
      />
    ) : (
      emptyView
    );

  const chartViewWithSpinner = isFetching ? <Spinner /> : chartView;
  return gtMd ? (
    <>
      <XStack justifyContent="space-between" h="$10">
        {isFetching ? (
          <YStack gap="$2">
            <Skeleton w="$10" h="$3" />
            <Skeleton w="$24" h="$3" />
          </YStack>
        ) : (
          priceLabel
        )}
        {children}
      </XStack>
      <Stack
        mt={32}
        $gtMd={{ mt: '$1' }}
        justifyContent="center"
        alignItems="center"
      >
        {chartViewWithSpinner}
      </Stack>
    </>
  ) : (
    <>
      {priceLabel}
      <Stack h={mdViewHeight} justifyContent="center" alignItems="center">
        {platformEnv.isNative ? chartView : chartViewWithSpinner}
      </Stack>
    </>
  );
}
