import type { EShortcutEvents } from '@unionkeyhq/shared/src/shortcuts/shortcuts.enum';

import type { ISizableTextProps } from '../../primitives/SizeableText';
import type { XStackProps } from 'tamagui';

export type IShortcutProps = XStackProps & {
  shortcutKey?: EShortcutEvents;
};

export type IShortcutContentProps = {
  shortcutKey: EShortcutEvents;
};

export type IShortcutKeyProps = ISizableTextProps;
