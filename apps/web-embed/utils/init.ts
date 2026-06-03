import { checkIsUnionKeyDomain } from '@unionkey/kit-bg/src/endpoints';
import { analytics } from '@unionkey/shared/src/analytics';
import { buildServiceEndpoint } from '@unionkey/shared/src/config/appConfig';
import requestHelper from '@unionkey/shared/src/request/requestHelper';
import { EServiceEndpointEnum } from '@unionkey/shared/types/endpoint';
import type { IWebEmbedUnionkeyAppSettings } from '@unionkey/web-embed/utils/webEmbedAppSettings';

const getValueFromWebEmbedUnionKeyAppSettings = <
  T extends keyof IWebEmbedUnionkeyAppSettings,
>(
  key: T,
): IWebEmbedUnionkeyAppSettings[keyof IWebEmbedUnionkeyAppSettings] | string => {
  const value = globalThis?.WEB_EMBED_UNIONKEY_APP_SETTINGS?.[key];
  return value ?? '';
};

const initRequestHelper = () => {
  requestHelper.overrideMethods({
    checkIsUnionKeyDomain,
    getDevSettingsPersistAtom: async () => {
      return (
        globalThis?.WEB_EMBED_UNIONKEY_APP_SETTINGS?.$devSettings ?? {
          enabled: false,
        }
      );
    },
    getSettingsPersistAtom: async () =>
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      Promise.resolve({
        currencyInfo: {
          id: 'usd',
          symbol: '$',
        },
        instanceId: getValueFromWebEmbedUnionKeyAppSettings('instanceId'),
        theme: getValueFromWebEmbedUnionKeyAppSettings('themeVariant') as
          | 'light'
          | 'dark',
        lastLocale: getValueFromWebEmbedUnionKeyAppSettings('localeVariant'),
        locale: getValueFromWebEmbedUnionKeyAppSettings('localeVariant'),
        version: getValueFromWebEmbedUnionKeyAppSettings('appVersion'),
        buildNumber: getValueFromWebEmbedUnionKeyAppSettings('appBuildNumber'),
      } as any),
    getSettingsValuePersistAtom: async () =>
      Promise.resolve({
        hideValue: false,
      }),
  });
};

export const initAnalytics = () => {
  const instanceId = getValueFromWebEmbedUnionKeyAppSettings(
    'instanceId',
  ) as string;
  analytics.init({
    instanceId,
    baseURL: buildServiceEndpoint({
      serviceName: EServiceEndpointEnum.Utility,
      env:
        globalThis?.WEB_EMBED_UNIONKEY_APP_SETTINGS?.enableTestEndpoint ?? false
          ? 'test'
          : 'prod',
    }),
  });
};

export const init = () => {
  initRequestHelper();
  initAnalytics();
};
