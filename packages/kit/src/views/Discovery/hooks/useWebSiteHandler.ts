import { useCallback } from 'react';

import { useMedia } from '@unionkeyhq/components';
import useAppNavigation from '@unionkeyhq/kit/src/hooks/useAppNavigation';
import { useBrowserAction } from '@unionkeyhq/kit/src/states/jotai/contexts/discovery';
import { defaultLogger } from '@unionkeyhq/shared/src/logger/logger';
import type { EEnterMethod } from '@unionkeyhq/shared/src/logger/scopes/discovery/scenes/dapp';
import { openUrlExternal } from '@unionkeyhq/shared/src/utils/openUrlUtils';
import type { IDApp } from '@unionkeyhq/shared/types/discovery';

import { useActiveTabId } from './useWebTabs';

import type { IBrowserBookmark, IBrowserHistory } from '../types';

interface IHandleWebSiteParams {
  webSite?: IBrowserBookmark | IBrowserHistory;
  dApp?: IDApp;
  useSystemBrowser?: boolean;
  shouldPopNavigation?: boolean;
  useCurrentWindow?: boolean;
  enterMethod: EEnterMethod;
  tabId?: string;
}

export const useWebSiteHandler = () => {
  const { handleOpenWebSite } = useBrowserAction().current;
  const navigation = useAppNavigation();
  const { gtMd } = useMedia();
  const { activeTabId } = useActiveTabId();

  return useCallback(
    (props: IHandleWebSiteParams) => {
      const {
        webSite,
        dApp,
        useSystemBrowser,
        shouldPopNavigation,
        enterMethod,
        useCurrentWindow,
        tabId,
      } = props;

      const isDapp = !!dApp;
      const url = isDapp ? dApp?.url : webSite?.url;
      const title = isDapp ? dApp?.name : webSite?.title;
      const effectiveTabId = tabId || activeTabId || '';

      if (!url || !title) {
        return;
      }

      if (useSystemBrowser) {
        openUrlExternal(url);
      } else {
        handleOpenWebSite({
          webSite,
          dApp,
          navigation,
          shouldPopNavigation,
          switchToMultiTabBrowser: gtMd,
          useCurrentWindow,
          tabId: effectiveTabId,
        });
      }

      defaultLogger.discovery.dapp.enterDapp({
        dappDomain: url,
        dappName: title,
        enterMethod,
      });
    },
    [navigation, handleOpenWebSite, gtMd, activeTabId],
  );
};
