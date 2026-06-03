import { useCallback } from 'react';

import { useSettingsPersistAtom } from '@unionkey/kit-bg/src/states/jotai/atoms';
import platformEnv from '@unionkey/shared/src/platformEnv';
import { EHardwareTransportType } from '@unionkey/shared/types';

function useShouldRejectDappAction() {
  const [{ hardwareTransportType }] = useSettingsPersistAtom();
  const shouldRejectDappAction = useCallback(() => {
    if (
      platformEnv.isExtensionUiStandaloneWindow ||
      platformEnv.isExtensionUiPopup
    ) {
      return hardwareTransportType !== EHardwareTransportType.WEBUSB;
    }
    return true;
  }, [hardwareTransportType]);

  return {
    shouldRejectDappAction,
  };
}

export default useShouldRejectDappAction;
