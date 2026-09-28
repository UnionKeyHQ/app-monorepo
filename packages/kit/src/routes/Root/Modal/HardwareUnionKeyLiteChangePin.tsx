import { useIsVerticalLayout } from '@unionkeyhq/components';

import UnionKeyLiteChangePin from '../../../views/Hardware/UnionKeyLite/ChangePin';
import {
  UnionKeyLiteCurrentPinCode,
  UnionKeyLiteNewRepeatPinCode,
  UnionKeyLiteNewSetPinCode,
} from '../../../views/Hardware/UnionKeyLite/ChangePinInputPin';
import { UnionKeyLiteChangePinModalRoutes } from '../../routesEnum';

import createStackNavigator from './createStackNavigator';

import type {
  UnionKeyLiteModalRoutes,
  UnionKeyLiteRoutesParams,
} from '../../../views/Hardware/UnionKeyLite/routes';

export type UnionKeyLiteChangePinRoutesParams = {
  [UnionKeyLiteChangePinModalRoutes.UnionKeyLiteChangePinInputPinModal]: UnionKeyLiteRoutesParams[UnionKeyLiteModalRoutes.UnionKeyLiteChangePinInputPinModal];
  [UnionKeyLiteChangePinModalRoutes.UnionKeyLiteChangePinSetModal]: UnionKeyLiteRoutesParams[UnionKeyLiteModalRoutes.UnionKeyLiteChangePinSetModal];
  [UnionKeyLiteChangePinModalRoutes.UnionKeyLiteChangePinRepeatModal]: UnionKeyLiteRoutesParams[UnionKeyLiteModalRoutes.UnionKeyLiteChangePinRepeatModal];
  [UnionKeyLiteChangePinModalRoutes.UnionKeyLiteChangePinModal]: UnionKeyLiteRoutesParams[UnionKeyLiteModalRoutes.UnionKeyLiteChangePinModal];
};

const UnionKeyLitePinNavigator =
  createStackNavigator<UnionKeyLiteChangePinRoutesParams>();

const modalRoutes = [
  {
    name: UnionKeyLiteChangePinModalRoutes.UnionKeyLiteChangePinInputPinModal,
    component: UnionKeyLiteCurrentPinCode,
  },
  {
    name: UnionKeyLiteChangePinModalRoutes.UnionKeyLiteChangePinSetModal,
    component: UnionKeyLiteNewSetPinCode,
  },
  {
    name: UnionKeyLiteChangePinModalRoutes.UnionKeyLiteChangePinRepeatModal,
    component: UnionKeyLiteNewRepeatPinCode,
  },
  {
    name: UnionKeyLiteChangePinModalRoutes.UnionKeyLiteChangePinModal,
    component: UnionKeyLiteChangePin,
  },
];

const UnionKeyLitePinModalStack = () => {
  const isVerticalLayout = useIsVerticalLayout();
  return (
    <UnionKeyLitePinNavigator.Navigator
      screenOptions={{
        headerShown: false,
        animationEnabled: !!isVerticalLayout,
      }}
    >
      {modalRoutes.map((route) => (
        <UnionKeyLitePinNavigator.Screen
          key={route.name}
          name={route.name}
          component={route.component}
        />
      ))}
    </UnionKeyLitePinNavigator.Navigator>
  );
};

export default UnionKeyLitePinModalStack;
