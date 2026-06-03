import type { IDevSettingsPersistAtom } from '@unionkey/kit-bg/src/states/jotai/atoms/devSettings';
import type { ISettingsPersistAtom } from '@unionkey/kit-bg/src/states/jotai/atoms/settings';

export type IWebEmbedUnionkeyAppSettings = {
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

function getSettings(): IWebEmbedUnionkeyAppSettings | undefined {
  const settings = globalThis.WEB_EMBED_UNIONKEY_APP_SETTINGS;
  return settings;
}

export default {
  getSettings,
};
