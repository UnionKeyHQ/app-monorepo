import { useCallback, useEffect, useState } from 'react';

import { useNavigation } from '@react-navigation/core';
import { useRoute } from '@react-navigation/native';
import { useIntl } from 'react-intl';

import {
  Box,
  Button,
  Image,
  Menu,
  Text,
  useUserDevice,
} from '@unionkeyhq/components';
import LogoPressImage from '@unionkeyhq/kit/assets/onboarding/welcome_hardware.png';
import {
  AppUIEventBusNames,
  appUIEventBus,
} from '@unionkeyhq/shared/src/eventBus/appUIEventBus';
import platformEnv from '@unionkeyhq/shared/src/platformEnv';

import backgroundApiProxy from '../../../../background/instance/backgroundApiProxy';
import { useNavigationActions } from '../../../../hooks';
import {
  CreateWalletModalRoutes,
  ModalRoutes,
  RootRoutes,
} from '../../../../routes/routesEnum';
import { setOnBoardingLoadingBehindModal } from '../../../../store/reducers/runtime';
import Layout from '../../Layout';
import { useOnboardingContext } from '../../OnboardingContext';
import { EOnboardingRoutes } from '../../routes/enums';

import TermsOfService from './TermsOfService';

import type { IOnboardingRoutesParams } from '../../routes/types';
import type { RouteProp } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';

type NavigationProps = StackNavigationProp<
  IOnboardingRoutesParams,
  EOnboardingRoutes.Welcome
>;

type RouteProps = RouteProp<IOnboardingRoutesParams, EOnboardingRoutes.Welcome>;

const Welcome = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // const navigation = useAppNavigation();
  const navigation = useNavigation<NavigationProps>();
  const navigationActions = useNavigationActions();
  if (process.env.NODE_ENV !== 'production') {
    global.$$navigationActions = navigationActions;
  }

  const route = useRoute<RouteProps>();
  const [disableAnimation, setDisableAnimation] = useState(
    !!route?.params?.disableAnimation,
  );
  const resetLayoutAnimation = useCallback(
    () => setDisableAnimation(!!route?.params?.disableAnimation),
    [route],
  );

  const context = useOnboardingContext();
  const forceVisibleUnfocused = context?.forceVisibleUnfocused;

  useEffect(() => {
    (async function () {
      if (
        platformEnv.isExtensionUiPopup ||
        platformEnv.isExtensionUiStandaloneWindow
      ) {
        if (await backgroundApiProxy.serviceApp.isResettingApp()) {
          return;
        }
        // open onBoarding by browser tab
        backgroundApiProxy.serviceApp.openExtensionExpandTab({
          routes: [RootRoutes.Onboarding, EOnboardingRoutes.Welcome],
          params: {},
        });
        setTimeout(() => {
          window.close();
        }, 200);
      }
    })();
  }, []);

  useEffect(() => {
    // Fix cardano webembed crash when onboarding page is closed on Android platform.
    if (platformEnv.isNative) {
      appUIEventBus.emit(AppUIEventBusNames.ChainWebEmbedDisabled);
    }
  }, []);

  const intl = useIntl();
  const isSmallHeight = useUserDevice().screenHeight <= 667;
  // const goBack = useNavigationBack();
  // const insets = useSafeAreaInsets();

  const onPressCreateWallet = useCallback(() => {
    resetLayoutAnimation();
    backgroundApiProxy.dispatch(setOnBoardingLoadingBehindModal(false));
    navigation.navigate(EOnboardingRoutes.SetPassword);
  }, [navigation, resetLayoutAnimation]);
  const onPressImportWallet = useCallback(() => {
    resetLayoutAnimation();
    backgroundApiProxy.dispatch(setOnBoardingLoadingBehindModal(false));
    navigation.navigate(EOnboardingRoutes.ImportWallet);
  }, [navigation, resetLayoutAnimation]);

  const onPressHardwareWallet = useCallback(() => {
    setDisableAnimation(true);
    forceVisibleUnfocused?.();
    backgroundApiProxy.dispatch(setOnBoardingLoadingBehindModal(false));
    if (disableAnimation) {
      navigation.navigate(
        RootRoutes.Modal as any,
        {
          screen: ModalRoutes.CreateWallet,
          params: {
            screen: CreateWalletModalRoutes.ConnectHardwareModal,
          },
        } as any,
      );
    } else {
      setTimeout(() => {
        navigation.navigate(
          RootRoutes.Modal as any,
          {
            screen: ModalRoutes.CreateWallet,
            params: {
              screen: CreateWalletModalRoutes.ConnectHardwareModal,
            },
          } as any,
        );
      }, 100);
    }
  }, [forceVisibleUnfocused, navigation, disableAnimation]);

  const onPressThirdPartyWallet = useCallback(() => {
    resetLayoutAnimation();
    backgroundApiProxy.dispatch(setOnBoardingLoadingBehindModal(false));
    setTimeout(() => navigation.navigate(EOnboardingRoutes.ThirdPartyWallet));
  }, [navigation, resetLayoutAnimation]);

  return (
    <>
      <Layout
        showCloseButton
        backButton={false}
        pt={{ base: isSmallHeight ? 8 : 20, sm: 0 }}
        scaleFade
        disableAnimation={disableAnimation}
      >
        <Box flex={1} alignItems="center" justifyContent="center">
          <Image
            source={LogoPressImage}
            w={{ base: '220px', sm: '320px' }}
            h={{ base: '220px', sm: '320px' }}
            resizeMode="contain"
          />
        </Box>
        <Box mt="auto" alignItems="center">
          <Text
            typography={{ sm: 'DisplayXLarge', md: 'Display2XLarge' }}
            textAlign="center"
          >
            {intl.formatMessage({ id: 'onboarding__landing_welcome_title' })}
          </Text>
          <Text mt={2} color="text-subdued" textAlign="center">
            {intl.formatMessage({ id: 'onboarding__landing_welcome_desc' })}
          </Text>
        </Box>
        <Box w="full" maxW="384px" alignSelf="center" mt={8}>
          <Button
            size="xl"
            type="primary"
            leftIconName="UsbCableOutline"
            onPress={onPressHardwareWallet}
          >
            {intl.formatMessage({ id: 'action__connect_hardware_wallet' })}
          </Button>
          <Menu
            w="344px"
            placement="top"
            trigger={(triggerProps) => (
              <Button size="xl" mt={3} {...triggerProps}>
                {intl.formatMessage({ id: 'action__create_wallet' })}
                {' / '}
                {intl.formatMessage({ id: 'action__import_wallet' })}
              </Button>
            )}
          >
            <Menu.CustomItem
              icon="PlusCircleOutline"
              onPress={onPressCreateWallet}
            >
              {intl.formatMessage({ id: 'action__create_wallet' })}
            </Menu.CustomItem>
            <Menu.CustomItem
              icon="ArrowDownCircleOutline"
              onPress={onPressImportWallet}
            >
              {intl.formatMessage({ id: 'action__import_wallet' })}
            </Menu.CustomItem>
            <Menu.CustomItem
              icon="LinkOutline"
              onPress={onPressThirdPartyWallet}
            >
              {intl.formatMessage({ id: 'action__connect_wallet' })}
            </Menu.CustomItem>
          </Menu>
        </Box>
      </Layout>
      <TermsOfService />
    </>
  );
};

export default Welcome;
