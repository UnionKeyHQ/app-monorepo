export enum ESpotlightTour {
  createAllNetworks = 'createAllNetworks',
  unionKeyProBanner = 'unionKeyProBanner',
  allNetworkAccountValue = 'allNetworkAccountValue',
  switchDappAccount = 'switchDappAccount',
  showFloatingIconDialog = 'showFloatingIconDialog',
  referAFriend = 'referAFriend',
  hardwareSalesRewardAlert = 'hardwareSalesRewardAlert',
  earnRewardAlert = 'earnRewardAlert',
  allNetworksInfo = 'allNetworksInfo',
}

export type ITourTripTimes = number;

export interface ISpotlightData {
  data: Record<ESpotlightTour, ITourTripTimes>;
}
