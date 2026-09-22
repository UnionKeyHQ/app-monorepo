import { useCallback } from 'react';

import { useIntl } from 'react-intl';

import { ToastManager } from '@unionkeyhq/components';
import type { LocaleIds } from '@unionkeyhq/components/src/locale';
import {
  copyToClipboard,
  getClipboard,
} from '@unionkeyhq/components/src/utils/ClipboardUtils';
import platformEnv from '@unionkeyhq/shared/src/platformEnv';

export function useClipboard() {
  const intl = useIntl();

  const { canGetClipboard } = platformEnv;
  const copyText = useCallback(
    (address: string, successMessageId?: LocaleIds) => {
      if (!address) return;
      setTimeout(() => copyToClipboard(address), 200);
      // msg__copied
      // msg__address_copied
      // msg__url_copied
      ToastManager.show({
        title: intl.formatMessage({ id: successMessageId || 'msg__copied' }),
      });
    },
    [intl],
  );

  return { copyText, getClipboard, canGetClipboard };
}
