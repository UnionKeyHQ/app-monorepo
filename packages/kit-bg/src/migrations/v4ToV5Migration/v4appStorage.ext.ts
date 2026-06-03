import extensionStorageInstance from '@unionkey/shared/src/storage/instance/extensionStorageInstance';

import type { AsyncStorageStatic } from '@react-native-async-storage/async-storage';

const v4appStorage: AsyncStorageStatic = extensionStorageInstance;
export { v4appStorage };
