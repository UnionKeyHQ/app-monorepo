import { Page } from '@unionkeyhq/components';
import { TabPageHeader } from '@unionkeyhq/kit/src//components/TabPageHeader';
import { AccountSelectorProviderMirror } from '@unionkeyhq/kit/src/components/AccountSelector/AccountSelectorProvider';
import platformEnv from '@unionkeyhq/shared/src/platformEnv';
import { ETabRoutes } from '@unionkeyhq/shared/src/routes';
import { EAccountSelectorSceneName } from '@unionkeyhq/shared/types';

import { HandleRebuildBrowserData } from '../../components/HandleData/HandleRebuildBrowserTabData';
import MobileBrowserBottomBar from '../../components/MobileBrowser/MobileBrowserBottomBar';
import { withBrowserProvider } from '../Browser/WithBrowserProvider';

import DashboardContent from './DashboardContent';

function Dashboard() {
  return (
    <AccountSelectorProviderMirror
      config={{
        sceneName: EAccountSelectorSceneName.home,
        sceneUrl: '',
      }}
      enabledNum={[0]}
    >
      <TabPageHeader
        sceneName={EAccountSelectorSceneName.home}
        tabRoute={ETabRoutes.Discovery}
      />
      <Page>
        {platformEnv.isNativeIOSPad ? <HandleRebuildBrowserData /> : null}
        <Page.Body>
          <DashboardContent />
          {platformEnv.isNativeIOSPad ? <MobileBrowserBottomBar id="" /> : null}
        </Page.Body>
      </Page>
    </AccountSelectorProviderMirror>
  );
}

export default withBrowserProvider(Dashboard);
