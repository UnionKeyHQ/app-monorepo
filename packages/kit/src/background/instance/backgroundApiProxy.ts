import BackgroundApiProxy from '@unionkeyhq/kit-bg/src/apis/BackgroundApiProxy';
import appGlobals from '@unionkeyhq/shared/src/appGlobals';
import platformEnv from '@unionkeyhq/shared/src/platformEnv';

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
