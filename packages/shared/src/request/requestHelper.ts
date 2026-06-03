import type {
  IDevSettingsPersistAtom,
  ISettingsPersistAtom,
  ISettingsValuePersistAtom,
} from '@unionkey/kit-bg/src/states/jotai/atoms';

class RequestHelper {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  checkIsUnionKeyDomain: (url: string) => Promise<boolean> = async (url) => {
    // TODO: OK-35681
    if (url.includes('api.revenuecat.com')) {
      return Promise.resolve(false);
    }
    throw new Error('Not implemented, please call overrideMethods');
  };

  getDevSettingsPersistAtom: () => Promise<IDevSettingsPersistAtom> =
    async () => {
      throw new Error('Not implemented, please call overrideMethods');
    };

  getSettingsPersistAtom: () => Promise<ISettingsPersistAtom> = async () => {
    throw new Error('Not implemented, please call overrideMethods');
  };

  getSettingsValuePersistAtom: () => Promise<ISettingsValuePersistAtom> =
    async () => {
      throw new Error('Not implemented, please call overrideMethods');
    };

  overrideMethods(methods: {
    checkIsUnionKeyDomain: (url: string) => Promise<boolean>;
    getDevSettingsPersistAtom: () => Promise<IDevSettingsPersistAtom>;
    getSettingsPersistAtom: () => Promise<ISettingsPersistAtom>;
    getSettingsValuePersistAtom: () => Promise<ISettingsValuePersistAtom>;
  }) {
    this.checkIsUnionKeyDomain = methods.checkIsUnionKeyDomain;
    this.getDevSettingsPersistAtom = methods.getDevSettingsPersistAtom;
    this.getSettingsPersistAtom = methods.getSettingsPersistAtom;
    this.getSettingsValuePersistAtom = methods.getSettingsValuePersistAtom;
  }
}

export default new RequestHelper();
