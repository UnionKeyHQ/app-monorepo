import { useCallback, useEffect, useState } from 'react';

import { useWebViewBridge } from '@onekeyfe/onekey-cross-webview';
import { useRoute } from '@react-navigation/core';
import { useIntl } from 'react-intl';
import { Share } from 'react-native';

import { ActionList, Page, useClipboard } from '@unionkeyhq/components';
import { HeaderIconButton } from '@unionkeyhq/components/src/layouts/Navigation/Header';
import WebView from '@unionkeyhq/kit/src/components/WebView';
import { WebViewWebEmbed } from '@unionkeyhq/kit/src/components/WebViewWebEmbed';
import useAppNavigation from '@unionkeyhq/kit/src/hooks/useAppNavigation';
import { ETranslations } from '@unionkeyhq/shared/src/locale';
import platformEnv from '@unionkeyhq/shared/src/platformEnv';
import type {
  EModalWebViewRoutes,
  IModalWebViewParamList,
} from '@unionkeyhq/shared/src/routes/webView';
import { openUrlExternal } from '@unionkeyhq/shared/src/utils/openUrlUtils';

import type {
  IJsBridgeMessagePayload,
  IJsonRpcRequest,
} from '@onekeyfe/cross-inpage-provider-types';
import type { RouteProp } from '@react-navigation/core';

export default function WebViewModal() {
  const { webviewRef, setWebViewRef } = useWebViewBridge();
  const route =
    useRoute<RouteProp<IModalWebViewParamList, EModalWebViewRoutes.WebView>>();
  const { url, title, isWebEmbed, hashRoutePath, hashRouteQueryParams } =
    route.params;
  const navigation = useAppNavigation();

  const { copyText } = useClipboard();
  const intl = useIntl();
  const headerRight = useCallback(
    () => (
      <ActionList
        renderTrigger={<HeaderIconButton icon="DotHorOutline" />}
        title={intl.formatMessage({ id: ETranslations.explore_options })}
        sections={[
          {
            items: [
              {
                label: intl.formatMessage({ id: ETranslations.global_refresh }),
                icon: 'RefreshCwOutline',
                onPress: async () => {
                  webviewRef?.current?.reload?.();
                },
              },
              {
                label: intl.formatMessage({ id: ETranslations.explore_share }),
                icon: 'ShareOutline',
                onPress: () => {
                  Share.share(
                    platformEnv.isNativeIOS
                      ? {
                          url,
                        }
                      : {
                          message: url,
                        },
                  ).catch(() => {});
                },
              },
              {
                // 'Copy URL'
                label: intl.formatMessage({
                  id: ETranslations.global_copy_url,
                }),
                icon: 'LinkOutline',
                onPress: async () => {
                  copyText(url);
                },
              },
              {
                label: intl.formatMessage({
                  id: ETranslations.explore_open_in_browser,
                }),
                icon: 'GlobusOutline',
                onPress: async () => {
                  openUrlExternal(url);
                },
              },
            ],
          },
        ]}
      />
    ),
    [webviewRef, url, copyText, intl],
  );

  const [navigationTitle, setNavigationTitle] = useState(title);
  useEffect(() => {
    setNavigationTitle('');
  }, []);
  const onNavigationStateChange = useCallback(
    ({ title: webTitle }: { title: string }) => {
      if (!title) {
        setNavigationTitle(webTitle);
      }
    },
    [title, setNavigationTitle],
  );
  const webembedCustomReceiveHandler = useCallback(
    (payload: IJsBridgeMessagePayload) => {
      const data = payload.data as IJsonRpcRequest;
      if (data.method === 'wallet_closeWebViewModal') {
        navigation.pop();
      }
    },
    [navigation],
  );
  return (
    <Page>
      <Page.Header headerRight={headerRight} title={navigationTitle} />
      <Page.Body>
        {isWebEmbed ? (
          <WebViewWebEmbed
            hashRoutePath={hashRoutePath}
            hashRouteQueryParams={hashRouteQueryParams}
            customReceiveHandler={webembedCustomReceiveHandler}
          />
        ) : (
          <WebView
            onWebViewRef={(ref) => ref && setWebViewRef(ref)}
            src={url}
            onNavigationStateChange={onNavigationStateChange}
          />
        )}
      </Page.Body>
    </Page>
  );
}
