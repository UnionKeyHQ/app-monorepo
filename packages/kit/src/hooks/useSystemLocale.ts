import { useCallback, useState } from 'react';

import { useHandleAppStateActive } from '@unionkeyhq/kit/src/hooks/useHandleAppStateActive';
import type { ILocaleSymbol } from '@unionkeyhq/shared/src/locale';
import { getDefaultLocale } from '@unionkeyhq/shared/src/locale/getDefaultLocale';

export function useSystemLocale() {
  const [locale, setLocale] = useState<ILocaleSymbol>(getDefaultLocale());
  const onChange = useCallback(() => {
    setLocale(getDefaultLocale());
  }, []);
  useHandleAppStateActive(onChange);
  return locale;
}
