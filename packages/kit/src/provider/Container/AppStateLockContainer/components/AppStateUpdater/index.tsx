import { useCallback } from 'react';

import backgroundApiProxy from '@unionkeyhq/kit/src/background/instance/backgroundApiProxy';
import { useHandleAppStateActive } from '@unionkeyhq/kit/src/hooks/useHandleAppStateActive';
import { usePasswordPersistAtom } from '@unionkeyhq/kit-bg/src/states/jotai/atoms';

import { AppStateSignal } from '../AppStateSignal';

const AppStateUpdaterContent = () => {
  const handler = useCallback(() => {
    if (AppStateSignal.instance.isOff()) {
      return;
    }
    void backgroundApiProxy.servicePassword.checkLockStatus();
  }, []);
  useHandleAppStateActive(handler);
  return null;
};

export const AppStateUpdater = () => {
  const [settings] = usePasswordPersistAtom();
  if (!settings.isPasswordSet) {
    return null;
  }
  return (
    <>
      <AppStateUpdaterContent />
    </>
  );
};
