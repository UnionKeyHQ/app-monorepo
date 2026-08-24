import { useCallback } from 'react';

import { useShortcuts } from '@unionkeyhq/components';
import type { EShortcutEvents } from '@unionkeyhq/shared/src/shortcuts/shortcuts.enum';

import { useRouteIsFocused } from './useRouteIsFocused';

export const useShortcutsOnRouteFocused = (
  shortcutKey: EShortcutEvents,
  onShortcuts: () => void,
) => {
  const isFocus = useRouteIsFocused();
  const handleShortcuts = useCallback(() => {
    if (isFocus) {
      onShortcuts();
    }
  }, [isFocus, onShortcuts]);
  useShortcuts(shortcutKey, handleShortcuts);
};
