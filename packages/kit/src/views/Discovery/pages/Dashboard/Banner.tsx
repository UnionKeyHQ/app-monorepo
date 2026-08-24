import { useMemo } from 'react';
import { Pressable, Image } from 'react-native';

import { Stack } from '@unionkeyhq/components';
import { EEnterMethod } from '@unionkeyhq/shared/src/logger/scopes/discovery/scenes/dapp';
import type { IDiscoveryBanner } from '@unionkeyhq/shared/types/discovery';

import { useBannerData } from '../../hooks/useBannerData';
import { useWebSiteHandler } from '../../hooks/useWebSiteHandler';

export function DashboardBanner({
  banners,
  isLoading,
}: {
  banners: IDiscoveryBanner[];
  isLoading: boolean | undefined;
}) {
  const { data, closeAllBanners } = useBannerData(banners);
  const handleWebSite = useWebSiteHandler();

  const showImage = useMemo(() => !isLoading, [isLoading]);

  const imageUrl = 'https://unionkey.io/img/showimg.dd6bef8b.png';
  const targetUrl = 'https://unionkey.io/Home';

  return (
    <Stack
      h={120}
      w="100%"
      $gtSm={{
        w: 360,
      }}
      justifyContent="center"
      alignItems="center"
    >
      {showImage && (
        <Pressable
          onPress={() => {
            handleWebSite({
              webSite: {
                url: targetUrl,
                title: targetUrl,
                logo: undefined,
                sortIndex: undefined,
              },
              useSystemBrowser: false,
              shouldPopNavigation: false,
              enterMethod: EEnterMethod.banner,
            });
          }}
          style={{ width: '100%', maxWidth: 360 }}
        >
          <Image
            source={{ uri: imageUrl }}
            style={{
              width: '100%',
              height: 120,
              resizeMode: 'cover', // 等价于 objectFit: 'cover'
            }}
          />
        </Pressable>
      )}
    </Stack>
  );
}
