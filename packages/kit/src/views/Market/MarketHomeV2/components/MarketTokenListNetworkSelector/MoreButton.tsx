import type { FC } from 'react';

import { Button, Popover } from '@unionkeyhq/components';
import type { IButtonProps } from '@unionkeyhq/components';

import { NetworksSearchPanel } from './NetworksSearchPanel';

type IMoreButtonProps = Omit<IButtonProps, 'children'>;

const MoreButton: FC<IMoreButtonProps> = ({ ...rest }) => (
  <Popover
    title="Select Network"
    renderContent={
      <NetworksSearchPanel
        networkId={undefined}
        onPressItem={(item) => {
          console.log('Network selected:', item);
        }}
      />
    }
    renderTrigger={
      <Button
        variant="tertiary"
        size="medium"
        iconAfter="ChevronDownSmallOutline"
        iconColor="$iconSubdued"
        $platform-native={{
          px: '$2',
          py: '$1',
        }}
        color="$textSubdued"
        {...rest}
      >
        More
      </Button>
    }
  />
);

export { MoreButton };
