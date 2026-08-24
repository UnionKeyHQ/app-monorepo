import { useCallback, useMemo } from 'react';

import { useIntl } from 'react-intl';

import {
  Dialog,
  Icon,
  IconButton,
  SizableText,
  XStack,
  YStack,
  rootNavigationRef,
  useClipboard,
} from '@unionkeyhq/components';
import backgroundApiProxy from '@unionkeyhq/kit/src/background/instance/backgroundApiProxy';
import { FormatHyperlinkText } from '@unionkeyhq/kit/src/components/HyperlinkText';
import { UNIONKEY_URL } from '@unionkeyhq/shared/src/config/appConfig';
import { ETranslations } from '@unionkeyhq/shared/src/locale';
import { defaultLogger } from '@unionkeyhq/shared/src/logger/logger';
import {
  EModalReferFriendsRoutes,
  EModalRoutes,
  ERootRoutes,
} from '@unionkeyhq/shared/src/routes';
import { ESpotlightTour } from '@unionkeyhq/shared/src/spotlight';
import { openUrlExternal } from '@unionkeyhq/shared/src/utils/openUrlUtils';

import useAppNavigation from './useAppNavigation';
import { useLoginUnionKeyId } from './useLoginUnionKeyId';

// use rootNavigationRef to navigate
export function useToReferFriendsModalByRootNavigation() {
  return useCallback(async () => {
    const isLogin = await backgroundApiProxy.servicePrime.isLoggedIn();

    const screen = isLogin
      ? EModalReferFriendsRoutes.InviteReward
      : EModalReferFriendsRoutes.ReferAFriend;

    rootNavigationRef.current?.navigate(ERootRoutes.Modal, {
      screen: EModalRoutes.ReferFriendsModal,
      params: {
        screen,
      },
    });
  }, []);
}

export const isOpenedReferFriendsPage = () => {
  const routeState = rootNavigationRef.current?.getRootState();
  if (routeState?.routes) {
    return routeState.routes.find(
      // @ts-expect-error
      (route) => route.params?.screen === EModalRoutes.ReferFriendsModal,
    );
  }
  return false;
};

export const useReferFriends = () => {
  const intl = useIntl();
  const navigation = useAppNavigation();
  const { loginUnionKeyId } = useLoginUnionKeyId();

  const toInviteRewardPage = useCallback(async () => {
    const isLogin = await backgroundApiProxy.servicePrime.isLoggedIn();
    if (isLogin) {
      navigation.pushModal(EModalRoutes.ReferFriendsModal, {
        screen: EModalReferFriendsRoutes.InviteReward,
      });
    } else {
      void loginUnionKeyId({ toUnionKeyIdPageOnLoginSuccess: true });
    }
  }, [loginUnionKeyId, navigation]);

  const toReferFriendsPage = useCallback(async () => {
    const isLogin = await backgroundApiProxy.servicePrime.isLoggedIn();
    const isVisited = await backgroundApiProxy.serviceSpotlight.isVisited(
      ESpotlightTour.referAFriend,
    );
    if (isLogin && isVisited) {
      navigation.pushModal(EModalRoutes.ReferFriendsModal, {
        screen: EModalReferFriendsRoutes.InviteReward,
      });
    } else {
      navigation.pushModal(EModalRoutes.ReferFriendsModal, {
        screen: EModalReferFriendsRoutes.ReferAFriend,
      });
    }
  }, [navigation]);

  const { copyText } = useClipboard();

  const shareReferRewards = useCallback(
    async (onSuccess?: () => void, onFail?: () => void) => {
      const isLogin = await backgroundApiProxy.servicePrime.isLoggedIn();
      const myReferralCode =
        await backgroundApiProxy.serviceReferralCode.getMyReferralCode();

      const postConfig =
        await backgroundApiProxy.serviceReferralCode.getPostConfig();

      const handleConfirm = () => {
        if (isLogin) {
          navigation.pushModal(EModalRoutes.ReferFriendsModal, {
            screen: EModalReferFriendsRoutes.InviteReward,
          });
        } else {
          void loginUnionKeyId({ toUnionKeyIdPageOnLoginSuccess: true });
        }
      };
      const dialog = Dialog.show({
        icon: 'GiftOutline',
        title: postConfig.locales.Earn.title,
        description: (
          <FormatHyperlinkText
            size="$bodyMd"
            underlineTextProps={{ color: '$textInfo' }}
            onAction={() => {
              void dialog.close();
            }}
          >
            {postConfig.locales.Earn.subtitle}
          </FormatHyperlinkText>
        ),
        renderContent: isLogin ? (
          <YStack gap="$5">
            <YStack gap="$1">
              <SizableText size="$bodyMdMedium">
                {intl.formatMessage({ id: ETranslations.referral_your_code })}
              </SizableText>
              <XStack gap="$3" ai="center">
                <SizableText size="$headingXl">{myReferralCode}</SizableText>
                <IconButton
                  title={intl.formatMessage({ id: ETranslations.global_copy })}
                  variant="tertiary"
                  icon="Copy3Outline"
                  size="small"
                  iconColor="$iconSubdued"
                  onPress={() => {
                    copyText(myReferralCode);
                    defaultLogger.referral.page.copyReferralCode();
                  }}
                />
              </XStack>
            </YStack>
          </YStack>
        ) : (
          <YStack gap="$5">
            <XStack gap="$4">
              <XStack h={42} w={42} p={9} borderRadius={13} bg="$bgSuccess">
                <Icon name="PeopleOutline" color="$iconSuccess" size={20} />
              </XStack>
              <YStack flexShrink={1}>
                <SizableText size="$headingMd">
                  {postConfig.locales.Earn.for_tou.title}
                </SizableText>
                <SizableText mt="$1" size="$bodyMd" color="$textSubdued">
                  {postConfig.locales.Earn.for_tou.subtitle}
                </SizableText>
              </YStack>
            </XStack>
            <XStack gap="$4">
              <XStack h={42} w={42} p={9} borderRadius={13} bg="$bgInfo">
                <Icon name="PeopleLikeOutline" color="$iconInfo" size={20} />
              </XStack>
              <YStack flexShrink={1}>
                <SizableText size="$headingMd">
                  {postConfig.locales.Earn.for_your_friend.title}
                </SizableText>
                <SizableText mt="$1" size="$bodyMd" color="$textSubdued">
                  {postConfig.locales.Earn.for_your_friend.subtitle}
                </SizableText>
              </YStack>
            </XStack>
          </YStack>
        ),
        onCancelText: intl.formatMessage({
          id: ETranslations.referral_intro_learn_more,
        }),
        onCancel: () => {
          openUrlExternal(UNIONKEY_URL);
        },
        cancelButtonProps: {
          iconAfter: 'OpenOutline',
        },
        onConfirmText: intl.formatMessage({
          id: isLogin
            ? ETranslations.earn_referral_view_rewards
            : ETranslations.global_join,
        }),
        onConfirm: handleConfirm,
      });
    },
    [copyText, intl, loginUnionKeyId, navigation],
  );

  return useMemo(
    () => ({
      toReferFriendsPage,
      shareReferRewards,
      toInviteRewardPage,
    }),
    [toReferFriendsPage, shareReferRewards, toInviteRewardPage],
  );
};
