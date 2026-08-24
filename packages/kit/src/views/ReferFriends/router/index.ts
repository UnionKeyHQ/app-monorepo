import type { IModalFlowNavigatorConfig } from '@unionkeyhq/components';
import { LazyLoadPage } from '@unionkeyhq/kit/src/components/LazyLoadPage';
import type { IModalReferFriendsParamList } from '@unionkeyhq/shared/src/routes';
import { EModalReferFriendsRoutes } from '@unionkeyhq/shared/src/routes';

const ReferFriends = LazyLoadPage(() => import('../pages/ReferAFriend'));
const YourReferred = LazyLoadPage(() => import('../pages/YourReferred'));
const HardwareSalesReward = LazyLoadPage(
  () => import('../pages/HardwareSalesReward'),
);
const UnionKeyId = LazyLoadPage(() => import('../pages/UnionKeyId'));
const InviteReward = LazyLoadPage(() => import('../pages/InviteReward'));
const EditAddress = LazyLoadPage(() => import('../pages/EditAddress'));
const EarnReward = LazyLoadPage(() => import('../pages/EarnReward'));
const YourReferredWalletAddresses = LazyLoadPage(
  () => import('../pages/YourReferredWalletAddresses'),
);
const RewardDistributionHistory = LazyLoadPage(
  () => import('../pages/RewardDistributionHistory'),
);

export const ReferFriendsRouter: IModalFlowNavigatorConfig<
  EModalReferFriendsRoutes,
  IModalReferFriendsParamList
>[] = [
  {
    name: EModalReferFriendsRoutes.ReferAFriend,
    rewrite: '/r/invite',
    exact: true,
    component: ReferFriends,
  },
  {
    name: EModalReferFriendsRoutes.YourReferred,
    component: YourReferred,
  },
  {
    name: EModalReferFriendsRoutes.YourReferredWalletAddresses,
    component: YourReferredWalletAddresses,
  },
  {
    name: EModalReferFriendsRoutes.HardwareSalesReward,
    component: HardwareSalesReward,
  },
  {
    name: EModalReferFriendsRoutes.UnionKeyId,
    component: UnionKeyId,
  },
  {
    name: EModalReferFriendsRoutes.InviteReward,
    component: InviteReward,
  },
  {
    name: EModalReferFriendsRoutes.EditAddress,
    component: EditAddress,
  },
  {
    name: EModalReferFriendsRoutes.EarnReward,
    component: EarnReward,
  },
  {
    name: EModalReferFriendsRoutes.RewardDistributionHistory,
    component: RewardDistributionHistory,
  },
];
