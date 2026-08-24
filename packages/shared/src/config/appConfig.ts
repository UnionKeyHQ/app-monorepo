/* eslint-disable @typescript-eslint/no-non-null-assertion */

import type { EServiceEndpointEnum, IEndpointEnv } from '../../types/endpoint';

export const HARDWARE_SDK_IFRAME_SRC_UNIONKEY =
  process.env.HARDWARE_SDK_CONNECT_SRC ||
  'https://api.unionkey.io/hardware-sdk/connect';

export const HARDWARE_SDK_VERSION: string =
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  require('@onekeyfe/hd-core/package.json').version as string;

export const HARDWARE_BRIDGE_DOWNLOAD_URL =
  'https://unionkey.io/desktop';

export const FIRMWARE_UPDATE_WEB_TOOLS_URL =
  'https://unionkey.io/school.html';
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

export const UNIONKEY_API_BASE_URL =
  process.env.UNIONKEY_API_BASE_URL || 'https://api.unionkey.io';
export const UNIONKEY_TEST_API_BASE_URL =
  process.env.UNIONKEY_TEST_API_BASE_URL || UNIONKEY_API_BASE_URL;
export const UNIONKEY_API_HOST = new URL(UNIONKEY_API_BASE_URL).host;
export const UNIONKEY_TEST_API_HOST = new URL(
  UNIONKEY_TEST_API_BASE_URL,
).host;
export const WEB_APP_URL = 'https://app.unionkey.io';
export const WEB_APP_URL_DEV = 'https://unionkey.io';

export const EXT_RATE_URL = {
  'chrome': 'https://unionkey.io',
  'firefox': 'https://unionkey.io',
  'edge': 'https://unionkey.io',
};

export const APP_STORE_LINK = `itms-apps://apps.apple.com/app/id1609559473?action=write-review`;
export const PLAY_STORE_LINK = `market://details?id=so.unionkey.app.wallet`;

export const UNIONKEY_KEY_TAG_PURCHASE_URL =
  'https://unionkey-wallet.myshopify.com/';

export const BIP39_DOT_MAP_URL = 'https://github.com/UnionKeyHQ/bip39-dotmap';

export const buildServiceEndpoint = ({
  serviceName,
  env,
  isWebSocket,
}: {
  serviceName: EServiceEndpointEnum;
  env: IEndpointEnv;
  isWebSocket?: boolean;
}) =>
  `${isWebSocket ? 'wss' : 'https'}://${new URL(
    env === 'prod' ? UNIONKEY_API_BASE_URL : UNIONKEY_TEST_API_BASE_URL,
  ).host}/${serviceName}`;

export const CHAIN_SELECTOR_LOGO = 'https://unionkey.io/favicon.ico';
export const defaultColorScheme = 'dark';

export const FALCON_DOCS_URL = 'https://docs.falcon.finance/';
export const UNIONKEY_HEALTH_CHECK_URL = '/wallet/v1/health';
