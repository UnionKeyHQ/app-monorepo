import { createLazyKitProvider } from '@unionkeyhq/kit/src/provider/createLazyKitProvider';
import '@unionkeyhq/shared/src/web/index.css';

const KitProviderExt = createLazyKitProvider({
  displayName: 'KitProviderExt',
});
export default KitProviderExt;
