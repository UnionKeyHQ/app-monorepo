import type { IDesktopOpenUrlEventData } from '@unionkeyhq/desktop/app/app';
import { ipcMessageKeys } from '@unionkeyhq/desktop/app/config';

import type { IRegisterHandler } from './handler.type';

export const registerHandler: IRegisterHandler = (
  handleDeepLinkUrl: (e: IDesktopOpenUrlEventData) => void,
) => {
  const desktopApi = globalThis.desktopApi;
  if (
    !desktopApi?.addIpcEventListener ||
    !desktopApi?.removeIpcEventListener
  ) {
    return;
  }
  const desktopLinkingHandler = (
    event: Event,
    data: IDesktopOpenUrlEventData,
  ) => {
    handleDeepLinkUrl(data);
  };

  try {
    desktopApi.removeIpcEventListener(
      ipcMessageKeys.EVENT_OPEN_URL,
      desktopLinkingHandler,
    );
  } catch {
    // noop
  }

  desktopApi.addIpcEventListener(
    ipcMessageKeys.EVENT_OPEN_URL,
    desktopLinkingHandler,
  );
  // window.desktopApi.ready();
};
