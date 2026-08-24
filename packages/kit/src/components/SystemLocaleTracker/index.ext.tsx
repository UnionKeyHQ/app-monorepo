import { useEffect } from 'react';

import backgroundApiProxy from '@unionkeyhq/kit/src/background/instance/backgroundApiProxy';
import platformEnv from '@unionkeyhq/shared/src/platformEnv';

let done = false;

export const SystemLocaleTracker = () => {
  useEffect(() => {
    if (platformEnv.isExtension && !done) {
      done = true;
      void backgroundApiProxy.serviceSetting.initSystemLocale();
    }
  }, []);
  return null;
};
