import { useCallback } from 'react';

import { type IPropsWithTestId, useClipboard } from '@unionkey/components';
import type { IListItemProps } from '@unionkey/kit/src/components/ListItem';
import { ListItem } from '@unionkey/kit/src/components/ListItem';

interface ISectionPressItem {
  title: string;
  subtitle?: IListItemProps['subtitle'];
  onPress?: () => void;
  copyable?: boolean;
  drillIn?: boolean;
}

export function SectionPressItem({
  title,
  onPress,
  copyable,
  ...restProps
}: IPropsWithTestId<ISectionPressItem>) {
  const { copyText } = useClipboard();
  const handleCopy = useCallback(() => {
    copyText(title);
  }, [copyText, title]);
  return (
    <ListItem
      drillIn
      onPress={copyable ? handleCopy : onPress}
      title={title}
      titleProps={{ color: '$textCritical' }}
      {...restProps}
    />
  );
}
