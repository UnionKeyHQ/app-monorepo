import appGlobals from '@unionkeyhq/shared/src/appGlobals';
import { ensureRunOnBackground } from '@unionkeyhq/shared/src/utils/assertUtils';

// eslint-disable-next-line @typescript-eslint/no-restricted-imports
import localDb from './localDbInstance';

if (process.env.NODE_ENV !== 'production') {
  appGlobals.$$localDb = localDb;
}

ensureRunOnBackground();

export default localDb;
