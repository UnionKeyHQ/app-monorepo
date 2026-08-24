import { useEffect } from 'react';

import type { IAppEventBusPayload } from '@unionkeyhq/shared/src/eventBus/appEventBus';
import {
  EAppEventBusNames,
  appEventBus,
} from '@unionkeyhq/shared/src/eventBus/appEventBus';

import useAppNavigation from '../../../hooks/useAppNavigation';
import { useFirmwareUpdateActions } from '../hooks/useFirmwareUpdateActions';

export function ForceFirmwareUpdateReminder() {
  const navigation = useAppNavigation();
  const actions = useFirmwareUpdateActions();

  useEffect(() => {
    const fn = ({
      connectId,
    }: IAppEventBusPayload[EAppEventBusNames.ShowFirmwareUpdateForce]) => {
      actions.showForceUpdate({ connectId });
    };
    appEventBus.on(EAppEventBusNames.ShowFirmwareUpdateForce, fn);

    return () => {
      appEventBus.off(EAppEventBusNames.ShowFirmwareUpdateForce, fn);
    };
  }, [actions, navigation]);
  return null;
}
