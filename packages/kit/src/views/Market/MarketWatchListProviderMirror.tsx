import { type PropsWithChildren, memo } from 'react';

import { jotaiContextStore } from '@unionkeyhq/kit/src/states/jotai/utils/jotaiContextStore';
import { JotaiContextStoreMirrorTracker } from '@unionkeyhq/kit/src/states/jotai/utils/JotaiContextStoreMirrorTracker';
import type { EJotaiContextStoreNames } from '@unionkeyhq/kit-bg/src/states/jotai/atoms';

import { ProviderJotaiContextMarketWatchList } from '../../states/jotai/contexts/market';

import { useMarketWatchListContextStoreInitData } from './MarketWatchListProvider';

export const MarketWatchListProviderMirror = memo(
  (props: PropsWithChildren & { storeName: EJotaiContextStoreNames }) => {
    const { children, storeName } = props;

    const data = useMarketWatchListContextStoreInitData(storeName);
    const store = jotaiContextStore.getOrCreateStore(data);

    return (
      <>
        <JotaiContextStoreMirrorTracker {...data} />
        <ProviderJotaiContextMarketWatchList store={store}>
          {children}
        </ProviderJotaiContextMarketWatchList>
      </>
    );
  },
);
MarketWatchListProviderMirror.displayName = 'MarketWatchListProviderMirror';
