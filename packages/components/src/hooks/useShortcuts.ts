import { useEffect } from 'react';

import { ipcMessageKeys } from '@unionkeyhq/desktop/app/config';
import platformEnv from '@unionkeyhq/shared/src/platformEnv';
import type { EShortcutEvents } from '@unionkeyhq/shared/src/shortcuts/shortcuts.enum';

export const useShortcuts = (
  eventName: EShortcutEvents | undefined,
  callback: (event: EShortcutEvents) => void,
) => {
  useEffect(() => {
    const desktopApi = globalThis.desktopApi;
    if (
      platformEnv.isDesktop &&
      desktopApi?.addIpcEventListener &&
      desktopApi?.removeIpcEventListener
    ) {
      const handleCallback = (_: unknown, e: EShortcutEvents) => {
        if (eventName === undefined || e === eventName) {
          callback(e);
        }
      };
      desktopApi.addIpcEventListener(
        ipcMessageKeys.APP_SHORCUT,
        handleCallback,
      );
      return () => {
        desktopApi.removeIpcEventListener(
          ipcMessageKeys.APP_SHORCUT,
          handleCallback,
        );
      };
    }
  }, [callback, eventName]);
};
