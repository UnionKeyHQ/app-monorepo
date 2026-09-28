/* eslint-disable global-require */
import type { FC } from 'react';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';

import { useNavigation, useRoute } from '@react-navigation/core';
import axios from 'axios';
import { useIntl } from 'react-intl';

import {
  Box,
  Button,
  Center,
  LottieView,
  Modal,
  PresenceTransition,
  Text,
  Typography,
  useIsVerticalLayout,
} from '@unionkeyhq/components';
import type { LocaleIds } from '@unionkeyhq/components/src/locale';
import { UnionKeyErrorClassNames } from '@unionkeyhq/engine/src/errors';
import type { Device } from '@unionkeyhq/engine/src/types/device';
import backgroundApiProxy from '@unionkeyhq/kit/src/background/instance/backgroundApiProxy';
import type { UnionKeyHardwareRoutesParams } from '@unionkeyhq/kit/src/routes/Root/Modal/HardwareUnionKey';
import { setVerification } from '@unionkeyhq/kit/src/store/reducers/settings';
import { deviceUtils } from '@unionkeyhq/kit/src/utils/hardware';
import { CERTIFICATE_URL } from '@unionkeyhq/shared/src/config/appConfig';

import type { UnionKeyHardwareModalRoutes } from '../../../routes/routesEnum';
import type { RouteProp } from '@react-navigation/core';

type RouteProps = RouteProp<
  UnionKeyHardwareRoutesParams,
  UnionKeyHardwareModalRoutes.UnionKeyHardwareVerifyModal
>;

type HardwareVerifyDetail = {
  walletId: string;
};

const ErrorMessage: FC<{ messageKey: string }> = ({ messageKey }) => {
  const intl = useIntl();
  let message = intl.formatMessage({ id: messageKey as LocaleIds });
  if (messageKey === 'SN_MISMATCH') {
    message = intl.formatMessage({ id: 'action__verify_sn_mismatch' });
  }

  if (messageKey === 'PARAMS_INVALID') {
    message = intl.formatMessage({ id: 'action__verify_params_invalid' });
  }

  if (messageKey === 'SIGNATURE_INVALID') {
    message = intl.formatMessage({ id: 'action__verify_sig_invalid' });
  }

  if (messageKey === 'REQUEST_FAILED') {
    message = intl.formatMessage({ id: 'action__verify_request_failed' });
  }

  if (messageKey === 'SERVER_FAILED') {
    message = intl.formatMessage({ id: 'action__verify_server_failed' });
  }

  if (messageKey === 'CERT_INVALID') {
    message = intl.formatMessage({ id: 'action__verify_cert_invalid' });
  }

  if (messageKey === 'HARDWARE_ERROR') {
    message = intl.formatMessage({ id: 'msg__hardware_default_error' });
  }

  return (
    <Typography.Body2 px={8} textAlign="center" color="text-subdued">
      {message}
    </Typography.Body2>
  );
};

