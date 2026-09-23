import { memo, useCallback, useEffect, useState } from 'react';

import { useRoute } from '@react-navigation/native';
import { useIntl } from 'react-intl';

import {
  Box,
  Center,
  Image,
  Spinner,
  ToastManager,
  Typography,
} from '@unionkeyhq/components';
import type { LocaleIds } from '@unionkeyhq/components/src/locale';
import { OneKeyErrorClassNames } from '@unionkeyhq/engine/src/errors';
import CreatingWalletImage from '@unionkeyhq/kit/assets/icon_01mdpi.png';
import CreatingStepImage from '@unionkeyhq/kit/assets/icon_02mdpi.png';
import AccountsStepImage from '@unionkeyhq/kit/assets/icon_03mdpi.png';
import EncryptionStepImage from '@unionkeyhq/kit/assets/icon_05mdpi.png';
import WalletSetupBackground from '@unionkeyhq/kit/assets/success.png';
import type { SearchDevice } from '@unionkeyhq/kit/src/utils/hardware';
import { deviceUtils } from '@unionkeyhq/kit/src/utils/hardware';
import debugLogger from '@unionkeyhq/shared/src/logger/debugLogger';
import timelinePerfTrace, {
  ETimelinePerfNames,
} from '@unionkeyhq/shared/src/perf/timelinePerfTrace';
import platformEnv from '@unionkeyhq/shared/src/platformEnv';
import type { IOneKeyDeviceFeatures } from '@unionkeyhq/shared/types';

import backgroundApiProxy from '../../../../../background/instance/backgroundApiProxy';
import useAppNavigation from '../../../../../hooks/useAppNavigation';
import { useDisableNavigationBack } from '../../../../../hooks/useDisableNavigationBack';
import { useOnboardingDone } from '../../../../../hooks/useOnboardingRequired';
import { setEnableLocalAuthentication } from '../../../../../store/reducers/settings';
import { getTimeDurationMs, wait } from '../../../../../utils/helper';
import { savePassword } from '../../../../../utils/localAuthentication';
import { useOnboardingClose } from '../../../hooks';
import Layout from '../../../Layout';
import { useOnboardingContext } from '../../../OnboardingContext';

import type { EOnboardingRoutes } from '../../../routes/enums';
import type {
  IOnboardingBehindTheSceneParams,
  IOnboardingRoutesParams,
} from '../../../routes/types';
import type { RouteProp } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type NavigationProps = StackNavigationProp<
  IOnboardingRoutesParams,
  EOnboardingRoutes.BehindTheScene
>;
type RouteProps = RouteProp<
  IOnboardingRoutesParams,
  EOnboardingRoutes.BehindTheScene
>;

