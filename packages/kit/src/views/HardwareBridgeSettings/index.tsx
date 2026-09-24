import { memo, useCallback, useLayoutEffect, useMemo } from 'react';

import { useIntl } from 'react-intl';

import {
  HStack,
  Icon,
  Pressable,
  ScrollView,
  Text,
  VStack,
  useIsVerticalLayout,
  useTheme,
} from '@unionkeyhq/components';
import { EUnionKeyDomain } from '@unionkeyhq/shared/types';

import backgroundApiProxy from '../../background/instance/backgroundApiProxy';
import { useNavigation } from '../../hooks';
import { setHardwareConnectSrc } from '../../store/reducers/settings';

import { showRefreshExtSheet } from './RefreshExtSheet';

import type { HomeRoutes } from '../../routes/routesEnum';
import type { HomeRoutesParams } from '../../routes/types';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type NavigationProps = NativeStackNavigationProp<
  HomeRoutesParams,
  HomeRoutes.HardwareBridgeSettings
>;

type IBridgeSettingItem = {
  label: EUnionKeyDomain;
  description: string;
  isActive: boolean | undefined;
};

function HardwareBridgeSettings() {
  const intl = useIntl();
  const navigation = useNavigation<NavigationProps>();
  const { themeVariant } = useTheme();
  const isSmallScreen = useIsVerticalLayout();

  const { dispatch, serviceHardware } = backgroundApiProxy;
  const onSetHardwareConnectSrc = useCallback(
    (item: IBridgeSettingItem) => {
      dispatch(setHardwareConnectSrc(item.label));
      serviceHardware.updateSettings();
      showRefreshExtSheet();
    },
    [dispatch, serviceHardware],
  );

  useLayoutEffect(() => {
    const title = intl.formatMessage({ id: 'form__hardware_bridge_sdk_url' });
    navigation.setOptions({
      title,
    });
  }, [intl, navigation]);

  const hardwareSDKOptions = useMemo<IBridgeSettingItem[]>(
    () => [
      {
        label: EUnionKeyDomain.UNIONKEY,
        description: intl.formatMessage({ id: 'form__default' }),
        isActive: true,
      },
    ],
    [intl],
  );

  const sectionBoardWidth = useMemo(() => {
    if (isSmallScreen) return undefined;
    if (themeVariant === 'light') return 1;
    return undefined;
  }, [isSmallScreen, themeVariant]);

  const sectionPadding = useMemo(() => {
    if (isSmallScreen) return 0;
    return 4;
  }, [isSmallScreen]);

  return (
    <ScrollView
      w="full"
      h="full"
      bg="background-default"
      maxW={768}
      mx="auto"
      p={4}
    >
      <VStack
        p={sectionPadding}
        space={4}
        borderRadius="12"
        borderWidth={sectionBoardWidth}
        borderColor="border-subdued"
      >
        {hardwareSDKOptions.map((item) => (
          <Pressable
            key={item.label}
            onPress={() => {
              onSetHardwareConnectSrc(item);
            }}
          >
            <HStack alignItems="center" justifyContent="space-between">
              <VStack>
                <Text typography="Body1Strong">UnionKey</Text>
                <Text typography="Body2" color="text-subdued">
                  {item.description}
                </Text>
              </VStack>
              {item.isActive && (
                <Icon name="CheckMini" color="icon-success" size={20} />
              )}
            </HStack>
          </Pressable>
        ))}
      </VStack>
      <Text my={3} typography="Caption" color="text-subdued">
        {intl.formatMessage({ id: 'form__hardware_bridge_desc' })}
      </Text>
    </ScrollView>
  );
}

export default memo(HardwareBridgeSettings);
