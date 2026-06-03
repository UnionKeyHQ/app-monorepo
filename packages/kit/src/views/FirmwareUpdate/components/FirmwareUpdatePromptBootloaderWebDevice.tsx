import { useCallback, useState } from 'react';

import { useIntl } from 'react-intl';

import { Button, Stack } from '@unionkey/components';
import backgroundApiProxy from '@unionkey/kit/src/background/instance/backgroundApiProxy';
import { usePromptWebDeviceAccess } from '@unionkey/kit/src/hooks/usePromptWebDeviceAccess';
import type { IFirmwareUpdateStepInfo } from '@unionkey/kit-bg/src/states/jotai/atoms';
import { useFirmwareUpdateStepInfoAtom } from '@unionkey/kit-bg/src/states/jotai/atoms';
import { ETranslations } from '@unionkey/shared/src/locale';

export function FirmwareUpdatePromptBootloaderWebDevice({
  previousStepInfo,
}: {
  previousStepInfo: IFirmwareUpdateStepInfo | undefined;
}) {
  const intl = useIntl();
  const [isConnecting, setIsConnecting] = useState(false);
  const { promptWebUsbDeviceAccess } = usePromptWebDeviceAccess();
  const [_, setStepInfo] = useFirmwareUpdateStepInfoAtom();

  // Handle USB connection request
  const handleGrantAccess = useCallback(async () => {
    setIsConnecting(true);
    try {
      const device = await promptWebUsbDeviceAccess();
      await backgroundApiProxy.serviceHardwareUI.sendRequestDeviceInBootloaderForWebDevice(
        {
          deviceId: device.serialNumber ?? '',
        },
      );
      if (previousStepInfo) {
        setStepInfo({
          ...previousStepInfo,
        } as IFirmwareUpdateStepInfo);
      }
    } catch (error) {
      console.error('USB device connection failed:', error);
    } finally {
      setIsConnecting(false);
    }
  }, [promptWebUsbDeviceAccess, setStepInfo, previousStepInfo]);

  return (
    <Stack alignItems="center" justifyContent="flex-start">
      <Button
        alignSelf="flex-start"
        variant="primary"
        size="medium"
        loading={isConnecting}
        disabled={isConnecting}
        onPress={handleGrantAccess}
      >
        {intl.formatMessage({ id: ETranslations.device_grant_usb_access })}
      </Button>
    </Stack>
  );
}
