import { Page } from '@unionkeyhq/components';
import { ETabRoutes } from '@unionkeyhq/shared/src/routes';
import { useDebugComponentRemountLog } from '@unionkeyhq/shared/src/utils/debug/debugUtils';
import { EAccountSelectorSceneName } from '@unionkeyhq/shared/types';

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
