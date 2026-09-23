/* eslint-disable @typescript-eslint/no-non-null-assertion */
export const MAX_PAGE_CONTAINER_WIDTH = 1024;

/**
 * Tokens will injected at build process. These are client token.
 */
export const COVALENT_API_KEY = process.env.COVALENT_KEY!;

export const JPUSH_KEY = process.env.JPUSH_KEY!;

export const HARDWARE_SDK_IFRAME_SRC_UNIONKEY =
  process.env.HARDWARE_SDK_CONNECT_SRC || 'https://jssdk.onekey.so';

export const HARDWARE_SDK_VERSION = '0.3.47';

export const HARDWARE_BRIDGE_DOWNLOAD_URL = 'https://unionkey.io/bridge';

export const HARDWARE_FIRMWARE_URL = 'https://unionkey.io/firmware';

export const HARDWARE_LITE_URL = 'https://unionkey.io/lite';

export const HARDWARE_STORE_URL = 'https://unionkey.io/hardware';

export const CERTIFICATE_URL = 'https://unionkey.io/school.html';

export const HELP_CENTER_URL = 'https://unionkey.io/school';

export const MOBILE_DOWNLOAD_URL = 'https://unionkey.io/mobile';

export const DESKTOP_DOWNLOAD_URL = 'https://unionkey.io/desktop';

export const UNIONKEY_API_BASE_URL =
  process.env.UNIONKEY_API_BASE_URL || 'https://api.unionkey.io';
