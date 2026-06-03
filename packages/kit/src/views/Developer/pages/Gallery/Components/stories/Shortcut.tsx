import { Shortcut, YStack } from '@unionkey/components';
import { shortcutsKeys } from '@unionkey/shared/src/shortcuts/shortcutsKeys.enum';

import { Layout } from './utils/Layout';

const ShortcutGallery = () => (
  <Layout
    filePath={__CURRENT_FILE_PATH__}
    componentName="Shortcut"
    elements={[
      {
        title: 'State',
        element: (
          <YStack gap="$4">
            <Shortcut>
              <Shortcut.Key>{shortcutsKeys.CmdOrCtrl}</Shortcut.Key>
              <Shortcut.Key>t</Shortcut.Key>
            </Shortcut>
          </YStack>
        ),
      },
    ]}
  />
);

export default ShortcutGallery;
