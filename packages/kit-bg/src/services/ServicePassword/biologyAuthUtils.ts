import {
  decodeSensitiveTextAsync,
  encodeKeyPrefix,
  encodeSensitiveTextAsync,
} from '@unionkeyhq/core/src/secret';
import biologyAuth from '@unionkeyhq/shared/src/biologyAuth';
import type { IBiologyAuth } from '@unionkeyhq/shared/src/biologyAuth/types';
import secureStorageInstance from '@unionkeyhq/shared/src/storage/instance/secureStorageInstance';

import { settingsPersistAtom } from '../../states/jotai/atoms/settings';

const biologyAuthNativeError = 'biology_native_error';
class BiologyAuthUtils implements IBiologyAuth {
  isSupportBiologyAuth() {
    return biologyAuth.isSupportBiologyAuth();
  }

  biologyAuthenticate() {
    return biologyAuth.biologyAuthenticate();
  }

  getBiologyAuthType() {
    return biologyAuth.getBiologyAuthType();
  }

  savePassword = async (password: string) => {
    if (!secureStorageInstance.supportSecureStorage()) return;
    let text = await decodeSensitiveTextAsync({ encodedText: password });
    const settings = await settingsPersistAtom.get();
    text = await encodeSensitiveTextAsync({
      text,
      key: `${encodeKeyPrefix}${settings.sensitiveEncodeKey}`,
    });
    await secureStorageInstance.setSecureItem('password', text);
  };

  getPassword = async ({
    useRnJsCrypto,
  }: {
    useRnJsCrypto?: boolean;
  } = {}) => {
    if (!secureStorageInstance.supportSecureStorage()) {
      throw new Error('No password');
    }
    let text = await secureStorageInstance.getSecureItem('password');
    if (text) {
      const settings = await settingsPersistAtom.get();
      text = await decodeSensitiveTextAsync({
        encodedText: text,
        key: `${encodeKeyPrefix}${settings.sensitiveEncodeKey}`,
        useRnJsCrypto,
      });
      text = await encodeSensitiveTextAsync({ text, useRnJsCrypto });
      return text;
    }
    throw new Error('No password');
  };

  deletePassword = async () => {
    if (!secureStorageInstance.supportSecureStorage()) return;
    await secureStorageInstance.removeSecureItem('password');
  };
}
const biologyAuthUtils = new BiologyAuthUtils();
export { biologyAuthNativeError, biologyAuthUtils };
