import { useIntl } from 'react-intl';

import { SizableText, XStack } from '@unionkeyhq/components';
import { ETranslations } from '@unionkeyhq/shared/src/locale';

function DefiListHeader() {
  const intl = useIntl();
  return (
    <XStack px="$2">
      <SizableText size="$headingLg">
        {intl.formatMessage({ id: ETranslations.global_asset })}
      </SizableText>
    </XStack>
  );
}

export { DefiListHeader };