const UnionKeyHardwareVerifyDetail: FC<HardwareVerifyDetail> = ({
  walletId,
}) => {
  const intl = useIntl();
  const navigation = useNavigation();
  const isVerticalLayout = useIsVerticalLayout();

  const { engine, serviceHardware, dispatch } = backgroundApiProxy;

  const [device, setDevice] = useState<Device>();
  const [hasStarted, setHasStarted] = useState(false);

  const [requestState, setRequestState] = useState<{
    isLoading: boolean;
    errorKey: string;
    success: boolean;
  }>({ isLoading: false, errorKey: '', success: false });

  const handleGetDeviceSigResponse = useCallback(async () => {
    const deviceConnectId = device?.mac;
    const deviceType = device?.deviceType;
    if (!deviceConnectId || !deviceType) return;
    setHasStarted(true);
    setRequestState({
      isLoading: true,
      errorKey: '',
      success: false,
    });

    const challenge = `${Date.now()}`;
    const dataHex = Buffer.from(challenge, 'utf8').toString('hex');

    let sigResponse = null;
    try {
      await serviceHardware.ensureDeviceUnlocked(deviceConnectId);
      sigResponse = await serviceHardware.getDeviceCertWithSig(
        deviceConnectId,
        dataHex,
      );
    } catch (err: any) {
      const { className, key } = err || {};
      if (className === UnionKeyErrorClassNames.UnionKeyHardwareError) {
        deviceUtils.showErrorToast(err);
      }
      setRequestState({
        isLoading: false,
        errorKey: key ?? 'HARDWARE_ERROR',
        success: false,
      });
    }

    try {
      if (!sigResponse) return;
      const { data: responseData } = await axios.post<{
        code?: number;
        message?: string;
        data?: string;
      }>(CERTIFICATE_URL, {
        deviceType,
        data: challenge,
        cert: Buffer.from(sigResponse.cert).toString('base64'),
        signature: Buffer.from(sigResponse.signature).toString('base64'),
      });

      if (responseData.code !== 0) {
        setRequestState({
          isLoading: false,
          errorKey: 'CERT_INVALID',
          success: false,
        });
        dispatch(
          setVerification({
            connectId: deviceConnectId,
            verified: false,
          }),
        );
        return;
      }

      setRequestState({
        isLoading: false,
        errorKey: '',
        success: true,
      });
      dispatch(
        setVerification({
          connectId: deviceConnectId,
          verified: true,
        }),
      );
    } catch (e) {
      setRequestState({
        isLoading: false,
        errorKey: 'SERVER_FAILED',
        success: false,
      });
    }
  }, [device?.mac, device?.deviceType, serviceHardware, dispatch]);

  useEffect(() => {
    (async () => {
      try {
        const d = await engine.getHWDeviceByWalletId(walletId);
        if (!d?.mac) throw new Error();
        setDevice(d);
      } catch (err: any) {
        if (navigation?.canGoBack?.()) {
          navigation.goBack();
        }

        deviceUtils.showErrorToast(err, 'action__connection_timeout');
      }
    })();
  }, [engine, intl, navigation, serviceHardware, walletId]);

  const verifyChildren = useMemo(() => {
    if (!hasStarted) {
      return (
        <Center flex="1" minHeight={240} alignSelf="center" px={8}>
          <Text fontSize={56}>🔓</Text>
          <Typography.Heading mt={2} textAlign="center">
            {intl.formatMessage({ id: 'modal__connect_and_unlock_device' })}
          </Typography.Heading>
          <Typography.Body2 mt={2} color="text-subdued" textAlign="center">
            {intl.formatMessage({ id: 'modal__confirm_on_device' })}
          </Typography.Body2>
          <Button
            type="primary"
            onPress={handleGetDeviceSigResponse}
            isDisabled={!device}
            size={isVerticalLayout ? 'xl' : 'base'}
            mt={6}
            minW={120}
          >
            {intl.formatMessage({ id: 'action__verify' })}
          </Button>
        </Center>
      );
    }

    if (requestState?.isLoading) {
      return (
        <PresenceTransition
          visible={requestState?.isLoading}
          key="loading"
          initial={{ translateX: 8, opacity: 0 }}
          animate={{ translateX: 0, opacity: 1, transition: { duration: 150 } }}
        >
          <Center flex="1" alignSelf="center" mt={-6}>
            <Box w={200} h={200} ml={5}>
              <LottieView
                resizeMode="cover"
                source={require('@unionkeyhq/kit/assets/animations/lottie_searching.json')}
                autoPlay
                loop
              />
            </Box>
            <Typography.Heading>
              {intl.formatMessage({ id: 'action__verify_loading' })}...
            </Typography.Heading>
          </Center>
        </PresenceTransition>
      );
    }

    if (requestState?.success) {
      return (
        <PresenceTransition
          key="success"
          visible={requestState?.success}
          initial={{ translateX: 8, opacity: 0 }}
          animate={{ translateX: 0, opacity: 1, transition: { duration: 150 } }}
        >
          <Center flex="1" alignSelf="center" mt={-6}>
            <Box w={200} h={200}>
              <LottieView
                source={require('@unionkeyhq/kit/assets/animations/lottie_send_success_feedback.json')}
                autoPlay
                loop={false}
              />
            </Box>
            <Typography.Heading>
              {intl.formatMessage({ id: 'action__verify_success' })}
            </Typography.Heading>
            <Typography.Body2 mt={2} color="text-subdued">
              {intl.formatMessage({ id: 'content__running_official_firmware' })}
            </Typography.Body2>
          </Center>
        </PresenceTransition>
      );
    }

    if (requestState?.errorKey) {
      return (
        <Center flex="1" minHeight={240} alignSelf="center">
          <Box alignItems="center">
            <Text fontSize={56}>🙁</Text>
            <Typography.Heading mb={2}>
              {intl.formatMessage({ id: 'action__verify_failed' })}
            </Typography.Heading>
            <ErrorMessage messageKey={requestState.errorKey} />
            <Button
              type="primary"
              onPress={handleGetDeviceSigResponse}
              size={isVerticalLayout ? 'xl' : 'base'}
              mt={6}
              minW={120}
            >
              {intl.formatMessage({ id: 'action_retry' })}
            </Button>
          </Box>
        </Center>
      );
    }
  }, [
    requestState?.isLoading,
    requestState?.success,
    requestState.errorKey,
    intl,
    handleGetDeviceSigResponse,
    isVerticalLayout,
    hasStarted,
    device,
  ]);

  return (
    <Center h="100%" pb={6}>
      {verifyChildren}
    </Center>
  );
};

const UnionKeyHardwareVerify: FC = () => {
  const intl = useIntl();
  const route = useRoute<RouteProps>();
  const { walletId } = route?.params || {};

  return (
    <Modal
      header={intl.formatMessage({ id: 'action__verify' })}
      headerDescription=""
      footer={null}
      scrollViewProps={{
        contentContainerStyle: {
          flex: 1,
          justifyContent: 'center',
          paddingTop: 24,
          paddingBottom: 24,
        },
        children: <UnionKeyHardwareVerifyDetail walletId={walletId} />,
      }}
    />
  );
};

export default memo(UnionKeyHardwareVerify);
