import { useCallback } from 'react';

import { EChainSelectorPages, EModalRoutes } from '@unionkey/shared/src/routes';
import type { IChainSelectorParams } from '@unionkey/shared/src/routes/chainSelector';

import useAppNavigation from '../../../hooks/useAppNavigation';

export default function useConfigurableChainSelector() {
  const navigation = useAppNavigation();
  return useCallback(
    (params?: IChainSelectorParams) =>
      navigation.pushModal(EModalRoutes.ChainSelectorModal, {
        screen: EChainSelectorPages.ChainSelector,
        params,
      }),
    [navigation],
  );
}
