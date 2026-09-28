import { useIsVerticalLayout } from '@unionkeyhq/components';

import UnionKeyLiteReset from '../../../views/Hardware/UnionKeyLite/Reset';
import { UnionKeyLiteResetModalRoutes } from '../../routesEnum';

import createStackNavigator from './createStackNavigator';

import type {
  UnionKeyLiteModalRoutes,
  UnionKeyLiteRoutesParams,
} from '../../../views/Hardware/UnionKeyLite/routes';

export type UnionKeyLiteResetRoutesParams = {
  [UnionKeyLiteResetModalRoutes.UnionKeyLiteResetModal]: UnionKeyLiteRoutesParams[UnionKeyLiteModalRoutes.UnionKeyLiteResetModal];
};

const UnionKeyLiteResetNavigator =
  createStackNavigator<UnionKeyLiteResetRoutesParams>();

const modalRoutes = [
  {
    name: UnionKeyLiteResetModalRoutes.UnionKeyLiteResetModal,
    component: UnionKeyLiteReset,
  },
];

const UnionKeyLiteResetModalStack = () => {
  const isVerticalLayout = useIsVerticalLayout();
  return (
    <UnionKeyLiteResetNavigator.Navigator
      screenOptions={{
        headerShown: false,
        animationEnabled: !!isVerticalLayout,
      }}
    >
      {modalRoutes.map((route) => (
        <UnionKeyLiteResetNavigator.Screen
          key={route.name}
          name={route.name}
          component={route.component}
        />
      ))}
    </UnionKeyLiteResetNavigator.Navigator>
  );
};

export default UnionKeyLiteResetModalStack;
