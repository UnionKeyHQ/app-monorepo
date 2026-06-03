import { useCallback, useState } from 'react';

import { useHandleAppStateActive } from '@unionkey/kit/src/hooks/useHandleAppStateActive';
import type { ILocaleSymbol } from '@unionkey/shared/src/locale';
import { getDefaultLocale } from '@unionkey/shared/src/locale/getDefaultLocale';

export function useSystemLocale() {
  const [locale, setLocale] = useState<ILocaleSymbol>(getDefaultLocale());
  const onChange = useCallback(() => {
    setLocale(getDefaultLocale());
  }, []);
  useHandleAppStateActive(onChange);
  return locale;
}
