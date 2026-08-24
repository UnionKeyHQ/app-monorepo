import type { PropsWithChildren } from 'react';

import { useSettingsPersistAtom } from '@unionkeyhq/kit-bg/src/states/jotai/atoms';
import platformEnv from '@unionkeyhq/shared/src/platformEnv';

export const useReviewControl = () => {
  const [{ reviewControl }] = useSettingsPersistAtom();
  if (platformEnv.isAppleStoreEnv || platformEnv.isMas) {
    return Boolean(reviewControl);
  }
  return true;
};

export const ReviewControl = ({ children }: PropsWithChildren) => {
  const show = useReviewControl();
  return show ? children : null;
};
