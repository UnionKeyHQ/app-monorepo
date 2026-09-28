import type { FC } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';

import { useNavigation, useRoute } from '@react-navigation/native';
import { useIntl } from 'react-intl';

import {
  Button,
  Center,
  Modal,
  Spinner,
  ToastManager,
  Typography,
} from '@unionkeyhq/components';
import backgroundApiProxy from '@unionkeyhq/kit/src/background/instance/backgroundApiProxy';
import NeedBridgeDialog from '@unionkeyhq/kit/src/components/NeedBridgeDialog';
import type { CreateWalletRoutesParams } from '@unionkeyhq/kit/src/routes/Root/Modal/CreateWallet';
import {
  CreateWalletModalRoutes,
  ModalRoutes,
  RootRoutes,
} from '@unionkeyhq/kit/src/routes/routesEnum';
import type {
  ModalScreenProps,
  RootRoutesParams,
} from '@unionkeyhq/kit/src/routes/types';
import { CustomUnionKeyHardwareError } from '@unionkeyhq/kit/src/utils/hardware/errors';
import type { IUnionKeyDeviceFeatures } from '@unionkeyhq/shared/types';

import { closeExtensionWindowIfOnboardingFinished } from '../../../hooks/useOnboardingRequired';
import { setOnBoardingLoadingBehindModal } from '../../../store/reducers/runtime';
import { deviceUtils } from '../../../utils/hardware';
import { wait } from '../../../utils/helper';
import { showDialog } from '../../../utils/overlayUtils';
import { EOnboardingRoutes } from '../../Onboarding/routes/enums';

import type { RouteProp } from '@react-navigation/native';

type NavigationProps = ModalScreenProps<RootRoutesParams>;

type RouteProps = RouteProp<
  CreateWalletRoutesParams,
  CreateWalletModalRoutes.DeviceStatusCheckModal
>;

const DeviceStatusCheckModal: FC = () => {
  const intl = useIntl();
  const navigation = useNavigation<NavigationProps['navigation']>();
  const { device, entry } = useRoute<RouteProps>().params;
  const { serviceHardware } = backgroundApiProxy;
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const safeGoBack = useCallback(() => {
    if (navigation?.canGoBack?.()) {
      navigation.goBack();
    }
  }, [navigation]);

  useEffect(() => {
    if (!isChecking) return undefined;
    const id = setTimeout(() => {
      safeGoBack();
      ToastManager.show({
        title: intl.formatMessage({ id: 'action__connection_timeout' }),
      });
    }, 60 * 1000);
    timeoutRef.current = id;
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [safeGoBack, intl, isChecking]);

  const handleContinue = useCallback(async () => {
    setIsChecking(true);
    // If device and account are ready, go to success page
    try {
      let features: IUnionKeyDeviceFeatures | null = null;
      try {
        // 30s timeout for device connection
        const result = await Promise.race([
          serviceHardware.ensureDeviceUnlocked(device.connectId ?? ''),
          // eslint-disable-next-line no-promise-executor-return
          new Promise((_, reject) => setTimeout(reject, 30 * 1000)),
        ]);
        features = result as IUnionKeyDeviceFeatures;
      } catch (e: any) {
        safeGoBack();
        const { code } = e || {};
        if (code === CustomUnionKeyHardwareError.NeedUnionKeyBridge) {
          showDialog(<NeedBridgeDialog />);
          return;
        }

        deviceUtils.showErrorToast(e, 'action__connection_timeout');
        return;
      }

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      if (!features.initialized) {
        navigation.navigate(RootRoutes.Modal, {
          screen: ModalRoutes.CreateWallet,
          params: {
            screen: CreateWalletModalRoutes.SetupHardwareModal,
            params: {
              device,
            },
          },
        });
        return;
      }

      try {
        backgroundApiProxy.dispatch(setOnBoardingLoadingBehindModal(true));
        await wait(600);

        navigation.replace(RootRoutes.Onboarding, {
          screen: EOnboardingRoutes.BehindTheScene,
          params: {
            password: '',
            mnemonic: '',
            isHardwareCreating: {
              device,
              features,
            },
            entry,
          },
        });
      } finally {
        await wait(600);
        backgroundApiProxy.dispatch(setOnBoardingLoadingBehindModal(false));
      }
    } finally {
      setIsChecking(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [device, entry, navigation, safeGoBack, serviceHardware]);

  const content = (
    <Center minH="220px">
      {isChecking ? <Spinner size="lg" /> : null}
      <Typography.DisplayMedium mt={6}>
        {intl.formatMessage({
          id: isChecking
            ? 'modal__device_status_check'
            : 'modal__connect_and_unlock_device',
        })}
      </Typography.DisplayMedium>
      {!isChecking ? (
        <Button type="primary" mt={6} minW={120} onPress={handleContinue}>
          {intl.formatMessage({ id: 'action__continue' })}
        </Button>
      ) : null}
    </Center>
  );

  return (
    <Modal
      footer={null}
      staticChildrenProps={{
        justifyContent: 'center',
        flex: '1',
        p: 6,
        px: { base: 4, md: 6 },
      }}
      onModalClose={() => {
        closeExtensionWindowIfOnboardingFinished();
      }}
    >
      {content}
    </Modal>
  );
};

export default DeviceStatusCheckModal;
