import {
  OverlayContainer,
  Portal,
  ShowToastProvider,
  Toaster,
} from '@unionkey/components';
import platformEnv from '@unionkey/shared/src/platformEnv';
import { UnionKeyFloatingChatBot } from './UnionKeyFloatingChatBot';
import { DevOverlayWindowContainer } from './DevOverlayWindowContainer';

export function FullWindowOverlayContainer() {
  return (
    <>
      <OverlayContainer>
    
      
        <Portal.Container name={Portal.Constant.SPOTLIGHT_OVERLAY_PORTAL} />
        {/* <Portal.Container name={Portal.Constant.FULL_WINDOW_OVERLAY_PORTAL}>  
          <UnionKeyFloatingChatBot />  
        </Portal.Container>  */}
        <Portal.Container name={Portal.Constant.FULL_WINDOW_OVERLAY_PORTAL} />
        <ShowToastProvider />
        <DevOverlayWindowContainer />
        {/* E2E mode, enable tap in iOS */}
        {platformEnv.isE2E ? <></> : <Toaster />}
      </OverlayContainer>
      <Portal.Container name={Portal.Constant.HARDWARE_UI_STATE_DIALOG} />
      
    </>
  );
}
