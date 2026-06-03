import { useEffect, useMemo } from 'react';

import { configureNetInfo, refreshNetInfo } from '@unionkey/components';
import { useDevSettingsPersistAtom } from '@unionkey/kit-bg/src/states/jotai/atoms';
import { UNIONKEY_HEALTH_CHECK_URL } from '@unionkey/shared/src/config/appConfig';
import { getEndpointsMapByDevSettings } from '@unionkey/shared/src/config/endpointsMap';
import {
  EAppEventBusNames,
  appEventBus,
} from '@unionkey/shared/src/eventBus/appEventBus';

const REACHABILITY_LONG_TIMEOUT = 60 * 1000;
const REACHABILITY_SHORT_TIMEOUT = 5 * 1000;
const REACHABILITY_REQUEST_TIMEOUT = 10 * 1000;

const checkNetInfo = async (endpoint: string) => {
  const isLocalDevEndpoint =
    endpoint.includes('127.0.0.1') || endpoint.includes('localhost');
  configureNetInfo({
    reachabilityUrl: isLocalDevEndpoint
      ? UNIONKEY_HEALTH_CHECK_URL
      : `${endpoint}${UNIONKEY_HEALTH_CHECK_URL}`,
    reachabilityLongTimeout: REACHABILITY_LONG_TIMEOUT,
    reachabilityShortTimeout: REACHABILITY_SHORT_TIMEOUT,
    reachabilityRequestTimeout: REACHABILITY_REQUEST_TIMEOUT,
  });
};

const useNetInfo = () => {
  const [devSettings] = useDevSettingsPersistAtom();
  const walletEndpoints = useMemo(
    () => getEndpointsMapByDevSettings(devSettings).wallet,
    [devSettings],
  );
  useEffect(() => {
    void checkNetInfo(walletEndpoints);
    const callback = () => {
      refreshNetInfo();
    };
    appEventBus.on(EAppEventBusNames.RefreshNetInfo, callback);
    return () => {
      appEventBus.off(EAppEventBusNames.RefreshNetInfo, callback);
    };
  }, [walletEndpoints]);
};

export function NetworkReachabilityTracker() {
  useNetInfo();
  return null;
}
