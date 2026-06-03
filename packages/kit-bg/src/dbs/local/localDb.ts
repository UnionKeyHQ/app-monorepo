import appGlobals from '@unionkey/shared/src/appGlobals';
import { ensureRunOnBackground } from '@unionkey/shared/src/utils/assertUtils';

// eslint-disable-next-line @typescript-eslint/no-restricted-imports
import localDb from './localDbInstance';

if (process.env.NODE_ENV !== 'production') {
  appGlobals.$$localDb = localDb;
}

ensureRunOnBackground();

export default localDb;
