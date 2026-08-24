import { EXT_UI_TO_BG_PORT_NAME } from '@unionkeyhq/shared/types';

const setupExtUIEventBase = (onDisconnect: () => void) => {
  chrome.runtime.onConnect.addListener((port) => {
    if (port.name === EXT_UI_TO_BG_PORT_NAME) {
      port.onDisconnect.addListener(onDisconnect);
    }
  });
};

export const setupExtUIEvent = () =>
  setupExtUIEventBase(() => {
    const backgroundApiProxy =
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      require('@unionkeyhq/kit/src/background/instance/backgroundApiProxy')
        .default as typeof import('@unionkeyhq/kit/src/background/instance/backgroundApiProxy').default;
    void backgroundApiProxy.servicePassword.resetPasswordStatus();
  });

export const setupExtUIEventOnPassKeyPage = () =>
  setupExtUIEventBase(() => window.close());
