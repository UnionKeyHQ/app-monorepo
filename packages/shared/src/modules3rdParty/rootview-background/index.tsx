import platformEnv from '@unionkeyhq/shared/src/platformEnv';

import type { IUpdateRootViewBackgroundColor } from './type';

export const THEME_PRELOAD_STORAGE_KEY = 'UNIONKEY_THEME_PRELOAD';

export const updateRootViewBackgroundColor: IUpdateRootViewBackgroundColor = (
  color: string,
  theme: 'light' | 'dark',
) => {
  setTimeout(() => {
    localStorage.setItem(THEME_PRELOAD_STORAGE_KEY, theme);
    // startup theme on desktop: apps/desktop/app/app.ts 213L
    if (platformEnv.isDesktop) {
      globalThis.desktopApi?.changeTheme(theme);
    }
  });
};
