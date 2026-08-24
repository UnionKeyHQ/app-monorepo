import { useCallback } from 'react';

import backgroundApiProxy from '@unionkeyhq/kit/src/background/instance/backgroundApiProxy';
import { usePromiseResult } from '@unionkeyhq/kit/src/hooks/usePromiseResult';
import timerUtils from '@unionkeyhq/shared/src/utils/timerUtils';

interface IUseMarketDetailDataProps {
  tokenAddress: string;
  networkId: string;
}

export function useMarketDetail({
  tokenAddress,
  networkId,
}: IUseMarketDetailDataProps) {
  const {
    result: tokenDetail,
    isLoading: isRefreshing,
    run: fetchMarketTokenDetail,
  } = usePromiseResult(
    async () => {
      const response =
        await backgroundApiProxy.serviceMarketV2.fetchMarketTokenDetailByTokenAddress(
          tokenAddress,
          networkId,
        );
      return response;
    },
    [tokenAddress, networkId],
    {
      watchLoading: true,
      pollingInterval: timerUtils.getTimeDurationMs({ seconds: 45 }),
    },
  );

  const onRefresh = useCallback(async () => {
    await fetchMarketTokenDetail();
  }, [fetchMarketTokenDetail]);

  return {
    tokenDetail,
    fetchMarketTokenDetail,
    isRefreshing,
    onRefresh,
  };
}
