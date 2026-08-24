import type { SizeTokens } from '@unionkeyhq/components';
import { getDeviceAvatarImage } from '@unionkeyhq/shared/src/utils/avatarUtils';
import deviceUtils from '@unionkeyhq/shared/src/utils/deviceUtils';
import type { IUnionKeyDeviceFeatures } from '@unionkeyhq/shared/types/device';

import { WalletAvatar } from '../WalletAvatar';

import type { IDeviceType } from '@onekeyfe/hd-core';

export function DeviceAvatarWithColor({
  deviceType,
  features,
  size,
}: {
  deviceType: IDeviceType;
  features?: IUnionKeyDeviceFeatures;
  size?: SizeTokens;
}) {
  const img = getDeviceAvatarImage(
    deviceType,
    deviceUtils.getDeviceSerialNoFromFeatures(features),
  );

  return <WalletAvatar img={img} wallet={undefined} size={size} />;
}

export function DeviceAvatar({
  deviceType,
  size,
}: {
  size?: SizeTokens;
  deviceType: IDeviceType; // use img for WalletAvatarEdit
}) {
  return (
    <WalletAvatar
      img={deviceType || 'unknown'}
      wallet={undefined}
      size={size}
    />
  );
}
