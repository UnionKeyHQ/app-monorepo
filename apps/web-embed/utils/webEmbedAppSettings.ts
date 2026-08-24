import type { IDevSettingsPersistAtom } from '@unionkeyhq/kit-bg/src/states/jotai/atoms/devSettings';
import type { ISettingsPersistAtom } from '@unionkeyhq/kit-bg/src/states/jotai/atoms/settings';

export type IWebEmbedUnionKeyAppSettings = {
  $settings: ISettingsPersistAtom | undefined; // ISettingsPersistAtom
  $devSettings: IDevSettingsPersistAtom | undefined; // IDevSettingsPersistAtom
  isDev: boolean;
  enableTestEndpoint: boolean;
  themeVariant: string;
  localeVariant: string;
  revenuecatApiKey: string;
  instanceId: string;
  platform: string;
  appBuildNumber: string;
  appVersion: string;
};

function getSettings(): IWebEmbedUnionKeyAppSettings | undefined {
  const settings = globalThis.WEB_EMBED_UNIONKEY_APP_SETTINGS;
  return settings;
}

export default {
  getSettings,
};
