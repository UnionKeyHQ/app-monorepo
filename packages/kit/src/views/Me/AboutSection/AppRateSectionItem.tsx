import type { FC } from 'react';
import { useCallback } from 'react';

import { useIntl } from 'react-intl';

import { Box, Icon, Pressable, Text } from '@unionkeyhq/components';
import platformEnv from '@unionkeyhq/shared/src/platformEnv';

import { openAppStoryWriteReview } from '../../../utils/openAppReview';

const AppRateSectionItem: FC = () => {
  const intl = useIntl();
  const showRate =
    platformEnv.isNativeAndroidGooglePlay ||
    platformEnv.isNativeIOS;
  const onPress = useCallback(() => {
    if (platformEnv.isNative) {
      openAppStoryWriteReview();
    }
  }, []);
  if (showRate) {
    return (
      <Pressable
        display="flex"
        flexDirection="row"
        alignItems="center"
        py={4}
        px={{ base: 4, md: 6 }}
        borderBottomWidth="1"
        borderBottomColor="divider"
        onPress={onPress}
      >
        <Icon name="StarOutline" />
        <Text
          typography={{ sm: 'Body1Strong', md: 'Body2Strong' }}
          flex={1}
          mx={3}
        >
          {intl.formatMessage({
            id: 'form__rate_our_app',
          })}
        </Text>
        <Box>
          <Icon name="ChevronRightMini" color="icon-subdued" size={20} />
        </Box>
      </Pressable>
    );
  }
  return null;
};

export default AppRateSectionItem;
