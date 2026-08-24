import RNRestart from 'react-native-restart';

import { Button } from '@unionkeyhq/components';
import { exitApp } from '@unionkeyhq/shared/src/modules3rdParty/react-native-exit';

import { Layout } from './utils/Layout';

const RestartGallery = () => {
  return (
    <Layout
      filePath={__CURRENT_FILE_PATH__}
      componentName="SecureQRToast"
      elements={[
        {
          title: 'restartApp',
          element: (
            <Button
              onPress={() => {
                RNRestart.restart();
              }}
            >
              restart app
            </Button>
          ),
        },
        {
          title: 'exitApp',
          element: (
            <Button
              onPress={() => {
                exitApp();
              }}
            >
              exit app
            </Button>
          ),
        },
      ]}
    />
  );
};

export default RestartGallery;
