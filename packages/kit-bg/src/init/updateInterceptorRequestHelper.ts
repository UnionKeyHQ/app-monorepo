import requestHelper from '@unionkeyhq/shared/src/request/requestHelper';

import { checkIsUnionKeyDomain } from '../endpoints';
import {
  devSettingsPersistAtom,
  settingsPersistAtom,
  settingsValuePersistAtom,
} from '../states/jotai/atoms';

export function updateInterceptorRequestHelper() {
  requestHelper.overrideMethods({
    checkIsUnionKeyDomain,
    getDevSettingsPersistAtom: async () => devSettingsPersistAtom.get(),
    getSettingsPersistAtom: async () => settingsPersistAtom.get(),
    getSettingsValuePersistAtom: async () => settingsValuePersistAtom.get(),
  });
}
