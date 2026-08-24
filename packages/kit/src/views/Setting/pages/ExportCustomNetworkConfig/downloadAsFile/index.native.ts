import RNShare from '@unionkeyhq/shared/src/modules3rdParty/expo-sharing';
import RNFS from '@unionkeyhq/shared/src/modules3rdParty/react-native-fs';
import platformEnv from '@unionkeyhq/shared/src/platformEnv';

import type { IDownloadAsFileType } from './type';

export const downloadAsFile: IDownloadAsFileType = async ({
  content,
  filename,
}: {
  content: string;
  filename: string;
}) => {
  if (!RNFS) return;
  const filepath = `${RNFS.DocumentDirectoryPath}/${filename}`;
  // RNFS.stat will throw an error if the file does not exist on android
  const isExist = await RNFS.exists(filepath);
  if (isExist) {
    await RNFS.unlink(filepath);
  }
  await RNFS.writeFile(filepath, content, 'utf8');
  const RNShareFilePath = platformEnv.isNativeAndroid
    ? `file://${filepath}`
    : filepath;
  RNShare.shareAsync(RNShareFilePath, {
    dialogTitle: 'Custom Network Configs',
    mimeType: 'text/plain',
    UTI: 'public.plain-text',
  }).catch(() => {
    /** ignore */
  });
};
