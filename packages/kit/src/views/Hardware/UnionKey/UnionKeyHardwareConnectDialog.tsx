import type { FC } from 'react';
import { useCallback, useState } from 'react';

import { useIntl } from 'react-intl';

import {
  Box,
  Button,
  Dialog,
  Spinner,
  Typography,
} from '@unionkeyhq/components';
import backgroundApiProxy from '@unionkeyhq/kit/src/background/instance/backgroundApiProxy';
import { deviceUtils } from '@unionkeyhq/kit/src/utils/hardware';

export type HardwareLoadingDialogProps = {
  connectId?: string;
  onHandler?: () => Promise<any>;
  onClose?: () => void;
};

const HardwareLoadingDialog: FC<HardwareLoadingDialogProps> = ({
  connectId,
  onHandler,
  onClose,
}) => {
  const intl = useIntl();
  const { serviceHardware } = backgroundApiProxy;
  const [isRunning, setIsRunning] = useState(false);

  const handleContinue = useCallback(async () => {
    setIsRunning(true);
    try {
      if (connectId) {
        await serviceHardware.ensureDeviceUnlocked(connectId);
      }
      if (onHandler) {
        await onHandler();
      }
      onClose?.();
    } catch (error) {
      setIsRunning(false);
      deviceUtils.showErrorToast(error, 'msg__hardware_default_error');
    }
  }, [connectId, onClose, onHandler, serviceHardware]);

  return (
    <Dialog visible>
      <Box
        flexDirection="column"
        alignItems="center"
        px={{ base: 4, md: 6 }}
        my={{ base: 12, md: 6 }}
      >
        {isRunning ? <Spinner size="lg" /> : null}
        <Typography.DisplayMedium mt={6}>
          {intl.formatMessage({
            id: isRunning
              ? 'modal__device_status_check'
              : 'modal__connect_and_unlock_device',
          })}
        </Typography.DisplayMedium>
        {!isRunning ? (
          <Button type="primary" mt={6} minW={120} onPress={handleContinue}>
            {intl.formatMessage({ id: 'action__continue' })}
          </Button>
        ) : null}
      </Box>
    </Dialog>
  );
};

export default HardwareLoadingDialog;
