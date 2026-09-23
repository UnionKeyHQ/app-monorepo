import { useLayoutEffect, useState } from 'react';

import { useIntl } from 'react-intl';
import { ScrollView } from 'react-native-gesture-handler';

import { Box, Center, Icon, Typography } from '@unionkeyhq/components';

import { useNavigation } from '../../hooks';

import { Main } from './Main';
import { NFTMarket } from './NFTMarket';
import { SwapHeader } from './SwapHeader';
import SwapObserver from './SwapObserver';
import SwapUpdater from './SwapUpdater';

const DesktopHeader = () => {
  const intl = useIntl();
  return (
    <Box
      h="16"
      px="8"
      flexDirection="row"
      alignItems="center"
      justifyContent="space-between"
    >
      <Typography.Heading>
        {intl.formatMessage({ id: 'title__Swap_Bridge' })}
      </Typography.Heading>
      <Icon name="EllipsisVerticalOutline" size={24} />
    </Box>
  );
};

const DesktopMain = () => {
  const [activeView, setActiveView] = useState<'trade' | 'nft'>('trade');
  return (
    <Box>
      <Center>
        <Box maxW={{ md: '480px' }} width="full">
          <Box
            flexDirection="row"
            justifyContent="space-between"
            px="4"
            mb="4"
            zIndex={1}
          >
            <SwapHeader activeView={activeView} onViewChange={setActiveView} />
          </Box>
          <Box px="4">{activeView === 'nft' ? <NFTMarket /> : <Main />}</Box>
        </Box>
      </Center>
      <SwapUpdater />
      <SwapObserver />
    </Box>
  );
};

export const Desktop = () => {
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  return (
    <ScrollView key="swap-single-page">
      <DesktopHeader />
      <Box mt="6" pb="12">
        <Box alignItems="center" justifyContent="center">
          <Box w="480px" bg="background-default">
            <DesktopMain />
          </Box>
        </Box>
      </Box>
    </ScrollView>
  );
};
