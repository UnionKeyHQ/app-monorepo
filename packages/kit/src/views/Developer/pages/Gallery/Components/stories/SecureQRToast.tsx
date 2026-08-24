import { Button } from '@unionkeyhq/components';
import { SecureQRToast } from '@unionkeyhq/kit/src/components/SecureQRToast';
import useScanQrCode from '@unionkeyhq/kit/src/views/ScanQrCode/hooks/useScanQrCode';

import { Layout } from './utils/Layout';

const SecureQRToastGallery = () => {
  const scanQrCode = useScanQrCode();
  return (
    <Layout
      filePath={__CURRENT_FILE_PATH__}
      componentName="SecureQRToast"
      elements={[
        {
          title: 'SecureQRToast',
          element: (
            <Button
              onPress={() => {
                const toast = SecureQRToast.show({
                  value: 'https://unionkey.io',
                  onCancel: async () => {
                    await toast.close();
                  },
                  onConfirm: async () => {
                    await toast.close();
                  },
                  onClose: () => {
                    console.log('onClose');
                  },
                });
              }}
            >
              点击单独显示
            </Button>
          ),
        },
        {
          title: 'SecureQRToast',
          element: (
            <Button
              onPress={() => {
                const toast = SecureQRToast.show({
                  value: 'https://unionkey.io',
                  showQRCode: false,
                  onCancel: async () => {
                    await toast.close();
                  },
                  onConfirm: async () => {
                    await toast.close();
                  },
                  onClose: () => {
                    console.log('onClose');
                  },
                });
              }}
            >
              点击单独显示(默认不展示)
            </Button>
          ),
        },
        {
          title: 'SecureQRToast + showConfirmButton',
          element: (
            <Button
              onPress={() => {
                const toast = SecureQRToast.show({
                  value: 'https://unionkey.io',
                  showConfirmButton: false,
                  onCancel: async () => {
                    await toast.close();
                  },
                  onClose: () => {
                    console.log('onClose');
                  },
                });
              }}
            >
              点击显示后续流程
            </Button>
          ),
        },
        {
          title: 'SecureQRToast + useScanQrCode',
          element: (
            <Button
              onPress={() => {
                const toast = SecureQRToast.show({
                  title: 'AAA',
                  message: 'BBBB',
                  dismissOnOverlayPress: false,
                  value: 'https://unionkey.io',
                  onConfirm: async () => {
                    await toast.close();
                    await scanQrCode.start({
                      autoHandleResult: true,
                      handlers: scanQrCode.PARSE_HANDLER_NAMES.all,
                    });
                  },
                  onCancel: async () => {
                    await toast.close();
                  },
                  onClose: () => {
                    console.log('onClose');
                  },
                });
              }}
            >
              点击显示后续流程
            </Button>
          ),
        },
      ]}
    />
  );
};

export default SecureQRToastGallery;
