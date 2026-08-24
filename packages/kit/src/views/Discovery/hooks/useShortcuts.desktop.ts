import { useCallback, useRef } from 'react';

import type { IPageNavigationProp } from '@unionkeyhq/components';
import { useClipboard, useShortcuts } from '@unionkeyhq/components';
import type { IElectronWebView } from '@unionkeyhq/kit/src/components/WebView/types';
import useAppNavigation from '@unionkeyhq/kit/src/hooks/useAppNavigation';
import useListenTabFocusState from '@unionkeyhq/kit/src/hooks/useListenTabFocusState';
import { useBrowserTabActions } from '@unionkeyhq/kit/src/states/jotai/contexts/discovery';
import type { IDiscoveryModalParamList } from '@unionkeyhq/shared/src/routes';
import {
  EDiscoveryModalRoutes,
  EModalRoutes,
  ETabRoutes,
} from '@unionkeyhq/shared/src/routes';
import { EUniversalSearchPages } from '@unionkeyhq/shared/src/routes/universalSearch';
import { EShortcutEvents } from '@unionkeyhq/shared/src/shortcuts/shortcuts.enum';

import { webviewRefs } from '../utils/explorerUtils';

import { useActiveTabId, useWebTabs } from './useWebTabs';

export const useDiscoveryShortcuts = () => {
  const { copyText } = useClipboard();
  const navigation =
    useAppNavigation<IPageNavigationProp<IDiscoveryModalParamList>>();

  const isAtDiscoveryTab = useRef(false);
  const isAtBrowserTab = useRef(false);
  useListenTabFocusState(ETabRoutes.Discovery, (isFocus) => {
    isAtDiscoveryTab.current = isFocus;
  });
  useListenTabFocusState(
    ETabRoutes.MultiTabBrowser,
    (isFocus, isHideByModal) => {
      isAtBrowserTab.current = !isHideByModal && isFocus;
    },
  );

  const { activeTabId } = useActiveTabId();
  const { closeWebTab } = useBrowserTabActions().current;
  const { tabs } = useWebTabs();

  const handleCloseWebTab = useCallback(() => {
    if (!activeTabId) {
      return;
    }
    const tabIndex = tabs.findIndex((t) => t.id === activeTabId);
    if (tabs[tabIndex].isPinned) {
      navigation.switchTab(ETabRoutes.Discovery);
    } else {
      closeWebTab({ tabId: activeTabId, entry: 'ShortCut' });
    }
  }, [activeTabId, tabs, closeWebTab, navigation]);

  const handleShortcuts = useCallback(
    (data: EShortcutEvents) => {
      // only handle shortcuts when at browser tab
      switch (data) {
        case EShortcutEvents.CopyAddressOrUrl:
          if (isAtBrowserTab.current) {
            try {
              const url = (
                webviewRefs[activeTabId ?? '']?.innerRef as IElectronWebView
              )?.getURL();
              if (url) {
                copyText(url);
              }
            } catch {
              // empty
            }
          }
          break;
        case EShortcutEvents.GoForwardHistory:
          if (isAtBrowserTab.current) {
            try {
              (
                webviewRefs[activeTabId ?? '']?.innerRef as IElectronWebView
              )?.goForward();
            } catch {
              // empty
            }
          }
          break;
        case EShortcutEvents.GoBackHistory:
          if (isAtBrowserTab.current) {
            try {
              (
                webviewRefs[activeTabId ?? '']?.innerRef as IElectronWebView
              )?.goBack();
            } catch {
              // empty
            }
          }
          break;
        case EShortcutEvents.Refresh:
          if (isAtBrowserTab.current) {
            try {
              (
                webviewRefs[activeTabId ?? '']?.innerRef as IElectronWebView
              )?.reload();
            } catch {
              // empty
            }
          } else {
            globalThis.desktopApi.reload();
          }
          break;
        case EShortcutEvents.CloseTab:
          if (isAtBrowserTab.current) {
            handleCloseWebTab();
          } else {
            globalThis.desktopApi.quitApp();
          }
          return;
        case EShortcutEvents.ViewHistory:
          navigation.pushModal(EModalRoutes.DiscoveryModal, {
            screen: EDiscoveryModalRoutes.HistoryListModal,
          });
          break;
        case EShortcutEvents.ViewBookmark:
          navigation.pushModal(EModalRoutes.DiscoveryModal, {
            screen: EDiscoveryModalRoutes.BookmarkListModal,
          });
          break;
        case EShortcutEvents.UniversalSearch:
          navigation.pushModal(EModalRoutes.UniversalSearchModal, {
            screen: EUniversalSearchPages.UniversalSearch,
          });
          break;
        default:
          break;
      }
    },
    [activeTabId, copyText, handleCloseWebTab, navigation],
  );

  useShortcuts(undefined, handleShortcuts);
};
