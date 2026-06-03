import { defaultLogger } from '@unionkey/shared/src/logger/logger';
import utils from '@unionkey/shared/src/logger/utils';
import platformEnv from '@unionkey/shared/src/platformEnv';
import { waitAsync } from '@unionkey/shared/src/utils/promiseUtils';

const getShareModule = async () => {
  if (!platformEnv.isNative) return null;
  return (await import('@unionkey/shared/src/modules3rdParty/expo-sharing'))
    .default;
};

export const exportLogs = async (filename: string) => {
  defaultLogger.setting.device.logDeviceInfo();
  await waitAsync(1000);
  const logFilePath = await utils.getLogFilePath(filename);
  const Share = await getShareModule();
  if (!Share) return;
  Share.shareAsync(logFilePath, {
    dialogTitle: 'UnionKey Logs',
    mimeType: 'application/zip',
    UTI: 'public.zip-archive',
  }).catch(() => {
    /** ignore */
  });
};
