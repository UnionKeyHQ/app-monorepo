import { useEffect } from 'react';

import { SizableText } from '@unionkeyhq/components';
import { useRouteIsFocused as useIsFocused } from '@unionkeyhq/kit/src/hooks/useRouteIsFocused';

export function NavigationFocusTools({
  componentName,
}: {
  componentName: string;
}) {
  const isFocused = useIsFocused();

  useEffect(() => {
    console.log(
      `<=== NavigationFocus: ${componentName} isFocused: ${
        isFocused ? 'true' : 'false'
      }`,
    );
  }, [componentName, isFocused]);

  return (
    <SizableText>
      {componentName} isFocused: {isFocused ? 'true' : 'false'}
    </SizableText>
  );
}