function BehindTheSceneCreatingWallet({
  routeParams,
  handleWalletCreated,
  shouldStartCreating,
  onPressOnboardingFinished,
  setIsNavBackDisabled,
}: {
  routeParams: IOnboardingBehindTheSceneParams;
  handleWalletCreated: () => void;
  shouldStartCreating: boolean;
  onPressOnboardingFinished?: () => Promise<void>;
  setIsNavBackDisabled?: (b: boolean) => void;
}) {
  const intl = useIntl();
  const navigation = useAppNavigation();
  const { onboardingGoBack } = useOnboardingClose();
  const {
    password,
    mnemonic,
    withEnableAuthentication,
    isHardwareCreating,
    entry,
  } = routeParams;

  const context = useOnboardingContext();
  const forceVisibleUnfocused = context?.forceVisibleUnfocused;

  const startCreatingHardwareWallet = useCallback(async () => {
    try {
      const device: SearchDevice | undefined = isHardwareCreating?.device;
      const features: IOneKeyDeviceFeatures | undefined =
        isHardwareCreating?.features;
      if (!device || !features) {
        return false;
      }

      await backgroundApiProxy.serviceAccount.createHWWallet({
        features,
        connectId: device.connectId ?? '',
      });

      // safeGoBack();

      forceVisibleUnfocused?.();

      // NOT need show Hardware setup success modal anymore
      /*
      navigation.navigate(RootRoutes.Modal, {
        screen: ModalRoutes.CreateWallet,
        params: {
          screen: CreateWalletModalRoutes.SetupSuccessModal,
          params: {
            device,
            onPressOnboardingFinished,
          },
        },
      });
      */

      return true;
    } catch (e: any) {
      debugLogger.common.error(e);
      if (navigation.canGoBack?.() && entry === 'walletSelector') {
        debugLogger.common.info('go back when entry is wallet selector');
        setTimeout(() => navigation.goBack(), 300);
      }
      const { className, message, data } = e || {};
      if (className === OneKeyErrorClassNames.OneKeyAlreadyExistWalletError) {
        setTimeout(() => {
          const { walletName: existsWalletName } = data || {};
          if (existsWalletName) {
            ToastManager.show(
              {
                title: intl.formatMessage(
                  { id: 'msg__wallet_already_exist_activated_automatically' },
                  { 0: existsWalletName },
                ),
              },
              { type: 'default' },
            );
          }
          // await onboarding close and then go to home
        }, 600 + 500);

        onPressOnboardingFinished?.();
      } else if (className === OneKeyErrorClassNames.OneKeyHardwareError) {
        deviceUtils.showErrorToast(e);
      } else {
        ToastManager.show(
          {
            title: message,
          },
          {
            type: 'default',
          },
        );
      }
    }
    return false;
  }, [
    isHardwareCreating?.device,
    isHardwareCreating?.features,
    forceVisibleUnfocused,
    onPressOnboardingFinished,
    intl,
    navigation,
    entry,
  ]);

  const startCreatingHDWallet = useCallback(async () => {
    if (!password || !mnemonic) {
      return false;
    }
    try {
      // Recover from an interrupted post-create refresh. The wallet may have
      // already been committed to IndexedDB while the previous UI call was
      // still waiting, so do not create the same mnemonic a second time.
      const normalizedMnemonic = mnemonic.trim();
      const existingWallets = await backgroundApiProxy.engine.getWallets();
      for (const wallet of existingWallets) {
        if (wallet.type === 'hd') {
          try {
            const existingMnemonic =
              await backgroundApiProxy.engine.revealHDWalletMnemonic(
                wallet.id,
                password,
              );
            if (existingMnemonic.trim() === normalizedMnemonic) {
              backgroundApiProxy.serviceAccount.initWallets();
              return true;
            }
          } catch {
            // A different password or non-readable wallet is not a match.
          }
        }
      }

      // wait first typing animation start
      await wait(300); // 1500, 300
      const p1 = performance.now();
      debugLogger.onBoarding.info('startCreatingHDWallet');

      timelinePerfTrace.clear(ETimelinePerfNames.createHDWallet);
      timelinePerfTrace.mark({
        name: ETimelinePerfNames.createHDWallet,
        title: 'onboarding.createHDWallet >> start ===========================',
      });
      await backgroundApiProxy.serviceAccount.createHDWallet({
        password,
        mnemonic,
        dispatchActionDelay: 300, // should dispatchAction before postCreated
        postCreatedDelay: 600,
      });

      timelinePerfTrace.mark({
        name: ETimelinePerfNames.createHDWallet,
        title: 'onboarding.createHDWallet >> createHDWallet DONE',
      });

      if (withEnableAuthentication) {
        backgroundApiProxy.dispatch(setEnableLocalAuthentication(true));
        savePassword(password);
      }
      const p2 = performance.now();
      timelinePerfTrace.mark({
        name: ETimelinePerfNames.createHDWallet,
        title: 'onboarding.createHDWallet >> end',
      });
      debugLogger.onBoarding.info(
        'startCreatingHDWallet done!',
        Math.round(p2 - p1),
      );
      return true;
    } catch (e) {
      debugLogger.common.error(e);
      const errorKey = (e as { key: LocaleIds }).key;
      ToastManager.show(
        { title: intl.formatMessage({ id: errorKey }) },
        { type: 'error' },
      );
    }
    return false;
  }, [intl, mnemonic, password, withEnableAuthentication]);

  useEffect(() => {
    (async function () {
      if (!shouldStartCreating) {
        return;
      }
      if (!forceVisibleUnfocused) {
        return;
      }
      let result = false;
      if (isHardwareCreating) {
        result = await startCreatingHardwareWallet();
      } else {
        result = await startCreatingHDWallet();
      }
      if (result) {
        handleWalletCreated();
      } else {
        setIsNavBackDisabled?.(false);
        setTimeout(() => onboardingGoBack(), 600);
      }
    })();
  }, [
    setIsNavBackDisabled,
    forceVisibleUnfocused,
    onboardingGoBack,
    handleWalletCreated,
    startCreatingHDWallet,
    isHardwareCreating,
    startCreatingHardwareWallet,
    shouldStartCreating,
  ]);

  return null;
}

