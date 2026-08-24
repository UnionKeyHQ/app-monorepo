import { defaultLogger } from '@unionkeyhq/shared/src/logger/logger';
import { waitAsync } from '@unionkeyhq/shared/src/utils/promiseUtils';

export const exportLogs = async () => {
  defaultLogger.setting.device.logDeviceInfo();
  await waitAsync(50);
  globalThis.desktopApi.openLoggerFile();
};
