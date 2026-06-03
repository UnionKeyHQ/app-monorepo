/* eslint-disable global-require */
import type { PropsWithChildren } from 'react';

import { Splash } from '@unionkey/components';

export function SplashProvider({ children }: PropsWithChildren<unknown>) {
  return <Splash>{children}</Splash>;
}
