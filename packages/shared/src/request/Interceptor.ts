import { Appearance } from 'react-native';

import type {
  ISettingsPersistAtom,
  ISettingsValuePersistAtom,
} from '@unionkeyhq/kit-bg/src/states/jotai/atoms';
import { getDefaultLocale } from '@unionkeyhq/shared/src/locale/getDefaultLocale';
import platformEnv from '@unionkeyhq/shared/src/platformEnv';
import { generateUUID } from '@unionkeyhq/shared/src/utils/miscUtils';

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

export const HEADER_REQUEST_ID_KEY = normalizeHeaderKey('X-UnionKey-Request-ID');

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
    [normalizeHeaderKey('X-UnionKey-Request-Currency')]: settings.currencyInfo.id,
    [normalizeHeaderKey('X-UnionKey-Instance-Id')]: settings.instanceId,
    [normalizeHeaderKey('X-UnionKey-Request-Locale')]: locale.toLowerCase(),
    [normalizeHeaderKey('X-UnionKey-Request-Theme')]: theme,
    [normalizeHeaderKey('X-UnionKey-Request-Platform')]: headerPlatform,
    [normalizeHeaderKey('X-UnionKey-Request-Platform-Name')]:
      appDeviceInfoData.displayName || 'Unknown',
    [normalizeHeaderKey('X-UnionKey-Request-Device-Name')]:
      platformEnv.appFullName,
    [normalizeHeaderKey('X-UnionKey-Request-Version')]:
      platformEnv.version as string,
    [normalizeHeaderKey('X-UnionKey-Hide-Asset-Details')]: (
      valueSettings?.hideValue ?? false
    )?.toString(),
    [normalizeHeaderKey('X-UnionKey-Request-Build-Number')]:
      platformEnv.buildNumber as string,
  };
}
