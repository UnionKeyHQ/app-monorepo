import { createContext, useContext } from 'react';

import type { HyperlinkText } from '@unionkeyhq/kit/src/components/HyperlinkText';
import type { ILocaleSymbol } from '@unionkeyhq/shared/src/locale';

export type ISettingConfigContextValue = {
  theme: 'light' | 'dark';
  locale: ILocaleSymbol;
  HyperlinkText: typeof HyperlinkText;
};

export const SettingConfigContext = createContext<ISettingConfigContextValue>(
  {} as ISettingConfigContextValue,
);

export const useSettingConfig = () => useContext(SettingConfigContext);
