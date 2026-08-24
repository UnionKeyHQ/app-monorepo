import { useEffect } from 'react';

import { AppState } from 'react-native';

import platformEnv from '@unionkeyhq/shared/src/platformEnv';

export const getCurrentVisibilityState = () => {
  const desktopApi = globalThis.desktopApi;
  if (platformEnv.isNative) {
    // currentState will be null at launch while AppState retrieves it over the bridge.
    // https://reactnative.dev/docs/appstate
    return AppState.currentState === 'active' || AppState.currentState === null;
  }
  if (platformEnv.isDesktop && desktopApi?.isFocused) {
    return desktopApi.isFocused();
  }
  return document.visibilityState === 'visible';
};
export const onVisibilityStateChange = (
  callback: (visible: boolean) => void,
) => {
  const desktopApi = globalThis.desktopApi;
  if (platformEnv.isNative) {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      callback(nextAppState === 'active');
    });
    return () => {
      subscription.remove();
    };
  }

  if (platformEnv.isDesktop && desktopApi?.onAppState) {
    const removeSubscription = desktopApi.onAppState((state) => {
      callback(state === 'active');
    });
    return removeSubscription;
  }
  const handleVisibilityStateChange = () => {
    callback(document.visibilityState === 'visible');
  };
  const windowFocus = () => {
    callback(true);
  };
  const windowBlur = () => {
    callback(false);
  };
  document.addEventListener(
    'visibilitychange',
    handleVisibilityStateChange,
    false,
  );
  window.addEventListener('focus', windowFocus);
  window.addEventListener('blur', windowBlur);
  return () => {
    document.removeEventListener(
      'visibilitychange',
      handleVisibilityStateChange,
      false,
    );
    window.removeEventListener('focus', windowFocus);
    window.removeEventListener('blur', windowBlur);
  };
};

export const useVisibilityChange = (onChange: (visible: boolean) => void) => {
  useEffect(() => {
    const removeSubscription = onVisibilityStateChange(onChange);
    return removeSubscription;
  }, [onChange]);
};
