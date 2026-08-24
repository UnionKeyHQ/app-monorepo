import { useMemo } from 'react';

import { useSettingsPersistAtom } from '@unionkeyhq/kit-bg/src/states/jotai/atoms';

export const useIsEnableTransferAllowList = () => {
  const [settings] = useSettingsPersistAtom();
  const isEnableTransferAllowList = useMemo(
    () => settings.transferAllowList ?? false,
    [settings.transferAllowList],
  );
  return isEnableTransferAllowList;
};
