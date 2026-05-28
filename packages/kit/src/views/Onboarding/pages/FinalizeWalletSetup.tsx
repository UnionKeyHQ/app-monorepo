import { useCallback, useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import { useThrottledCallback } from 'use-debounce';
import type { IPageScreenProps } from '@onekeyhq/components';
import {
  AnimatePresence,
  Heading,
  Icon,
  Image,
  NavCloseButton,
  Page,
  Spinner,
  Stack,
  Toast,
} from '@onekeyhq/components';
import { EMnemonicType } from '@onekeyhq/core/src/secret';
import { useWalletBoundReferralCode } from '@onekeyhq/kit/src/views/ReferFriends/hooks/useWalletBoundReferralCode';
import type { IOneKeyError } from '@onekeyhq/shared/src/errors/types/errorTypes';
import type { IAppEventBusPayload } from '@onekeyhq/shared/src/eventBus/appEventBus';
import {
  EAppEventBusNames,
  EFinalizeWalletSetupSteps,
  appEventBus,
} from '@onekeyhq/shared/src/eventBus/appEventBus';
import { ETranslations } from '@onekeyhq/shared/src/locale';
import platformEnv from '@onekeyhq/shared/src/platformEnv';
import type {
  EOnboardingPages,
  IOnboardingParamList,
} from '@onekeyhq/shared/src/routes';
import { ERootRoutes } from '@onekeyhq/shared/src/routes';
import { EAccountSelectorSceneName } from '@onekeyhq/shared/types';

import backgroundApiProxy from '../../../background/instance/backgroundApiProxy';
import { AccountSelectorProviderMirror } from '../../../components/AccountSelector';
import useAppNavigation from '../../../hooks/useAppNavigation';
import {
  useAccountSelectorActions,
  useActiveAccount,
} from '../../../states/jotai/contexts/accountSelector';
import { withPromptPasswordVerify } from '../../../utils/passwordUtils';

function FinalizeWalletSetupPage({
  route,
}: IPageScreenProps<
  IOnboardingParamList,
  EOnboardingPages.FinalizeWalletSetup
>) {
  const intl = useIntl();
  const [currentStep, setCurrentStep] = useState<EFinalizeWalletSetupSteps>(
    EFinalizeWalletSetupSteps.CreatingWallet,
  );
   
  const SUCCESS_IMAGE = require('@onekeyhq/kit/assets/success.png');
  const creatingWalletImg = require('@onekeyhq/kit/assets/icon_01mdpi.png');
  const generatingAccountsImg = require('@onekeyhq/kit/assets/icon_02mdpi.png');
  const encryptingDataImg = require('@onekeyhq/kit/assets/icon_03mdpi.png');
  const readyImg = require('@onekeyhq/kit/assets/icon_05mdpi.png');
  const [showStep, setShowStep] = useState(false);
  const navigation = useAppNavigation();
  const mnemonic = route?.params?.mnemonic;
  const mnemonicType = route?.params?.mnemonicType;
  const isWalletBackedUp = route?.params?.isWalletBackedUp;
  const [onboardingError, setOnboardingError] = useState<
    IOneKeyError | undefined
  >(undefined);
  const closePageCalled = useRef(false);

  const {
    shouldBondReferralCode,
    getReferralCodeBondStatus,
    bindWalletInviteCode,
  } = useWalletBoundReferralCode({
    entry: 'tab',
  });

  useEffect(() => {
    setOnboardingError(undefined);
  }, []);

  const {
    activeAccount: { wallet },
  } = useActiveAccount({ num: 0 });

  const actions = useAccountSelectorActions();
  const steps: Record<EFinalizeWalletSetupSteps, string> = {
    [EFinalizeWalletSetupSteps.CreatingWallet]: intl.formatMessage({
      id: ETranslations.onboarding_finalize_creating_wallet,
    }),
    [EFinalizeWalletSetupSteps.GeneratingAccounts]: intl.formatMessage({
      id: ETranslations.onboarding_finalize_generating_accounts,
    }),
    [EFinalizeWalletSetupSteps.EncryptingData]: intl.formatMessage({
      id: ETranslations.onboarding_finalize_encrypting_data,
    }),
   
  };
  
  // 步骤顺序数组
  const stepOrder = [
    EFinalizeWalletSetupSteps.CreatingWallet,
    EFinalizeWalletSetupSteps.GeneratingAccounts,
    EFinalizeWalletSetupSteps.EncryptingData,
    EFinalizeWalletSetupSteps.Ready,
  ];
  
  // 步骤位置配置（四角布局）
  const stepPositions: Record<EFinalizeWalletSetupSteps, React.CSSProperties> = {
    [EFinalizeWalletSetupSteps.CreatingWallet]: {
      position: 'absolute',
       top: '30%',
      left: '10%',
    },
    [EFinalizeWalletSetupSteps.GeneratingAccounts]: {
      position: 'absolute',
      top: '45%',
      right: '10%',
    },
    [EFinalizeWalletSetupSteps.EncryptingData]: {
      position: 'absolute',
      top: '70%',
      right: '35%',
    },
   
  };
  
  const stepImages: Record<EFinalizeWalletSetupSteps, string> = {
    [EFinalizeWalletSetupSteps.CreatingWallet]: generatingAccountsImg,
    [EFinalizeWalletSetupSteps.GeneratingAccounts]: encryptingDataImg,
    [EFinalizeWalletSetupSteps.EncryptingData]: readyImg,
  
    
  };

  const created = useRef(false);

  useEffect(() => {
    void (async () => {
      try {
        // **** hd wallet case
        if (mnemonic && !created.current) {
          await withPromptPasswordVerify({
            run: async () => {
              if (mnemonicType === EMnemonicType.TON) {
                // TODO check TON case
                // **** TON mnemonic case
                // Create TON imported account when mnemonicType is TON
                await actions.current.createTonImportedWallet({ mnemonic });
                setCurrentStep(EFinalizeWalletSetupSteps.Ready);
                return;
              }

              const createResult = await actions.current.createHDWallet({
                mnemonic,
                isWalletBackedUp,
              });
              if (createResult.wallet && createResult.isOverrideWallet) {
                Toast.success({
                  title: intl.formatMessage({
                    id: ETranslations.feedback_wallet_exists_title,
                  }),
                  message: intl.formatMessage({
                    id: ETranslations.feedback_wallet_exists_desc,
                  }),
                });
              }
            },
          });
          created.current = true;
        } else {
          // **** hardware wallet case
          // createHWWallet() is called before this page loaded
           

        }
        setShowStep(true);
      } catch (error) {
        navigation.pop();
        throw error;
      }
    })();
  }, [actions, intl, mnemonic, mnemonicType, navigation, isWalletBackedUp]);

  useEffect(() => {
    const fn = (
      event: IAppEventBusPayload[EAppEventBusNames.FinalizeWalletSetupStep],
    ) => {
      setCurrentStep(event.step);
    };

    appEventBus.on(EAppEventBusNames.FinalizeWalletSetupStep, fn);
    return () => {
      appEventBus.off(EAppEventBusNames.FinalizeWalletSetupStep, fn);
    };
  }, []);

  useEffect(() => {
    const fn = (
      event: IAppEventBusPayload[EAppEventBusNames.FinalizeWalletSetupError],
    ) => {
      setOnboardingError(event.error);
    };

    appEventBus.on(EAppEventBusNames.FinalizeWalletSetupError, fn);
    return () => {
      appEventBus.off(EAppEventBusNames.FinalizeWalletSetupError, fn);
    };
  }, []);

  const isFirstCreateWallet = useRef(false);
  const readIsFirstCreateWallet = async () => {
    const { isOnboardingDone } =
      await backgroundApiProxy.serviceOnboarding.isOnboardingDone();
    isFirstCreateWallet.current = !isOnboardingDone;
  };

  const closePage = useCallback(() => {
    closePageCalled.current = true;
    navigation.navigate(ERootRoutes.Main);
  }, [navigation]);

  const handleWalletSetupReadyInner = useCallback(async () => {
    const needBondReferralCode = await getReferralCodeBondStatus(wallet?.id);

    if (!needBondReferralCode) {
      setTimeout(() => {
        closePage();
        if (isFirstCreateWallet.current) {
          // void useBackupToggleDialog().maybeShow(true);
        }
      }, 1000);
    }
  }, [getReferralCodeBondStatus, closePage, wallet]);

  const handleWalletSetupReady = useThrottledCallback(
    handleWalletSetupReadyInner,
    500,
    { leading: true, trailing: false },
  );

  useEffect(() => {
    if (currentStep === EFinalizeWalletSetupSteps.CreatingWallet) {
      void readIsFirstCreateWallet();
    }
    if (!showStep) {
      return;
    }
    if (currentStep === EFinalizeWalletSetupSteps.Ready) {
      void handleWalletSetupReady();
    }
  }, [currentStep, navigation, showStep, handleWalletSetupReady]);

  const headerLeft = useCallback(() => {
    if (shouldBondReferralCode) {
      return <NavCloseButton onPress={closePage} />;
    }
  }, [shouldBondReferralCode, closePage]);

  return (
    <Page
      onClose={() => {
        if (
          currentStep === EFinalizeWalletSetupSteps.Ready &&
          !closePageCalled.current
        ) {
          closePage();
        }
      }}
    >
      <Image 
        source={SUCCESS_IMAGE}
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        resizeMode="cover"
        zIndex={-1}
        pointerEvents="none"
      />
      <Image 
        source={creatingWalletImg}
        position="absolute"
        top={135}
        left={130}
        right={0}
        bottom={0}
         w="$16"
          h="$16"
        zIndex={1}
        
      />
      <Page.Header
        title={intl.formatMessage({
          id: ETranslations.onboarding_finalize_wallet_setup,
        })}
        headerLeft={headerLeft}
      />
      <Page.Body p="$5" justifyContent="center" alignItems="center">
        <Stack
          w="$16"
          h="$16"
          justifyContent="center"
          alignItems="center"
          testID="finalize-wallet-setup"
        >
          <AnimatePresence exitBeforeEnter>
            {currentStep === EFinalizeWalletSetupSteps.Ready ? (
              <Stack
                key="CheckRadioSolid"
                animation="quick"
                enterStyle={
                  platformEnv.isNativeAndroid
                    ? undefined
                    : {
                        opacity: 0,
                        scale: 0,
                      }
                }
              >
              
              </Stack>
            ) : (
              <Spinner
                key="spinner"
                size="large"
                animation="quick"
                exitStyle={
                  platformEnv.isNativeAndroid
                    ? undefined
                    : {
                        opacity: 0,
                        scale: 0,
                      }
                }
              />
            )}
          </AnimatePresence>
        </Stack>
        
        {/* 修改后的步骤显示 - 四个步骤同时显示 */}
        <Stack position="relative" w="100%" h="100%" minH={400}>
          {stepOrder.map((step, index) => {
  const currentIndex = stepOrder.indexOf(currentStep);
  const isCompleted = index < currentIndex;
  const isActive = index === currentIndex;

  // 👇 如果既不是已完成，也不是当前步骤，就不渲染
  if (!isCompleted && !isActive) {
  return null;
}

return (
 <Stack
  key={step}
  animation="quick"
  enterStyle={{
    opacity: 0,
    scale: 0.8,
  }}
  exitStyle={{
    opacity: 0,
    scale: 0.8,
  }}
  style={stepPositions[step]}
  alignItems="center"
  justifyContent="center"
  zIndex={isActive ? 10 : 1}
>
  <Image
    source={stepImages[step]}
    width={80}
    height={80}
    resizeMode="contain"
    alt={steps[step]}
  />
  <Heading
    mt="$4"
    textAlign="center"
    size="lg"
    color={isActive ? "$text" : "$textSubdued"}
  >
    {steps[step]}
  </Heading>
</Stack>

);

})}
        </Stack>
      </Page.Body>
      {onboardingError ? (
        <Page.Footer
          onCancel={() => {
            navigation.pop();
          }}
        />
      ) : null}
      {shouldBondReferralCode ? (
        <Page.Footer
           // onConfirmText={intl.formatMessage({
          //   id: ETranslations.referral_onboard_bind_code,
          // })}
          // onConfirm={() => {
          //   closePage();
          //   bindWalletInviteCode({
          //     wallet,
          //   });
          // }}
          onCancelText={intl.formatMessage({
            id: ETranslations.referral_onboard_bind_code_finish,
          })}
          onCancel={() => {
            closePage();
          }}
        />
      ) : null}
    </Page>
  );
}

export function FinalizeWalletSetup({
  route,
  navigation,
}: IPageScreenProps<
  IOnboardingParamList,
  EOnboardingPages.FinalizeWalletSetup
>) {
  return (
    <AccountSelectorProviderMirror
      enabledNum={[0]}
      config={{
        sceneName: EAccountSelectorSceneName.home,
      }}
    >
      <FinalizeWalletSetupPage route={route} navigation={navigation} />
    </AccountSelectorProviderMirror>
  );
}

export default FinalizeWalletSetup;
