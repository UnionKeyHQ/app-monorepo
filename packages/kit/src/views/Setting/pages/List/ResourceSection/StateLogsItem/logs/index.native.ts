import { defaultLogger } from '@unionkeyhq/shared/src/logger/logger';
import utils from '@unionkeyhq/shared/src/logger/utils';
import platformEnv from '@unionkeyhq/shared/src/platformEnv';
import { waitAsync } from '@unionkeyhq/shared/src/utils/promiseUtils';

const getShareModule = async () => {
  if (!platformEnv.isNative) return null;
  return (await import('@unionkeyhq/shared/src/modules3rdParty/expo-sharing'))
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
