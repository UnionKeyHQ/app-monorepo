/* eslint-disable @typescript-eslint/no-non-null-assertion */

import type { EServiceEndpointEnum, IEndpointEnv } from '../../types/endpoint';

export const HARDWARE_SDK_IFRAME_SRC_UNIONKEYSO =
  process.env.HARDWARE_SDK_CONNECT_SRC || 'https://jssdk.unionkey.so';

export const HARDWARE_SDK_VERSION: string =
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  require('@onekeyfe/hd-core/package.json').version as string;

export const HARDWARE_BRIDGE_DOWNLOAD_URL =
  'https://unionkey.so/download/?client=bridge';

export const FIRMWARE_UPDATE_WEB_TOOLS_URL = 'https://firmware.unionkey.so';
export const FIRMWARE_CONTACT_US_URL = 'https://unionkey.io/school.html';
export const FIRMWARE_MANUAL_ENTERING_BOOTLOADER_MODE_GUIDE =
  'https://unionkey.io/school.html';
export const FIRMWARE_UPDATE_FULL_RES_GUIDE =
  'https://unionkey.io/school.html';
export const FIRMWARE_UPDATE_BRIDGE_GUIDE =
  'https://unionkey.io/school.html';

export const HELP_CENTER_URL = 'https://unionkey.io/school';
export const HELP_CENTER_URLHTML = 'https://unionkey.io/school.html';
export const LITE_CARD_URL =
  'https://unionkey.io/';
export const BRIDGE_STATUS_URL = 'http://127.0.0.1:21320/status/';
export const NOTIFICATIONS_HELP_CENTER_URL =
  'https://unionkey.io/school.html';
export const DOWNLOAD_URL = 'https://unionkey.io/mobile';
export const DOWNLOAD_MOBILE_APP_URL =
  'https://unionkey.io/mobile';

export const TWITTER_URL = 'https://x.com/UnionKeyHQ';
export const GITHUB_URL = 'https://github.com/UnionKeyHQ';
export const UNIONKEY_URL = 'https://unionkey.io';

export const UNIONKEY_API_HOST =
  process.env.UNIONKEY_API_HOST || 'unionkeycn.com';
export const UNIONKEY_TEST_API_HOST =
  process.env.UNIONKEY_TEST_API_HOST || 'unionkeytest.com';
export const UNIONKEY_API_PROTOCOL =
  process.env.UNIONKEY_API_PROTOCOL || 'https';
export const UNIONKEY_WALLET_API_ENDPOINT =
  process.env.UNIONKEY_WALLET_API_ENDPOINT || '';
export const UNIONKEY_API_ENDPOINT =
  process.env.UNIONKEY_API_ENDPOINT ||
  (process.env.NODE_ENV === 'development' ? 'http://127.0.0.1:3443' : '');
// export const UNIONKEY_API_HOST = '192.168.111.154:3443';
// export const UNIONKEY_TEST_API_HOST = '192.168.111.154:3443';
export const WEB_APP_URL = 'https://app.unionkey.io';
export const WEB_APP_URL_DEV = 'https://app.unionkey.com';

export const EXT_RATE_URL = {
  'chrome':
    'https://chrome.google.com/webstore/detail/unionkey/jnmbobjmhlngoefaiojfljckilhhlhcj',
  'firefox': 'https://addons.mozilla.org/zh-CN/firefox/addon/unionkey/reviews/',
  'edge':
    'https://microsoftedge.microsoft.com/addons/detail/unionkey/obffkkagpmohennipjokmpllocnlndac',
};

export const APP_STORE_LINK = `itms-apps://apps.apple.com/app/id1609559473?action=write-review`;
export const PLAY_STORE_LINK = `market://details?id=so.unionkey.app.wallet`;

export const UNIONKEY_KEY_TAG_PURCHASE_URL =
  'https://unionkey-wallet.myshopify.com/';

export const BIP39_DOT_MAP_URL = 'https://github.com/UnionKeyHQ/bip39-dotmap';

const formatEndpointByProtocol = ({
  endpoint,
  isWebSocket,
}: {
  endpoint: string;
  isWebSocket?: boolean;
}) => {
  if (!isWebSocket) {
    return endpoint;
  }
  return endpoint.replace(/^http:/, 'ws:').replace(/^https:/, 'wss:');
};

export const buildServiceEndpoint = ({
  serviceName,
  env,
  isWebSocket,
}: {
  serviceName: EServiceEndpointEnum;
  env: IEndpointEnv;
  isWebSocket?: boolean;
}) =>
  UNIONKEY_API_ENDPOINT
    ? formatEndpointByProtocol({
        endpoint: UNIONKEY_API_ENDPOINT,
        isWebSocket,
      })
    : serviceName === 'wallet' && UNIONKEY_WALLET_API_ENDPOINT
    ? formatEndpointByProtocol({
        endpoint: UNIONKEY_WALLET_API_ENDPOINT,
        isWebSocket,
      })
    : `${isWebSocket ? 'wss' : UNIONKEY_API_PROTOCOL}://${serviceName}.${
        env === 'prod' ? UNIONKEY_API_HOST : UNIONKEY_TEST_API_HOST
      }`;

export const CHAIN_SELECTOR_LOGO =
  'https://uni.unionkey-asset.com/static/logo/chain_selector_logo.png';
export const defaultColorScheme = 'dark';

export const FALCON_DOCS_URL = 'https://docs.falcon.finance/';
export const UNIONKEY_HEALTH_CHECK_URL = '/wallet/v1/health';
