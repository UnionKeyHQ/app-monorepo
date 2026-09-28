/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable import/named */
import type { StackBasicRoutes } from '../../../../routes';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type UnionKeyLiteDetailScreenValues = {
  liteId: string;
};

export type UnionKeyLiteDetailRoutesParams = {
  [StackBasicRoutes.ScreenUnionKeyLiteDetail]: {
    defaultValues: UnionKeyLiteDetailScreenValues;
  };
};

export type UnionKeyLiteDetailNavigation = NativeStackNavigationProp<
  UnionKeyLiteDetailRoutesParams,
  StackBasicRoutes
>;
