import { memo, useMemo } from 'react';

import { ProviderJotaiContextTokenList } from '@unionkey/kit/src/states/jotai/contexts/tokenList/atoms';
import { useJotaiContextRootStore } from '@unionkey/kit/src/states/jotai/utils/useJotaiContextRootStore';
import { EJotaiContextStoreNames } from '@unionkey/kit-bg/src/states/jotai/atoms';

export function useHomeTokenListContextStoreInitData() {
  const data = useMemo(
    () => ({
      storeName: EJotaiContextStoreNames.homeTokenList,
    }),
    [],
  );
  return data;
}

export const HomeTokenListRootProvider = memo(() => {
  const data = useHomeTokenListContextStoreInitData();
  const store = useJotaiContextRootStore(data);
  return <ProviderJotaiContextTokenList store={store} />;
});
HomeTokenListRootProvider.displayName = 'HomeTokenListRootProvider';
