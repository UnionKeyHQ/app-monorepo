import { useEffect } from 'react';

import { useRouteIsFocused as useIsFocused } from '@unionkeyhq/kit/src/hooks/useRouteIsFocused';
import {
  EAppEventBusNames,
  appEventBus,
} from '@unionkeyhq/shared/src/eventBus/appEventBus';
import platformEnv from '@unionkeyhq/shared/src/platformEnv';

const isNative = platformEnv.isNative && !platformEnv.isNativeIOSPad;

export const showTabBar = () => {
  setTimeout(() => {
    appEventBus.emit(EAppEventBusNames.HideTabBar, false);
  }, 100);
};

export const useNotifyTabBarDisplay = isNative
  ? (isActive: boolean) => {
      const isFocused = useIsFocused({ disableLockScreenCheck: true });

      const hideTabBar = isActive && isFocused;

      useEffect(() => {
        appEventBus.emit(EAppEventBusNames.HideTabBar, hideTabBar);
      }, [hideTabBar]);
    }
  : () => {};
