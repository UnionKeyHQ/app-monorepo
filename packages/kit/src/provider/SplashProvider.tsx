/* eslint-disable global-require */
import type { PropsWithChildren } from 'react';

import { Splash } from '@unionkeyhq/components';

export function SplashProvider({ children }: PropsWithChildren<unknown>) {
  return <Splash>{children}</Splash>;
}
