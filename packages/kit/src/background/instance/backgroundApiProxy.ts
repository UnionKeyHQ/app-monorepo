import BackgroundApiProxy from '@unionkey/kit-bg/src/apis/BackgroundApiProxy';
import appGlobals from '@unionkey/shared/src/appGlobals';
import platformEnv from '@unionkey/shared/src/platformEnv';

import backgroundApiInit from './backgroundApiInit';

let backgroundApi = null;

if (!platformEnv.isExtensionUi) {
  // Ext use mock backgroundApi in UI
  backgroundApi = backgroundApiInit();
}
const backgroundApiProxy = new BackgroundApiProxy({
  backgroundApi,
});

appGlobals.$backgroundApiProxy = backgroundApiProxy;

export default backgroundApiProxy;
