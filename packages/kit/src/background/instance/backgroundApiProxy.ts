import BackgroundApiProxy from '@unionkeyhq/kit-bg/src/BackgroundApiProxy';
import platformEnv from '@unionkeyhq/shared/src/platformEnv';

import backgroundApiInit from './backgroundApiInit';

let backgroundApi = null;

if (!platformEnv.isExtensionUi) {
  backgroundApi = backgroundApiInit();
}
const backgroundApiProxy = new BackgroundApiProxy({
  backgroundApi,
});

global.$backgroundApiProxy = backgroundApiProxy;

export default backgroundApiProxy;
