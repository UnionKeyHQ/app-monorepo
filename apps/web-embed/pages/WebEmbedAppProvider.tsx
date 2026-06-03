import { ConfigProvider } from '@unionkey/components';
import { HyperlinkText } from '@unionkey/kit/src/components/HyperlinkText';

import webEmbedAppSettings from '../utils/webEmbedAppSettings';

export default function WebEmbedAppProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = webEmbedAppSettings.getSettings();

  // TODO Toast support
  return (
    <ConfigProvider
      theme={(settings?.themeVariant as any) || 'light'}
      locale={(settings?.localeVariant as any) || 'en-US'}
      HyperlinkText={HyperlinkText}
    >
      {children}
    </ConfigProvider>
  );
}
