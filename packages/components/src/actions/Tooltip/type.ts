import type { EShortcutEvents } from '@unionkey/shared/src/shortcuts/shortcuts.enum';

import type { TooltipProps as TMTooltipProps } from 'tamagui';

export interface ITooltipProps extends TMTooltipProps {
  renderTrigger: React.ReactNode;
  renderContent: React.ReactNode;
  shortcutKey?: EShortcutEvents | string[];
}
