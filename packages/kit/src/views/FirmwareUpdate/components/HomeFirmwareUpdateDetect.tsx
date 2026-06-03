import { memo, useEffect, useMemo } from 'react';

import { useRouteIsFocused as useIsFocused } from '@unionkey/kit/src/hooks/useRouteIsFocused';
import { useAppIsLockedAtom } from '@unionkey/kit-bg/src/states/jotai/atoms';
import accountUtils from '@unionkey/shared/src/utils/accountUtils';
import { EAccountSelectorSceneName } from '@unionkey/shared/types';

import backgroundApiProxy from '../../../background/instance/backgroundApiProxy';
import { AccountSelectorProviderMirror } from '../../../components/AccountSelector';
import { useActiveAccount } from '../../../states/jotai/contexts/accountSelector';

function HomeFirmwareUpdateDetectCmp() {
  const { activeAccount } = useActiveAccount({ num: 0 });
  const connectId = activeAccount.device?.connectId;

  const isFocused = useIsFocused();

  // const activeAccountRef = useRef(activeAccount);
  // activeAccountRef.current = activeAccount;
  const isHardware = useMemo(
    () =>
      accountUtils.isHwWallet({
        walletId: activeAccount.wallet?.id,
      }),
    [activeAccount.wallet?.id],
  );

  useEffect(() => {
    if (isHardware && connectId && isFocused) {
      // TODO check firmware update only for current device or all device?
      // TODO only works for home scene, TODO throttle
      // get sdk instance will register device events automatically
      void backgroundApiProxy.serviceFirmwareUpdate.detectActiveAccountFirmwareUpdates(
        {
          connectId,
        },
      );
    }
  }, [isHardware, connectId, isFocused]);

  return null;
}

export function HomeFirmwareUpdateDetectWithProvider() {
  const [isLocked] = useAppIsLockedAtom();
  // Prohibit hardware detection in lock screen state
  return isLocked ? null : (
    <AccountSelectorProviderMirror
      config={{
        sceneName: EAccountSelectorSceneName.home,
      }}
      enabledNum={[0]}
    >
      <HomeFirmwareUpdateDetectCmp />
    </AccountSelectorProviderMirror>
  );
}

export const HomeFirmwareUpdateDetect = memo(
  HomeFirmwareUpdateDetectWithProvider,
);
