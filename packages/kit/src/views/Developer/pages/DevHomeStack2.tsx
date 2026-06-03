import { Button, Page, YStack } from '@unionkey/components';
import type { IPageNavigationProp } from '@unionkey/components/src/layouts/Navigation';
import type { ITabDeveloperParamList } from '@unionkey/shared/src/routes';
import { ETabDeveloperRoutes } from '@unionkey/shared/src/routes';

import useAppNavigation from '../../../hooks/useAppNavigation';

const DevHomeStack2 = () => {
  const navigation =
    useAppNavigation<IPageNavigationProp<ITabDeveloperParamList>>();

  return (
    <Page>
      <YStack>
        <Button
          onPress={() => {
            navigation.pop();
          }}
        >
          上一�?
        </Button>
        <Button
          onPress={() => {
            navigation.navigate(ETabDeveloperRoutes.DevHome);
          }}
        >
          回首�?
        </Button>
      </YStack>
    </Page>
  );
};

export default DevHomeStack2;
