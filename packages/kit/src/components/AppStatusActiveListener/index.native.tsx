import type { FC } from 'react';

import { useAppStateChange } from '@unionkeyhq/kit/src/hooks/useAppStateChange';

type AppStatusActiveListenerProps = { onActive: () => void };

export const AppStatusActiveListener: FC<AppStatusActiveListenerProps> = ({
  onActive,
}) => {
  useAppStateChange(onActive);
  return null;
};
