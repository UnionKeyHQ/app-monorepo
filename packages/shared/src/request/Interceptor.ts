import { Appearance } from 'react-native';

import type {
  ISettingsPersistAtom,
  ISettingsValuePersistAtom,
} from '@unionkey/kit-bg/src/states/jotai/atoms';
import { getDefaultLocale } from '@unionkey/shared/src/locale/getDefaultLocale';
import platformEnv from '@unionkey/shared/src/platformEnv';
import { generateUUID } from '@unionkey/shared/src/utils/miscUtils';

import appDeviceInfo from '../appDeviceInfo/appDeviceInfo';
import { defaultColorScheme } from '../config/appConfig';

import { headerPlatform } from './InterceptorConsts';
import requestHelper from './requestHelper';

import type { InternalAxiosRequestConfig } from 'axios';

export function normalizeHeaderKey(key: string) {
  return key?.toLowerCase() ?? key;
}

export async function checkRequestIsUnionKeyDomain({
  config,
}: {
  config: InternalAxiosRequestConfig;
}) {
  let isUnionKeyDomain = false;

  const check = async (url: string | undefined) => {
    try {
      if (url) {
        isUnionKeyDomain = await requestHelper.checkIsUnionKeyDomain(url ?? '');
      }
    } catch (error) {
      isUnionKeyDomain = false;
    }
  };

  const baseUrl = config?.baseURL || '';
  await check(baseUrl);

  if (!isUnionKeyDomain) {
    if (platformEnv.isDev && process.env.UNIONKEY_PROXY) {
      const proxyUrl = config?.headers?.['X-UnionKey-Dev-Proxy'];
      await check(proxyUrl);
    }
  }

  if (!isUnionKeyDomain) {
    await check(config?.url);
  }

  return isUnionKeyDomain;
}

export const HEADER_REQUEST_ID_KEY = normalizeHeaderKey('X-Unionkey-Request-ID');

export async function getRequestHeaders() {
  const appDeviceInfoData = await appDeviceInfo.getDeviceInfo();
  const settings: ISettingsPersistAtom =
    await requestHelper.getSettingsPersistAtom();
  const valueSettings: ISettingsValuePersistAtom =
    await requestHelper.getSettingsValuePersistAtom();

  let { locale, theme } = settings;

  if (locale === 'system') {
    locale = getDefaultLocale();
  }

  if (theme === 'system') {
    theme = Appearance.getColorScheme() ?? defaultColorScheme;
  }

  const requestId = generateUUID();
  return {
    [HEADER_REQUEST_ID_KEY]: requestId,
    [normalizeHeaderKey('X-Amzn-Trace-Id')]: requestId,
    [normalizeHeaderKey('X-Unionkey-Request-Currency')]: settings.currencyInfo.id,
    [normalizeHeaderKey('X-Unionkey-Instance-Id')]: settings.instanceId,
    [normalizeHeaderKey('X-Unionkey-Request-Locale')]: locale.toLowerCase(),
    [normalizeHeaderKey('X-Unionkey-Request-Theme')]: theme,
    [normalizeHeaderKey('X-Unionkey-Request-Platform')]: headerPlatform,
    [normalizeHeaderKey('X-Unionkey-Request-Platform-Name')]:
      appDeviceInfoData.displayName || 'Unknown',
    [normalizeHeaderKey('X-Unionkey-Request-Device-Name')]:
      platformEnv.appFullName,
    [normalizeHeaderKey('X-Unionkey-Request-Version')]:
      platformEnv.version as string,
    [normalizeHeaderKey('X-Unionkey-Hide-Asset-Details')]: (
      valueSettings?.hideValue ?? false
    )?.toString(),
    [normalizeHeaderKey('X-Unionkey-Request-Build-Number')]:
      platformEnv.buildNumber as string,
  };
}
