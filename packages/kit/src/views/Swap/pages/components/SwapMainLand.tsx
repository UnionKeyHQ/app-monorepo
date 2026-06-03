import { useMemo } from 'react';
import { SizableText, YStack, ScrollView } from '@unionkey/components';
import type { IPageNavigationProp } from '@unionkey/components';
import { EPageType } from '@unionkey/components';
import useAppNavigation from '@unionkey/kit/src/hooks/useAppNavigation';
import { EJotaiContextStoreNames } from '@unionkey/kit-bg/src/states/jotai/atoms';
import NFTMarket from './NFTMarket';
import SwapHeaderContainer from './SwapHeaderContainer';
import { SwapProviderMirror } from '../SwapProviderMirror';
interface ISwapMainLoadProps {
  children?: React.ReactNode;
  pageType?: EPageType.modal;
}

const SwapMainLoad = ({ pageType }: ISwapMainLoadProps) => {
  // 如果以后要做分页导航，可以继续用 navigation
  const navigation = useAppNavigation<IPageNavigationProp<any>>();

  const storeName = useMemo(
    () =>
      pageType === EPageType.modal
        ? EJotaiContextStoreNames.swapModal
        : EJotaiContextStoreNames.swap,
    [pageType],
  );

  return (
    <ScrollView>
      <YStack
        flex={1}
        marginHorizontal="auto"
        width="100%"
        maxWidth={pageType === EPageType.modal ? '100%' : 500}
      >
        <YStack pt="$2.5" px="$5" pb="$5" gap="$5" flex={1}>
          {/* 只保�?Header �?NFT 市场 */}
          <SwapHeaderContainer pageType={pageType} />

          {/* NFT 市场页面 */}
          <NFTMarket />
        </YStack>
      </YStack>
    </ScrollView>
  );
};

const SwapMainLandWithPageType = (props: ISwapMainLoadProps) => (
  <SwapProviderMirror
    storeName={
      props?.pageType === EPageType.modal
        ? EJotaiContextStoreNames.swapModal
        : EJotaiContextStoreNames.swap
    }
  >
    <SwapMainLoad {...props} pageType={props?.pageType} />
  </SwapProviderMirror>
);

export default SwapMainLandWithPageType;