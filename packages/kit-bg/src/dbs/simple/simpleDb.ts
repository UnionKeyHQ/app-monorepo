import appGlobals from '@unionkeyhq/shared/src/appGlobals';
import platformEnv from '@unionkeyhq/shared/src/platformEnv';
import { ensureRunOnBackground } from '@unionkeyhq/shared/src/utils/assertUtils';

import { SimpleDb } from './base/SimpleDb';

// eslint-disable-next-line import/no-mutable-exports
let simpleDb: SimpleDb;

if (platformEnv.isExtensionUi) {
  simpleDb = new Proxy(
    {},
    {
      get() {
        throw new Error('[simpleDb] is NOT allowed in UI process currently.');
      },
    },
  ) as SimpleDb;
} else {
  simpleDb = new SimpleDb();
}

if (process.env.NODE_ENV !== 'production') {
  appGlobals.$$simpleDb = simpleDb;
}

ensureRunOnBackground();

export default simpleDb;