const BehindTheSceneCreatingWalletMemo = memo(BehindTheSceneCreatingWallet);

const BehindTheScene = () => {
  const intl = useIntl();
  const onboardingDone = useOnboardingDone();
  const route = useRoute<RouteProps>();
  const routeParams = route.params || {};
  const [isNavBackDisabled, setIsNavBackDisabled] = useState(true);
  useDisableNavigationBack({ condition: isNavBackDisabled });
  const [showCloseButton, setShowCloseButton] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [walletCreated, setWalletCreated] = useState(false);
  useEffect(() => {
    const timer = setTimeout(
      () => setShowCloseButton(true),
      getTimeDurationMs({ minute: 1 }),
    );

    return () => {
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (currentStep >= 2) return;
    const timer = setTimeout(
      () => setCurrentStep((previousStep) => previousStep + 1),
      1400,
    );
    return () => clearTimeout(timer);
  }, [currentStep]);

  useEffect(() => {
    if (!walletCreated || currentStep < 2) return;
    const timer = setTimeout(() => setCurrentStep(3), 1400);
    return () => clearTimeout(timer);
  }, [currentStep, walletCreated]);

  const onPressFinished = useCallback(async () => {
    setIsNavBackDisabled(false);
    if (platformEnv.isExtension) {
      // await wait(1000);
      // window.close();
      await onboardingDone({ delay: 600 });
    } else {
      await onboardingDone({ delay: 600 });
    }
  }, [onboardingDone]);

  useEffect(() => {
    if (currentStep !== 3) return;
    const timer = setTimeout(() => {
      onPressFinished().catch((error) => debugLogger.common.error(error));
    }, 1400);
    return () => clearTimeout(timer);
  }, [currentStep, onPressFinished]);

  const handleWalletCreated = useCallback(() => {
    debugLogger.onBoarding.info('Wallet Created Success !!!!');
    setWalletCreated(true);
  }, []);

  const formatStepLabel = useCallback(
    (id: LocaleIds) =>
      intl
        .formatMessage({ id })
        .replace(/<\/?(?:a|b)>/g, '')
        .trim(),
    [intl],
  );

  const steps = [
    {
      label: formatStepLabel('content__creating_your_wallet'),
      source: CreatingStepImage,
      position: { top: '28%', left: '16px' },
    },
    {
      label: formatStepLabel('content__generating_your_accounts'),
      source: AccountsStepImage,
      position: { top: '45%', right: '16px' },
    },
    {
      label: formatStepLabel('content__encrypting_your_data'),
      source: EncryptionStepImage,
      position: { top: '70%', left: '50%', ml: '-110px' },
    },
  ];

  return (
    <Layout backButton={false} showCloseButton={showCloseButton} fullHeight>
      <BehindTheSceneCreatingWalletMemo
        routeParams={routeParams}
        handleWalletCreated={handleWalletCreated}
        shouldStartCreating
        onPressOnboardingFinished={onPressFinished}
        setIsNavBackDisabled={setIsNavBackDisabled}
      />
      <Box
        position="relative"
        minH="640px"
        h="640px"
        w="full"
        overflow="hidden"
      >
        <Image
          source={WalletSetupBackground}
          position="absolute"
          top={0}
          left={0}
          w="full"
          h="full"
          resizeMode="cover"
        />
        <Image
          source={CreatingWalletImage}
          position="absolute"
          top="135px"
          left="130px"
          w="64px"
          h="64px"
          resizeMode="contain"
        />
        <Center position="absolute" top="42%" left={0} right={0}>
          {currentStep < 3 ? <Spinner size="lg" /> : null}
        </Center>
        {steps.map((item, index) =>
          index <= currentStep ? (
            <Box
              key={item.label}
              position="absolute"
              {...item.position}
              w="220px"
              alignItems="center"
              zIndex={index === currentStep ? 10 : 1}
            >
              <Image
                source={item.source}
                w="80px"
                h="80px"
                resizeMode="contain"
              />
              <Typography.Heading mt={4} textAlign="center">
                {item.label}
              </Typography.Heading>
            </Box>
          ) : null,
        )}
        {currentStep === 3 ? (
          <Center position="absolute" top="42%" left={0} right={0}>
            <Typography.DisplayLarge textAlign="center">
              {intl.formatMessage({ id: 'msg__account_created' })}
            </Typography.DisplayLarge>
          </Center>
        ) : null}
      </Box>
    </Layout>
  );
};

export default memo(BehindTheScene);
