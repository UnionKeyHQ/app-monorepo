import { useIntl } from 'react-intl';

import { SizableText } from '@unionkey/components';
import { ETranslations } from '@unionkey/shared/src/locale';

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
