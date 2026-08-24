import { useContext, useMemo } from 'react';

import {
  EPortalContainerConstantName,
  Portal,
  TabStackNavigator,
} from '@unionkeyhq/components';
import { TabFreezeOnBlurContext } from '@unionkeyhq/kit/src/provider/Container/TabFreezeOnBlurContainer';
import platformEnv from '@unionkeyhq/shared/src/platformEnv';
import type { ETabRoutes } from '@unionkeyhq/shared/src/routes';

import { tabExtraConfig, useTabRouterConfig } from './router';

export function TabNavigator() {
  const { freezeOnBlur } = useContext(TabFreezeOnBlurContext);
  const routerConfigParams = useMemo(() => ({ freezeOnBlur }), [freezeOnBlur]);
  const config = useTabRouterConfig(routerConfigParams);
  const isShowWebTabBar = platformEnv.isDesktop || platformEnv.isNativeIOS;
  return (
    <>
      <TabStackNavigator<ETabRoutes>
        config={config}
        extraConfig={isShowWebTabBar ? tabExtraConfig : undefined}
      />
      <Portal.Container
        name={EPortalContainerConstantName.IN_PAGE_TAB_CONTAINER}
      />
    </>
  );
}
