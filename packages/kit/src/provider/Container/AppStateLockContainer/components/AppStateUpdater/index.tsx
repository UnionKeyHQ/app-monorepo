import { useCallback } from 'react';

import backgroundApiProxy from '@unionkey/kit/src/background/instance/backgroundApiProxy';
import { useHandleAppStateActive } from '@unionkey/kit/src/hooks/useHandleAppStateActive';
import { usePasswordPersistAtom } from '@unionkey/kit-bg/src/states/jotai/atoms';

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
