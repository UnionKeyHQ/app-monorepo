import { EXT_UI_TO_BG_PORT_NAME } from '@unionkey/shared/types';

import type { JsBridgeExtBackground } from '@onekeyfe/extension-bridge-hosted';

const checkExtUIOpen = (bridgeExtBg: JsBridgeExtBackground) => {
  const currentExtOrigin = chrome.runtime.getURL('');
  const { ports } = bridgeExtBg;
  const unionKeyUIPort = Object.values(ports).filter(
    (port) => port.name === EXT_UI_TO_BG_PORT_NAME,
  );
  if (
    unionKeyUIPort.length > 0 &&
    unionKeyUIPort[0].sender?.origin &&
    currentExtOrigin.includes(unionKeyUIPort[0].sender?.origin)
  ) {
    return true;
  }
  return false;
};

export { checkExtUIOpen };
