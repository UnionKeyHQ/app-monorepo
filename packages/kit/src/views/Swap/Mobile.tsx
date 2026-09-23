import { useCallback, useState } from 'react';

import { RefreshControl } from 'react-native';

import {
  Box,
  Center,
  ScrollView,
  useSafeAreaInsets,
} from '@unionkeyhq/components';
import {
  AppUIEventBusNames,
  appUIEventBus,
} from '@unionkeyhq/shared/src/eventBus/appUIEventBus';

import { Main } from './Main';
import { NFTMarket } from './NFTMarket';
import { SwapHeader } from './SwapHeader';
import SwapObserver from './SwapObserver';
import SwapUpdater from './SwapUpdater';

export const Mobile = () => {
  const { top } = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);
  const [activeView, setActiveView] = useState<'trade' | 'nft'>('trade');
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    appUIEventBus.emit(AppUIEventBusNames.SwapRefresh);
    setTimeout(() => setRefreshing(false), 500);
  }, []);
  return (
    <Box flex="1" position="relative">
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Center pt={`${top + 16}px`}>
          <Box maxW={{ md: '480px' }} width="full">
            <Box px="4" mb="4" zIndex={1}>
              <SwapHeader
                activeView={activeView}
                onViewChange={setActiveView}
              />
            </Box>
            {activeView === 'nft' ? <NFTMarket /> : <Main />}
          </Box>
        </Center>
      </ScrollView>
      <SwapObserver />
      <SwapUpdater />
    </Box>
  );
};
