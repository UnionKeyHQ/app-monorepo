import { useIntl } from 'react-intl';

import type { IKeyOfIcons } from '@unionkeyhq/components';
import { Badge, Icon, Stack, Toast, YStack } from '@unionkeyhq/components';
import { ListItem } from '@unionkeyhq/kit/src/components/ListItem';
import useAppNavigation from '@unionkeyhq/kit/src/hooks/useAppNavigation';
import { ETranslations } from '@unionkeyhq/shared/src/locale';
import { EModalRoutes } from '@unionkeyhq/shared/src/routes/modal';
import { EPrimePages } from '@unionkeyhq/shared/src/routes/prime';

import { usePrimeRequirements } from '../../hooks/usePrimeRequirements';

function PrimeBenefitsItem({
  icon,
  title,
  subtitle,
  onPress,
  isComingSoon,
}: {
  icon: IKeyOfIcons;
  title: string;
  subtitle: string;
  onPress: () => void;
  isComingSoon?: boolean;
}) {
  const intl = useIntl();
  return (
    <ListItem drillIn={!isComingSoon} onPress={onPress}>
      <YStack borderRadius="$3" borderCurve="continuous" bg="$brand4" p="$2">
        <Icon name={icon} size="$6" color="$brand9" />
      </YStack>
      <ListItem.Text
        userSelect="none"
        flex={1}
        primary={title}
        secondary={subtitle}
      />
      {isComingSoon ? (
        <Badge badgeSize="sm">
          <Badge.Text>
            {intl.formatMessage({
              id: ETranslations.id_prime_soon,
            })}
          </Badge.Text>
        </Badge>
      ) : null}
    </ListItem>
  );
}

export function PrimeBenefitsList() {
  const navigation = useAppNavigation();
  const intl = useIntl();
  const { ensureUnionKeyIDLoggedIn } = usePrimeRequirements();

  return (
    <Stack py="$2">
      <PrimeBenefitsItem
        icon="RepeatOutline"
        title="UnionKey Cloud"
        subtitle="Automatically back up app usage data, sync across devices."
        onPress={() => {
          navigation.navigate(EPrimePages.PrimeCloudSync);
        }}
      />
      <PrimeBenefitsItem
        isComingSoon
        icon="BezierNodesOutline"
        title="Premium RPC"
        subtitle="Enjoy rapid and secure blockchain access."
        onPress={() => {
          Toast.success({
            title: 'Premium RPC',
          });
        }}
      />
      <PrimeBenefitsItem
        isComingSoon
        icon="BellOutline"
        title="Account Activity"
        subtitle="Subscribe to activities from up to 100 accounts."
        onPress={() => {
          Toast.success({
            title: 'Account Activity',
          });
        }}
      />
      <PrimeBenefitsItem
        isComingSoon
        icon="FileTextOutline"
        title="Analytics"
        subtitle="sint occaecat cupidatat non proident"
        onPress={() => {
          Toast.success({
            title: 'Analytics',
          });
        }}
      />
      <PrimeBenefitsItem
        icon="PhoneOutline"
        title={intl.formatMessage({
          id: ETranslations.prime_device_management,
        })}
        subtitle={intl.formatMessage({
          id: ETranslations.prime_device_management_desc,
        })}
        onPress={async () => {
          await ensureUnionKeyIDLoggedIn();
          navigation.pushFullModal(EModalRoutes.PrimeModal, {
            screen: EPrimePages.PrimeDeviceLimit,
          });
        }}
      />
    </Stack>
  );
}
