import type { FC } from 'react';
import { useEffect, useState } from 'react';

import { useIntl } from 'react-intl';

import {
  Box,
  Icon,
  Image,
  LottieView,
  Modal,
  ToastManager,
  Typography,
  ZStack,
} from '@unionkeyhq/components';
import type { ButtonType } from '@unionkeyhq/components/src/Button';
import Button from '@unionkeyhq/components/src/Button';
import iconNFCScanHint from '@unionkeyhq/kit/assets/hardware/ic_pair_hint_scan_lite.png';
import supportedNFC from '@unionkeyhq/shared/src/detector/nfc';
import debugLogger from '@unionkeyhq/shared/src/logger/debugLogger';
import platformEnv from '@unionkeyhq/shared/src/platformEnv';

export type ConnectType = 'ble' | 'nfc';
export type OperateType =
  | 'guide'
  | 'connect'
  | 'transfer'
  | 'complete'
  | 'done';

export interface HardwareConnectViewProps {
  title: string;
  actionState: string;
  actionDescription: string;
  // eslint-disable-next-line react/no-unused-prop-types
  connectType: ConnectType;
  operateType?: OperateType;
  // eslint-disable-next-line react/no-unused-prop-types
  onReadyConnect?: () => void | undefined;
  onCloseConnect?: () => void | undefined;
  onActionPress?: () => void | undefined;
  actionPressStyle?: ButtonType;
  actionPressContent?: string;
}

const HardwareConnect: FC<HardwareConnectViewProps> = ({
  title,
  actionState,
  actionDescription,
  operateType,
  onCloseConnect,
  onActionPress,
  actionPressStyle,
  actionPressContent,
}) => {
  const intl = useIntl();

  const [visibleIosHint, setVisibleIosHint] = useState(false);
  const [lottieConnectingIcon, setLottieConnectingIcon] = useState<any>(
    require('@unionkeyhq/kit/assets/animations/lottie_unionkey_lite_nfc_connect.json'),
  );
  const [lottieAutoPlay, setLottieAutoPlay] = useState<boolean>(
    !platformEnv.isNativeIOS,
  );
  const [lottieLoopPlay, setLottieLoopPlay] = useState<boolean>(true);

  useEffect(() => {
    setLottieAutoPlay(operateType !== 'guide');
    setLottieLoopPlay(operateType !== 'complete' && operateType !== 'done');

    if (operateType === 'guide') {
      setLottieConnectingIcon(
        require('@unionkeyhq/kit/assets/animations/lottie_unionkey_lite_nfc_connect.json'),
      );
      if (platformEnv.isNativeIOS) {
        setVisibleIosHint(false);
      }
    }
    if (operateType === 'connect') {
      setLottieConnectingIcon(
        require('@unionkeyhq/kit/assets/animations/lottie_unionkey_lite_nfc_connect.json'),
      );
      if (platformEnv.isNativeIOS) {
        setVisibleIosHint(true);
      }
    }
    if (operateType === 'transfer') {
      setLottieConnectingIcon(
        require('@unionkeyhq/kit/assets/animations/lottie_unionkey_lite_nfc_transfer.json'),
      );
      setTimeout(() => {
        setLottieConnectingIcon(
          require('@unionkeyhq/kit/assets/animations/lottie_unionkey_lite_nfc_transmitting.json'),
        );
      }, 1000);
      if (platformEnv.isNativeIOS) {
        setVisibleIosHint(false);
      }
    }
    if (operateType === 'complete' || operateType === 'done') {
      setLottieConnectingIcon(
        require('@unionkeyhq/kit/assets/animations/lottie_unionkey_lite_nfc_complete.json'),
      );
      if (platformEnv.isNativeIOS) {
        setVisibleIosHint(false);
      }
    }
  }, [operateType]);

  return (
    <>
      <Modal
        hideSecondaryAction
        header={title}
        onClose={() => {
          debugLogger.onekeyLite.debug('HardwareConnect: onClose');

          onCloseConnect?.();
        }}
        footer={
          <Button
            size="xl"
            mx={4}
            mb={platformEnv.isNativeIOS ? 12 : 4}
            onPress={() => {
              if (!supportedNFC) {
                ToastManager.show({
                  title: intl.formatMessage({ id: 'empty__not_supported' }),
                });
                return;
              }
              onActionPress?.();
            }}
            type={actionPressStyle}
          >
            {actionPressContent}
          </Button>
        }
        scrollViewProps={{
          pt: 4,
          children: (
            <Box alignItems="center">
              <Typography.DisplayXLarge
                textAlign="center"
                mt={8}
                mx={9}
                color="text-default"
              >
                {actionState}
              </Typography.DisplayXLarge>
              <Typography.Body1
                textAlign="center"
                mt={2}
                mx={9}
                color="text-subdued"
              >
                {actionDescription}
              </Typography.Body1>

              <ZStack w="100%" h="560px" alignItems="center">
                <ZStack
                  h="360px"
                  w="100%"
                  alignItems="center"
                  justifyContent="center"
                >
                  <LottieView
                    source={lottieConnectingIcon}
                    autoPlay={lottieAutoPlay}
                    loop={lottieLoopPlay}
                  />
                </ZStack>
                <Image
                  w="100%"
                  h="55%"
                  resizeMode="cover"
                  mt="202px"
                  source={iconNFCScanHint}
                />
              </ZStack>
            </Box>
          ),
        }}
      />
      {!!visibleIosHint && (
        <Box w="100%" p={4} h="212px" position="absolute">
          <Box
            w="100%"
            h="212px"
            zIndex={99999}
            bg="action-secondary-default"
            borderColor="border-hovered"
            borderWidth="1px"
            borderRadius={36}
            borderStyle="dashed"
            alignItems="center"
            justifyContent="center"
          >
            <Icon name="CursorClickOutline" size={48} />
            <Typography.DisplayMedium px={12} mt={5} textAlign="center">
              {intl.formatMessage({
                id: 'content__place_your_onekey_lite_close_to_the_back_of_here',
              })}
            </Typography.DisplayMedium>
          </Box>
        </Box>
      )}
    </>
  );
};
export default HardwareConnect;
