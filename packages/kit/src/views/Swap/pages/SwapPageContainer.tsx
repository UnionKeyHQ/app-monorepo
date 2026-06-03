import { Page } from '@unionkey/components';
import { ETabRoutes } from '@unionkey/shared/src/routes';
import { useDebugComponentRemountLog } from '@unionkey/shared/src/utils/debug/debugUtils';
import { EAccountSelectorSceneName } from '@unionkey/shared/types';

import { TabPageHeader } from '../../../components/TabPageHeader';

import SwapMainLandWithPageType from './components/SwapMainLand';

const SwapPageContainer = () => {
  useDebugComponentRemountLog({ name: 'SwapPageContainer' });

  return (
    <Page fullPage>
      <TabPageHeader
        sceneName={EAccountSelectorSceneName.swap}
        tabRoute={ETabRoutes.Swap}
      />
      <Page.Body>
        { <SwapMainLandWithPageType /> }
      </Page.Body>
    </Page>
  );
};
export default SwapPageContainer;
