import { Box, Button, useThemeValue } from '@unionkeyhq/components';
import { showNotification } from '@unionkeyhq/components/src/utils/showNotification';

const InAppNotificationGallery = () => {
  const bg = useThemeValue('background-default');
  return (
    <Box w="full" h="full" bg={bg} p="10">
      <Button
        onPress={() => {
          showNotification({
            title: '😀 Notification',
            subtitle: 'Subtitle',
            cover:
              'https://ethereum.org/favicon-32x32.png?v=8b512faa8d4a0b019c123a771b6622aa',
          });
        }}
      >
        showNotification
      </Button>
      <Button
        mt={10}
        onPress={() => {
          showNotification({
            title: '😀 Notification',
            subtitle: 'Subtitle',
            actionText: 'Update',
            onBodyPress: () => {
              alert('onBodyPress');
            },
            onActionPress: () => {
              alert('Update');
            },
          });
        }}
      >
        showNotification with action
      </Button>
    </Box>
  );
};

export default InAppNotificationGallery;
