import { Button, Page, YStack } from '@unionkeyhq/components';
import type { IPageNavigationProp } from '@unionkeyhq/components/src/layouts/Navigation';
import type { ITabDeveloperParamList } from '@unionkeyhq/shared/src/routes';
import { ETabDeveloperRoutes } from '@unionkeyhq/shared/src/routes';

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
          上一页
        </Button>
        <Button
          onPress={() => {
            navigation.navigate(ETabDeveloperRoutes.DevHome);
          }}
        >
          回首页
        </Button>
      </YStack>
    </Page>
  );
};

export default DevHomeStack2;
