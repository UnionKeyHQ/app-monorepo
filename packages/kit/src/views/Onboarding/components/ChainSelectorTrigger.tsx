import { Icon } from '@unionkeyhq/components';
import { ListItem } from '@unionkeyhq/kit/src/components/ListItem';
import { EChainSelectorPages, EModalRoutes } from '@unionkeyhq/shared/src/routes';

import useAppNavigation from '../../../hooks/useAppNavigation';

export function ChainSelectorTrigger() {
  const navigation = useAppNavigation();

  const handleChainPress = () => {
    navigation.pushModal(EModalRoutes.ChainSelectorModal, {
      screen: EChainSelectorPages.AccountChainSelector,
    });
  };

  return (
    <ListItem
      borderWidth="$px"
      borderColor="$borderStrong"
      mx="$0"
      avatarProps={{
        src: 'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/128/color/eth.png',
        size: '$7',
        bg: '$bgStrong',
        circular: true,
      }}
      title="Ethereum"
      onPress={handleChainPress}
      focusVisibleStyle={{
        outlineOffset: 0,
        outlineWidth: 2,
        outlineStyle: 'solid',
        outlineColor: '$focusRing',
      }}
    >
      <Icon name="ChevronGrabberVerOutline" color="$iconSubdued" />
    </ListItem>
  );
}
