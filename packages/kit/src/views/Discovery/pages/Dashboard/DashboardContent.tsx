import { memo, useCallback, useEffect, useMemo, useState } from 'react';

import pRetry from 'p-retry';

import { RefreshControl, ScrollView, Stack } from '@onekeyhq/components';
import backgroundApiProxy from '@onekeyhq/kit/src/background/instance/backgroundApiProxy';
import useListenTabFocusState from '@onekeyhq/kit/src/hooks/useListenTabFocusState';
import { usePromiseResult } from '@onekeyhq/kit/src/hooks/usePromiseResult';
import { useRouteIsFocused as useIsFocused } from '@onekeyhq/kit/src/hooks/useRouteIsFocused';
import platformEnv from '@onekeyhq/shared/src/platformEnv';
import { ETabRoutes } from '@onekeyhq/shared/src/routes';

import { useBannerData } from '../../hooks/useBannerData';
import { useDisplayHomePageFlag } from '../../hooks/useWebTabs';

import { DashboardBanner } from './Banner';
import { BookmarksSection } from './BookmarksSection';
import { DiveInContent } from './DiveInContent';
import { TrendingSection } from './TrendingSection';
import { Welcome } from './Welcome';

import type { NativeScrollEvent, NativeSyntheticEvent } from 'react-native';

function DashboardContent({
  onScroll,
}: {
  onScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
}) {
  const isFocused = useIsFocused();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { result: homePageData, isLoading, run } = usePromiseResult(
    async () => {
      try {
        const result = await pRetry(
          () =>
            backgroundApiProxy.serviceDiscovery.fetchDiscoveryHomePageData(),
          { retries: 3 },
        );
        return result;
      } catch (error) {
        console.error(error);
      } finally {
        setIsRefreshing(false);
      }
    },
    [],
    {
      watchLoading: true,
      checkIsFocused: false,
      revalidateOnReconnect: true,
    },
  );

  const refresh = useCallback(() => {
    setIsRefreshing(true);
    void run();
  }, [run]);

  const { hasActiveBanners } = useBannerData(homePageData?.banners || []);

  const { result: bookmarksData, run: refreshBookmarks } = usePromiseResult(
    async () => {
      const bookmarks = await backgroundApiProxy.serviceDiscovery.getBookmarkData({
        generateIcon: true,
        sliceCount: 14,
      });
      return bookmarks;
    },
    [],
    { watchLoading: true },
  );

  useListenTabFocusState(ETabRoutes.Discovery, (isFocus) => {
    if (isFocus) {
      setTimeout(() => {
        void refreshBookmarks();
      });
    }
  });

  const { displayHomePage } = useDisplayHomePageFlag();
  useEffect(() => {
    if (displayHomePage && platformEnv.isNative) {
      void refreshBookmarks();
    }
  }, [displayHomePage, refreshBookmarks]);

  const hasBookmarks = bookmarksData && bookmarksData.length > 0;
  const hasTrending = homePageData?.trending && homePageData.trending.length > 0;
  const showDiveInDescription = !hasBookmarks && !hasTrending;

  // 🔹 随机排序 trending 数据
  const shuffledTrending = useMemo(() => {
    if (!homePageData?.trending) return [];
    const arr = [...homePageData.trending];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }, [homePageData?.trending]);

  const content = useMemo(
    () => (
      <>
        <Welcome
          banner={
            hasActiveBanners ? (
              <DashboardBanner
                key="Banner"
                banners={homePageData?.banners || []}
                isLoading={isLoading}
              />
            ) : null
          }
          discoveryData={homePageData}
        />

        <Stack alignItems="center">
          {!isLoading && showDiveInDescription ? (
            <DiveInContent onReload={refresh} />
          ) : (
            <>
              {hasBookmarks && (
                <Stack px="$5" width="100%" $gtXl={{ width: 960 }}>
                  <BookmarksSection key="BookmarksSection" />
                </Stack>
              )}

              <Stack px="$5" width="100%" $gtXl={{ width: 960 }} mt="$4">
                <TrendingSection
                  data={shuffledTrending} // 🔹 使用随机排序后的数组
                  isLoading={!!isLoading}
                />
              </Stack>
            </>
          )}
        </Stack>
      </>
    ),
    [
      hasActiveBanners,
      homePageData,
      isLoading,
      showDiveInDescription,
      refresh,
      hasBookmarks,
      shuffledTrending,
    ],
  );

  if (platformEnv.isNative) {
    return (
      <ScrollView
        height="100%"
        onScroll={isFocused ? (onScroll as any) : undefined}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={refresh} />
        }
      >
        {content}
      </ScrollView>
    );
  }

  return (
    <ScrollView>
      <Stack maxWidth={1280} width="100%" alignSelf="center">
        {content}
      </Stack>
    </ScrollView>
  );
}

export default memo(DashboardContent);
