import { useSettingsPersistAtom } from '@unionkeyhq/kit-bg/src/states/jotai/atoms';

import { useSystemLocale } from './useSystemLocale';

export function useLocaleVariant() {
  const [{ locale }] = useSettingsPersistAtom();
  const systemLocale = useSystemLocale();
  return locale === 'system' ? systemLocale : locale;
}
