import { memo } from 'react';

import { Stack } from '@unionkey/components';
import LazyLoad from '@unionkey/shared/src/lazyLoad';
import platformEnv from '@unionkey/shared/src/platformEnv';

export const LazyLoadPage = (
  factory: () => Promise<{ default: any }>,
  delayMs?: number,
  unStyle?: boolean,
  fallback?: React.ReactNode,
) => {
  const LazyLoadComponent = LazyLoad(factory, delayMs, fallback);
  function LazyLoadPageContainer(props: any) {
    if (unStyle) {
      return <LazyLoadComponent {...props} />;
    }

    return (
      <Stack flex={1} bg="$bgApp">
        <LazyLoadComponent {...props} />
      </Stack>
    );
  }
  return memo(LazyLoadPageContainer);
};

// prevent useEffect triggers when tab loaded on Native
export const LazyLoadRootTabPage = (factory: () => Promise<{ default: any }>) =>
  // prevent hooks run
  LazyLoadPage(factory, platformEnv.isNative ? 1 : undefined);
