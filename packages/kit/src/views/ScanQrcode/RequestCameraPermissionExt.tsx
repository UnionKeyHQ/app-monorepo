import { useCallback, useEffect } from 'react';

import { useIntl } from 'react-intl';

import { Modal, Typography } from '@unionkeyhq/components';
import debugLogger from '@unionkeyhq/shared/src/logger/debugLogger';
import platformEnv from '@unionkeyhq/shared/src/platformEnv';

const RequestCameraPermissionExt = () => {
  const intl = useIntl();
  useEffect(() => {
    async function main() {
      if (platformEnv.isExtension) {
        try {
          await navigator.mediaDevices.getUserMedia({ video: true });
        } catch {
          debugLogger.common.info('failed to request camera permission on ext');
        }
      }
    }
    main();
  }, []);
  const onPrimaryActionPress = useCallback(
    ({ close }: { close: () => void }) => {
      close?.();
    },
    [],
  );
  return (
    <Modal
      header={intl.formatMessage({ id: 'title__camera_permission_required' })}
      onPrimaryActionPress={onPrimaryActionPress}
    >
      <Typography.Body1Strong>
        {intl.formatMessage({
          id: 'msg__please_approve_camera_permission_on_your_browser',
        })}
      </Typography.Body1Strong>
    </Modal>
  );
};

export default RequestCameraPermissionExt;
