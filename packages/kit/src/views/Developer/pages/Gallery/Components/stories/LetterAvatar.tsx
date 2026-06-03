/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/no-unstable-nested-components */

import { YStack } from '@unionkey/components';
import { LetterAvatar } from '@unionkey/kit/src/components/LetterAvatar';
import { NetworkAvatar } from '@unionkey/kit/src/components/NetworkAvatar';

import { Layout } from './utils/Layout';

const LetterAvatarGallery = () => (
  <Layout
    filePath={__CURRENT_FILE_PATH__}
    componentName="LetterAvatar"
    elements={[
      {
        title: 'Default',
        element: (
          <YStack gap="$4" justifyContent="center">
            <LetterAvatar letter="A" size="$10" />
            <LetterAvatar letter="A" size="$8" />
            <LetterAvatar letter="A" size="$6" />
            <LetterAvatar letter="A" size="$5" />
            <LetterAvatar letter="A" size="$4" />
            <LetterAvatar letter="A" size="$3" />
            <NetworkAvatar networkId="btc--0" size="$10" isCustomNetwork />
          </YStack>
        ),
      },
    ]}
  />
);

export default LetterAvatarGallery;
