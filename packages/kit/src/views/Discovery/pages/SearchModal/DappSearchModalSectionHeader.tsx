import { useIntl } from 'react-intl';

import { Button, Heading, XStack } from '@unionkeyhq/components';
import { ETranslations } from '@unionkeyhq/shared/src/locale';

export function DappSearchModalSectionHeader({
  title,
  onMorePress,
}: {
  title: string;
  onMorePress: () => void;
}) {
  const intl = useIntl();
  return (
    <XStack px="$5" pb="$2" alignItems="center" justifyContent="space-between">
      <Heading size="$headingMd">{title}</Heading>
      <Button variant="tertiary" size="medium" onPressIn={onMorePress}>
        {intl.formatMessage({ id: ETranslations.explore_see_all })}
      </Button>
    </XStack>
  );
}
