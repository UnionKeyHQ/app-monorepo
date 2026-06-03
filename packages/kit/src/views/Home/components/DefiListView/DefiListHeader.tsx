import { useIntl } from 'react-intl';

import { SizableText, XStack } from '@unionkey/components';
import { ETranslations } from '@unionkey/shared/src/locale';

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
