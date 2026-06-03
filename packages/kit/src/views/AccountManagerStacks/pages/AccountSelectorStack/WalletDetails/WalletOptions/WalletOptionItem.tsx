import type { IIconProps, ISizableTextProps } from '@unionkey/components';
import { Icon, Spinner, Stack } from '@unionkey/components';
import type { IListItemProps } from '@unionkey/kit/src/components/ListItem';
import { ListItem } from '@unionkey/kit/src/components/ListItem';

export function WalletOptionItem({
  label,
  description,
  icon,
  iconColor = '$iconSubdued',
  isLoading,
  children,
  drillIn,
  testID,
  ...rest
}: Omit<IListItemProps, 'icon'> & {
  label: ISizableTextProps['children'];
  description?: string;
  labelColor?: ISizableTextProps['color'];
  icon?: IIconProps['name'];
  iconColor?: IIconProps['color'];
  isLoading?: boolean;
  drillIn?: boolean;
  testID?: string;
}) {
  return (
    <ListItem userSelect="none" testID={testID} {...rest}>
      {icon ? (
        <Stack px="$2">
          <Icon name={icon} color={iconColor} />
        </Stack>
      ) : null}
      <ListItem.Text primary={label} secondary={description} flex={1} />
      {children}
      {isLoading ? <Spinner /> : null}
    </ListItem>
  );
}
