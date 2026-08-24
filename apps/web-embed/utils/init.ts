import { checkIsUnionKeyDomain } from '@unionkeyhq/kit-bg/src/endpoints';
import { analytics } from '@unionkeyhq/shared/src/analytics';
import { buildServiceEndpoint } from '@unionkeyhq/shared/src/config/appConfig';
import requestHelper from '@unionkeyhq/shared/src/request/requestHelper';
import { EServiceEndpointEnum } from '@unionkeyhq/shared/types/endpoint';
import type { IWebEmbedUnionKeyAppSettings } from '@unionkeyhq/web-embed/utils/webEmbedAppSettings';

const getValueFromWebEmbedUnionKeyAppSettings = <
  T extends keyof IWebEmbedUnionKeyAppSettings,
>(
  key: T,
): IWebEmbedUnionKeyAppSettings[keyof IWebEmbedUnionKeyAppSettings] | string => {
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
