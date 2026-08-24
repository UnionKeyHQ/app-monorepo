import { useIntl } from 'react-intl';

import { SizableText, XStack } from '@unionkeyhq/components';
import type { IHistoryListSectionGroup } from '@unionkeyhq/shared/types/history';

function TxHistorySectionHeader(props: IHistoryListSectionGroup) {
  const { title, titleKey } = props;
  const intl = useIntl();
  const titleText = title || intl.formatMessage({ id: titleKey }) || '';
  return (
    <XStack px="$2">
      <SizableText color="$textSubdued">{titleText}</SizableText>
    </XStack>
  );
}
export { TxHistorySectionHeader };
