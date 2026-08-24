import { useCallback } from 'react';

import { EChainSelectorPages, EModalRoutes } from '@unionkeyhq/shared/src/routes';
import type { IChainSelectorParams } from '@unionkeyhq/shared/src/routes/chainSelector';

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
