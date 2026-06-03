import { useRoute } from '@react-navigation/core';

import type {
  EAccountManagerStacksRoutes,
  IAccountManagerStacksParamList,
} from '@unionkey/shared/src/routes';

import type { RouteProp } from '@react-navigation/core';

export function useAccountSelectorRoute() {
  const route =
    useRoute<
      RouteProp<
        IAccountManagerStacksParamList,
        EAccountManagerStacksRoutes.AccountSelectorStack
      >
    >();
  return route;
}
