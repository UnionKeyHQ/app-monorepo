import { ResourceType, Success } from '@unionkeyfe/hd-transport';
import type { CommonParams, Response } from '../params';

export type DeviceUploadResourceParams = {
  suffix: string;
  dataHex: string;
  thumbnailDataHex: string;
  resType: ResourceType;
  nftMetaData: string;
  fileNameNoExt?: string;
};

export declare function deviceUploadResource(
  connectId: string,
  params: CommonParams & DeviceUploadResourceParams
): Response<Success>;
