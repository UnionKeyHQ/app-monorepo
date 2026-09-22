import type { FC } from 'react';

import { StyleSheet, View } from 'react-native';

import { FULLWINDOW_OVERLAY_PORTAL } from '@unionkeyhq/kit/src/utils/overlayUtils';
import { PortalRender } from '@unionkeyhq/kit/src/views/Overlay/RootPortal';

import type { StyleProp, ViewStyle } from 'react-native';

const OverlayContainer: FC<{
  useFullWindowForIOS?: boolean;
  style?: StyleProp<ViewStyle>;
}> = ({ useFullWindowForIOS, style, ...props }) => {
  const content = (
    <View
      // testID="OverlayContainer-View"
      pointerEvents="box-none"
      style={[StyleSheet.absoluteFill, style]}
      {...props}
    />
  );
  return (
    <PortalRender container={FULLWINDOW_OVERLAY_PORTAL}>{content}</PortalRender>
  );
};
export default OverlayContainer;
