import { Page } from '@unionkeyhq/components';
import platformEnv from '@unionkeyhq/shared/src/platformEnv';

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
