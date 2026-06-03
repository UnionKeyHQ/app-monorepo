import { useCallback } from 'react';

import { useIntl } from 'react-intl';

import {
  Badge,
  Icon,
  IconButton,
  LinearGradient,
  Page,
  SizableText,
  Stack,
  XStack,
  YStack,
} from '@unionkey/components';
import { ListItem } from '@unionkey/kit/src/components/ListItem';
import useAppNavigation from '@unionkey/kit/src/hooks/useAppNavigation';
import { ETranslations } from '@unionkey/shared/src/locale';
import { defaultLogger } from '@unionkey/shared/src/logger/logger';
import {
  EModalReferFriendsRoutes,
  EModalRoutes,
} from '@unionkey/shared/src/routes';
import { EPrimePages } from '@unionkey/shared/src/routes/prime';

import { usePrimeAvailable } from '../../../Prime/hooks/usePrimeAvailable';
import { PrimeUserInfo } from '../../../Prime/pages/PrimeDashboard/PrimeUserInfo';

export default function UnionKeyId() {
  const intl = useIntl();
  const navigation = useAppNavigation();
  const toInviteRewardPage = useCallback(() => {
    navigation.push(EModalReferFriendsRoutes.InviteReward);
  }, [navigation]);
  const { isPrimeAvailable } = usePrimeAvailable();

  const toPrimePage = useCallback(() => {
    if (isPrimeAvailable)
      navigation.pushFullModal(EModalRoutes.PrimeModal, {
        screen: EPrimePages.PrimeDashboard,
      });
  }, [navigation, isPrimeAvailable]);

  return (
    <Page scrollEnabled>
      <Page.Header title="UnionKey ID" />
      <Page.Body>
        <YStack>
          <YStack p="$5" ai="center" jc="center">
            <LinearGradient
              bg="$bgInverse"
              borderRadius="$3"
              colors={['rgba(255, 255, 255, 0.2)', 'rgba(255, 255, 255, 0)']}
              width={56}
              height={56}
              jc="center"
              ai="center"
            >
              <Icon size="$8" name="PeopleSolid" color="$iconInverse" />
            </LinearGradient>
            <SizableText pt="$5" pb="$2" size="$heading2xl">
              UnionKey ID
            </SizableText>
            <SizableText color="$textSubdued" size="$bodyLg">
              {intl.formatMessage({ id: ETranslations.id_desc })}
            </SizableText>
          </YStack>
          <Stack p="$5">
            <PrimeUserInfo
              onLogoutSuccess={async () => {
                defaultLogger.referral.page.logoutUnionKeyIDResult();
                navigation.popStack();
              }}
            />
          </Stack>
          <YStack>
            <ListItem
              userSelect="none"
              renderAvatar={
                <XStack
                  borderRadius="$3"
                  bg="$brand7"
                  w="$12"
                  h="$12"
                  ai="center"
                  jc="center"
                >
                  <Icon name="PrimeSolid" color="$brand12" size="$6" />
                </XStack>
              }
              title="UnionKey Prime"
              subtitle={intl.formatMessage({
                id: ETranslations.id_prime,
              })}
              onPress={toPrimePage}
            >
              {isPrimeAvailable ? (
                <IconButton
                  icon="ChevronRightSmallOutline"
                  variant="tertiary"
                  size="small"
                />
              ) : (
                <Badge badgeSize="sm">
                  <Badge.Text>
                    {intl.formatMessage({
                      id: ETranslations.id_prime_soon,
                    })}
                  </Badge.Text>
                </Badge>
              )}
            </ListItem>
            <ListItem
              userSelect="none"
              renderAvatar={
                <XStack
                  borderRadius="$3"
                  bg="$purple8"
                  w="$12"
                  h="$12"
                  ai="center"
                  jc="center"
                >
                  <Icon name="GiftSolid" color="$purple12" size="$6" />
                </XStack>
              }
              title={intl.formatMessage({
                id: ETranslations.id_refer_a_friend,
              })}
              subtitle={intl.formatMessage({
                id: ETranslations.id_refer_a_friend_desc,
              })}
              onPress={toInviteRewardPage}
            >
              <IconButton
                icon="ChevronRightSmallOutline"
                variant="tertiary"
                size="small"
              />
            </ListItem>
          </YStack>
        </YStack>
      </Page.Body>
    </Page>
  );
}
