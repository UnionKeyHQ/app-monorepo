import { useMemo } from 'react';

import type { IRootStackNavigatorConfig } from '@unionkeyhq/components/src/layouts/Navigation/Navigator';
import LazyLoad from '@unionkeyhq/shared/src/lazyLoad';
import platformEnv from '@unionkeyhq/shared/src/platformEnv';
import { ERootRoutes } from '@unionkeyhq/shared/src/routes';

import { ModalNavigator } from './Modal/Navigator';
import { fullModalRouter, modalRouter } from './Modal/router';
import { TabNavigator } from './Tab/Navigator';
import { useTabRouterConfig } from './Tab/router';

const buildPermissionRouter = () => {
  const PromptWebDeviceAccessPage = LazyLoad(
    () =>
      import('@unionkeyhq/kit/src/views/Permission/PromptWebDeviceAccessPage'),
  );
  return [
    platformEnv.isExtension
      ? {
          name: ERootRoutes.PermissionWebDevice,
          component: PromptWebDeviceAccessPage,
          rewrite: '/permission/web-device',
          exact: true,
        }
      : undefined,
  ].filter(Boolean);
};

export const rootRouter: IRootStackNavigatorConfig<ERootRoutes, any>[] = [
  {
    name: ERootRoutes.Main,
    component: TabNavigator,
    initialRoute: true,
  },
  {
    name: ERootRoutes.Modal,
    component: ModalNavigator,
    type: 'modal',
  },
  {
    name: ERootRoutes.iOSFullScreen,
    component: ModalNavigator,
    type: 'iOSFullScreen',
  },
  ...buildPermissionRouter(),
];

if (platformEnv.isDev) {
  const NotFound = LazyLoad(() => import('../components/NotFound'));
  rootRouter.push({
    name: ERootRoutes.NotFound,
    component: NotFound,
  });
}

export const useRootRouter = () => {
  const tabRouter = useTabRouterConfig();
  return useMemo(
    () => [
      {
        name: ERootRoutes.Main,
        children: tabRouter,
      },
      {
        name: ERootRoutes.Modal,
        children: modalRouter,
      },
      {
        name: ERootRoutes.iOSFullScreen,
        children: fullModalRouter,
      },

      ...buildPermissionRouter(),
    ],
    [tabRouter],
  );
};
