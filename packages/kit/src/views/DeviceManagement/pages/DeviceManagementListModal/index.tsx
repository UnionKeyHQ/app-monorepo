import { useCallback, useEffect, useMemo } from 'react';

import { useIntl } from 'react-intl';

import {
  Anchor,
  Icon,
  ListView,
  Page,
  SizableText,
  XStack,
} from '@unionkeyhq/components';
import backgroundApiProxy from '@unionkeyhq/kit/src/background/instance/backgroundApiProxy';
import { ListItem } from '@unionkeyhq/kit/src/components/ListItem';
import type { IWalletAvatarProps } from '@unionkeyhq/kit/src/components/WalletAvatar';
import { WalletAvatar } from '@unionkeyhq/kit/src/components/WalletAvatar';
import useAppNavigation from '@unionkeyhq/kit/src/hooks/useAppNavigation';
import { usePromiseResult } from '@unionkeyhq/kit/src/hooks/usePromiseResult';
import {
  EAppEventBusNames,
  appEventBus,
} from '@unionkeyhq/shared/src/eventBus/appEventBus';
import { ETranslations } from '@unionkeyhq/shared/src/locale';
import platformEnv from '@unionkeyhq/shared/src/platformEnv';
import {
  EModalDeviceManagementRoutes,
  EModalRoutes,
  EOnboardingPages,
  ERootRoutes,
} from '@unionkeyhq/shared/src/routes';
import deviceUtils from '@unionkeyhq/shared/src/utils/deviceUtils';
import type { IHwQrWalletWithDevice } from '@unionkeyhq/shared/types/account';

import { useBuyUnionKeyHeaderRightButton } from '../../hooks/useBuyUnionKeyHeaderRightButton';

function DeviceManagementListModal() {
  const intl = useIntl();
  const appNavigation = useAppNavigation();
  const { result: hwQrWalletList = [], run: refreshHwQrWalletList } =
    usePromiseResult<Array<IHwQrWalletWithDevice>>(
      async () => {
        const r =
          await backgroundApiProxy.serviceAccount.getAllHwQrWalletWithDevice({
            filterHiddenWallet: true,
            skipDuplicateDevice: true,
          });
        return Object.values(r)
          .filter(
            (item): item is IHwQrWalletWithDevice =>
              Boolean(item.device) && !item.wallet.deprecated,
          )
          .sort((a, b) => {
            // Sort by walletOrder or fallback to walletNo
            const orderA = a.wallet.walletOrder || a.wallet.walletNo;
            const orderB = b.wallet.walletOrder || b.wallet.walletNo;
            return orderA - orderB;
          });
      },
      [],
      {
        checkIsFocused: false,
      },
    );

  useEffect(() => {
    const fn = () => {
      void refreshHwQrWalletList();
    };
    appEventBus.on(EAppEventBusNames.WalletUpdate, fn);
    return () => {
      appEventBus.off(EAppEventBusNames.WalletUpdate, fn);
    };
  }, [refreshHwQrWalletList]);

  const onAddDevice = useCallback(async () => {
    if (platformEnv.isExtensionUiPopup || platformEnv.isExtensionUiSidePanel) {
      await backgroundApiProxy.serviceApp.openExtensionExpandTab({
        routes: [
          ERootRoutes.Modal,
          EModalRoutes.OnboardingModal,
          EOnboardingPages.ConnectYourDevice,
        ],
      });
      if (platformEnv.isExtensionUiSidePanel) {
        window.close();
      }
    } else {
      appNavigation.pushModal(EModalRoutes.OnboardingModal, {
        screen: EOnboardingPages.ConnectYourDevice,
      });
    }
  }, [appNavigation]);

  const onWalletPressed = useCallback(
    (wallet: IHwQrWalletWithDevice['wallet']) => {
      if (wallet.id) {
        appNavigation.push(EModalDeviceManagementRoutes.DeviceDetailModal, {
          walletId: wallet.id,
        });
      }
    },
    [appNavigation],
  );

  const renderItem = useCallback(
    ({ item }: { item: IHwQrWalletWithDevice }) => {
      const walletAvatarProps: IWalletAvatarProps = {
        wallet: item.wallet,
        status: 'default',
      };
      return (
        <ListItem
          title={item.wallet.name}
          subtitle={deviceUtils.buildDeviceBleName({
            features: item.device?.featuresInfo,
          })}
          drillIn
          renderAvatar={() => <WalletAvatar {...walletAvatarProps} />}
          onPress={() => {
            onWalletPressed(item.wallet);
          }}
        />
      );
    },
    [onWalletPressed],
  );

  const footer = useMemo(
    () => (
      <ListItem
        renderAvatar={() => (
          <XStack
            w="$10"
            h="$10"
            jc="center"
            ai="center"
            borderRadius="$2"
            bg="$bgStrong"
          >
            <Icon name="PlusSmallOutline" />
          </XStack>
        )}
        title={intl.formatMessage({
          id: ETranslations.global_add_new_device,
        })}
        drillIn
        onPress={onAddDevice}
      />
    ),
    [intl, onAddDevice],
  );

  const { headerRight } = useBuyUnionKeyHeaderRightButton({
    inDeviceManagementStack: true,
  });

  return (
    <Page>
      <Page.Header
        title={intl.formatMessage({
          id: ETranslations.global_device_management,
        })}
        headerRight={headerRight}
      />
      <Page.Body pb="$9">
        <ListView
          keyExtractor={(item) => item.wallet.id}
          data={hwQrWalletList}
          renderItem={renderItem}
          estimatedItemSize={68}
          ListFooterComponent={footer}
        />
        <XStack
          position="absolute"
          bottom={0}
          left={0}
          right={0}
          h="$9"
          px="$5"
          justifyContent="center"
          alignItems="center"
        >
          <SizableText size="$bodyMd" color="$textSubdued">
            {intl.formatMessage({
              id: ETranslations.global_unionkey_prompt_dont_have_yet,
            })}
          </SizableText>
          <Anchor
            display="flex"
            color="$textInteractive"
            hoverStyle={{
              color: '$textInteractiveHover',
            }}
            href="https://unionkey-wallet.myshopify.com/"
            target="_blank"
            size="$bodyMdMedium"
            p="$2"
          >
            {intl.formatMessage({ id: ETranslations.global_buy_one })}
          </Anchor>
        </XStack>
      </Page.Body>
    </Page>
  );
}

export default DeviceManagementListModal;
