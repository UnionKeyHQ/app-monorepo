import { useIntl } from 'react-intl';

import { Box, Pressable, Typography } from '@unionkeyhq/components';

import backgroundApiProxy from '../../background/instance/backgroundApiProxy';
import { setMode } from '../../store/reducers/swap';

import { HistoryButton } from './HistoryButton';

export type ISwapView = 'trade' | 'nft';

export const SwapHeaderTab = ({
  activeView = 'trade',
  onViewChange,
}: {
  activeView?: ISwapView;
  onViewChange?: (view: ISwapView) => void;
}) => {
  const intl = useIntl();

  return (
    <Box flexDirection="row" alignItems="center" h="30px">
      <Pressable
        mr="3"
        onPress={() => {
          onViewChange?.('trade');
          backgroundApiProxy.dispatch(setMode('swap'));
        }}
      >
        <Typography.Body1Strong
          color={activeView === 'trade' ? 'text-default' : 'text-disabled'}
        >
          {intl.formatMessage({ id: 'title__swap' })}
        </Typography.Body1Strong>
      </Pressable>
      <Pressable onPress={() => onViewChange?.('nft')}>
        <Typography.Body1Strong
          color={activeView === 'nft' ? 'text-default' : 'text-disabled'}
        >
          NFT
        </Typography.Body1Strong>
      </Pressable>
    </Box>
  );
};

export const SwapHeader = ({
  activeView,
  onViewChange,
}: {
  activeView?: ISwapView;
  onViewChange?: (view: ISwapView) => void;
}) => (
  <Box
    width="full"
    flexDirection="row"
    h="9"
    justifyContent="space-between"
    alignItems="center"
  >
    <SwapHeaderTab activeView={activeView} onViewChange={onViewChange} />
    <HistoryButton />
  </Box>
);
