import { Button, Page, SizableText, YStack } from '@unionkey/components';
import type {
  IPageNavigationProp,
  IPageScreenProps,
} from '@unionkey/components/src/layouts/Navigation';
import type { ITabDeveloperParamList } from '@unionkey/shared/src/routes';
import { ETabDeveloperRoutes } from '@unionkey/shared/src/routes';

import useAppNavigation from '../../../hooks/useAppNavigation';

const DevHomeStack1 = (
  props: IPageScreenProps<
    ITabDeveloperParamList,
    ETabDeveloperRoutes.DevHomeStack1
  >,
) => {
  const { route } = props;
  console.log(route.params.a, route.params.b);
  const navigation =
    useAppNavigation<
      IPageNavigationProp<
        ITabDeveloperParamList,
        ETabDeveloperRoutes.DevHomeStack1
      >
    >();
  return (
    <Page>
      <SizableText>{`a: ${route.params.a}, b:${route.params.b}`}</SizableText>
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
            navigation.push(ETabDeveloperRoutes.DevHomeStack2);
          }}
        >
          下一�?
        </Button>
      </YStack>
    </Page>
  );
};

export default DevHomeStack1;
