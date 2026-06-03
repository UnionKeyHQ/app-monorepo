import { createLazyKitProvider } from '@unionkey/kit/src/provider/createLazyKitProvider';
import '@unionkey/shared/src/web/index.css';

const KitProviderExt = createLazyKitProvider({
  displayName: 'KitProviderExt',
});
export default KitProviderExt;
