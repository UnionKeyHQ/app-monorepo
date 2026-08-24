import { type FC, useCallback } from 'react';

import { useIntl } from 'react-intl';

import { IconButton, Toast, useClipboard } from '@unionkeyhq/components';
import { ETranslations } from '@unionkeyhq/shared/src/locale';
import platformEnv from '@unionkeyhq/shared/src/platformEnv';
import { EInputAddressChangeType } from '@unionkeyhq/shared/types/address';

import type { IAddressPluginProps } from '../types';

export const ClipboardPlugin: FC<IAddressPluginProps> = ({
  onChange,
  onInputTypeChange,
  testID,
  disabled,
}) => {
  const { getClipboard } = useClipboard();
  const intl = useIntl();
  const onPress = useCallback(async () => {
    const text = await getClipboard();
    onChange?.(text);
    onInputTypeChange?.(EInputAddressChangeType.Paste);

    if (text?.length) {
      Toast.success({
        title: intl.formatMessage({
          id: ETranslations.feedback_address_pasted_text,
        }),
      });
    }
  }, [getClipboard, intl, onChange, onInputTypeChange]);
  return platformEnv.isExtensionUiPopup ||
    platformEnv.isExtensionUiSidePanel ? null : (
    <IconButton
      title={intl.formatMessage({ id: ETranslations.send_to_paste_tooltip })}
      variant="tertiary"
      icon="ClipboardOutline"
      disabled={disabled}
      onPress={disabled ? undefined : onPress}
      testID={testID}
    />
  );
};
