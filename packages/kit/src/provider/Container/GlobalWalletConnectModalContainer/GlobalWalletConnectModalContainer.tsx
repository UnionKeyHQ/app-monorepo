import { Page } from '@unionkey/components';
import platformEnv from '@unionkey/shared/src/platformEnv';

import { WalletConnectModalContainer } from '../../../components/WalletConnect/WalletConnectModalContainer';

export function GlobalWalletConnectModalContainer() {
  return platformEnv.isNativeIOS ? (
    <Page.Every>
      <WalletConnectModalContainer />
    </Page.Every>
  ) : (
    <WalletConnectModalContainer />
  );
}
