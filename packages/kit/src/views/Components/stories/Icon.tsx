import {
  Box,
  Center,
  Icon,
  ScrollView,
  Typography,
} from '@unionkeyhq/components';
import type { ICON_NAMES } from '@unionkeyhq/components/src/Icon/Icons';
import Icons from '@unionkeyhq/components/src/Icon/Icons';

const IconGallery = () => (
  <ScrollView bg="background-hovered">
    <Box flexDirection="row" flexWrap="wrap">
      {Object.keys(Icons).map((icon) => (
        <Center key={icon} p="4">
          <Icon name={icon as ICON_NAMES} />
          <Typography.Body1>{icon}</Typography.Body1>
        </Center>
      ))}
    </Box>
  </ScrollView>
);

export default IconGallery;
