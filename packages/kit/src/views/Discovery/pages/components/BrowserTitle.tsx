import { useIntl } from 'react-intl';

import { SizableText } from '@unionkeyhq/components';
import { ETranslations } from '@unionkeyhq/shared/src/locale';

export function BrowserTitle() {
  const intl = useIntl();

  return (
    <SizableText size="$headingLg" color="$text">
      {intl.formatMessage({
        id: ETranslations.global_browser,
      })}
    </SizableText>
  );
}
