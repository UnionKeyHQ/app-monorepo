import { useEffect } from 'react';

import { ipcMessageKeys } from '@unionkey/desktop/app/config';
import platformEnv from '@unionkey/shared/src/platformEnv';
import type { EShortcutEvents } from '@unionkey/shared/src/shortcuts/shortcuts.enum';

export const useShortcuts = (
  eventName: EShortcutEvents | undefined,
  callback: (event: EShortcutEvents) => void,
) => {
  useEffect(() => {
    if (
      platformEnv.isDesktop &&
      globalThis.desktopApi?.addIpcEventListener &&
      globalThis.desktopApi?.removeIpcEventListener
    ) {
      const handleCallback = (_: unknown, e: EShortcutEvents) => {
        if (eventName === undefined || e === eventName) {
          callback(e);
        }
      };
      globalThis.desktopApi.addIpcEventListener(
        ipcMessageKeys.APP_SHORCUT,
        handleCallback,
      );
      return () => {
        globalThis.desktopApi.removeIpcEventListener(
          ipcMessageKeys.APP_SHORCUT,
          handleCallback,
        );
      };
    }
  }, [callback, eventName]);
};
