import { useEffect, useState } from 'react';

import { useThrottledCallback } from 'use-debounce';

import { ipcMessageKeys } from '@unionkeyhq/desktop/app/config';
import platformEnv from '@unionkeyhq/shared/src/platformEnv';

import { defaultLogger } from '../../logger/logger';

import type {
  IClearPackage,
  IDownloadASC,
  IDownloadPackage,
  IInstallPackage,
  IManualInstallPackage,
  IUpdateDownloadedEvent,
  IUseDownloadProgress,
  IVerifyASC,
  IVerifyPackage,
} from './type';

const desktopApi = globalThis.desktopApi;

const updateCheckingTasks: (() => void)[] = [];
desktopApi?.on?.(ipcMessageKeys.UPDATE_CHECKING, () => {
  defaultLogger.update.app.log('checking');
  while (updateCheckingTasks.length) {
    updateCheckingTasks.pop()?.();
  }
});

const updateAvailableTasks: (() => void)[] = [];
desktopApi?.on?.(ipcMessageKeys.UPDATE_AVAILABLE, ({ version }) => {
  defaultLogger.update.app.log('available', version);
  while (updateAvailableTasks.length) {
    updateAvailableTasks.pop()?.();
  }
});

desktopApi?.on?.(ipcMessageKeys.UPDATE_NOT_AVAILABLE, (params) => {
  console.log('update/not-available', params);
  defaultLogger.update.app.log('not-available');
});

desktopApi?.on?.(ipcMessageKeys.UPDATE_DOWNLOAD, ({ version }) => {
  defaultLogger.update.app.log('download', version);
});

const updateVerifyTasks: (() => void)[] = [];
desktopApi?.on?.(ipcMessageKeys.UPDATE_VERIFIED, () => {
  defaultLogger.update.app.log('update/verified');
  while (updateVerifyTasks.length) {
    updateVerifyTasks.pop()?.();
  }
});

const updateDownloadASCTasks: (() => void)[] = [];
desktopApi?.on?.(ipcMessageKeys.UPDATE_DOWNLOAD_ASC_DONE, () => {
  defaultLogger.update.app.log('update/download-asc');
  while (updateDownloadASCTasks.length) {
    updateDownloadASCTasks.pop()?.();
  }
});

const updateVerifyASCTasks: (() => void)[] = [];
desktopApi?.on?.(ipcMessageKeys.UPDATE_VERIFY_ASC_DONE, () => {
  defaultLogger.update.app.log('update/verify-asc');
  while (updateVerifyASCTasks.length) {
    updateVerifyASCTasks.pop()?.();
  }
});

let updateDownloadingTasks: ((params: {
  total: number;
  delta: number;
  transferred: number;
  percent: number;
  bytesPerSecond: number;
}) => void)[] = [];
desktopApi?.on?.(
  ipcMessageKeys.UPDATE_DOWNLOADING,
  (params: {
    percent: number;
    delta: number;
    bytesPerSecond: number;
    total: number;
    transferred: number;
  }) => {
    console.log('update/downloading', params);
    defaultLogger.update.app.log('downloading', params.percent);
    updateDownloadingTasks.forEach((t) => t(params));
  },
);

const updateDownloadedTasks: ((event: IUpdateDownloadedEvent) => void)[] = [];
desktopApi?.on?.(
  ipcMessageKeys.UPDATE_DOWNLOADED,
  (event: IUpdateDownloadedEvent) => {
    defaultLogger.update.app.log('download');
    while (updateDownloadedTasks.length) {
      updateDownloadedTasks.pop()?.(event);
    }
    updateDownloadingTasks = [];
  },
);

const updateErrorTasks: ((error: { message: string }) => void)[] = [];
desktopApi?.on?.(
  ipcMessageKeys.UPDATE_ERROR,
  ({
    err,
    isNetworkError,
  }: {
    err: { message: string };
    isNetworkError: boolean;
  }) => {
    console.log('update/error', err, isNetworkError);
    const message =
      err.message ||
      'Network exception, please check your internet connection.';
    defaultLogger.update.app.log('error', message);
    while (updateErrorTasks.length) {
      updateErrorTasks.pop()?.({ message });
    }
  },
);

export const downloadPackage: IDownloadPackage = () =>
  new Promise<IUpdateDownloadedEvent>((resolve, reject) => {
    if (!desktopApi) {
      reject(new Error('Desktop update API is unavailable.'));
      return;
    }
    updateAvailableTasks.push(() => {
      desktopApi.downloadUpdate();
    });
    updateDownloadedTasks.push((event: IUpdateDownloadedEvent) => {
      resolve(event);
    });
    updateErrorTasks.push(reject);
    desktopApi.checkForUpdates();
  });

export const downloadASC: IDownloadASC = async (params) =>
  new Promise((resolve, reject) => {
    if (!desktopApi) {
      reject(new Error('Desktop update API is unavailable.'));
      return;
    }
    updateDownloadASCTasks.push(resolve);
    updateErrorTasks.push(reject);
    desktopApi.downloadASC(params);
  });

export const verifyASC: IVerifyASC = async (params) =>
  new Promise((resolve, reject) => {
    if (!desktopApi) {
      reject(new Error('Desktop update API is unavailable.'));
      return;
    }
    updateVerifyASCTasks.push(resolve);
    updateErrorTasks.push(reject);
    desktopApi.verifyASC(params);
  });

export const verifyPackage: IVerifyPackage = async (params) =>
  new Promise((resolve, reject) => {
    if (!desktopApi) {
      reject(new Error('Desktop update API is unavailable.'));
      return;
    }
    updateVerifyTasks.push(resolve);
    updateErrorTasks.push(reject);
    desktopApi.verifyUpdate(params);
  });

export const installPackage: IInstallPackage = async ({ downloadedEvent }) =>
  new Promise((_, reject) => {
    if (!desktopApi) {
      reject(new Error('Desktop update API is unavailable.'));
      return;
    }
    defaultLogger.update.app.log('install');
    updateErrorTasks.push(reject);
    // verifyUpdate will be called by default in the electron module when calling to installUpdate
    desktopApi.installUpdate({
      ...downloadedEvent,
      buildNumber: String(platformEnv.buildNumber || 1),
    });
  });

export const useDownloadProgress: IUseDownloadProgress = (
  onSuccess,
  onFailed,
) => {
  const [percent, setPercent] = useState(0);

  const updatePercent = useThrottledCallback(
    ({
      percent: progress,
    }: {
      total: number;
      delta: number;
      transferred: number;
      percent: number;
      bytesPerSecond: number;
    }) => {
      defaultLogger.update.app.log('downloading', progress);
      setPercent(Number(Number(progress).toFixed()));
    },
    10,
  );

  useEffect(() => {
    updateDownloadingTasks.push(updatePercent);
    updateDownloadedTasks.push(onSuccess);
    updateErrorTasks.push(onFailed);
  }, [onFailed, onSuccess, updatePercent]);
  return percent;
};

export const clearPackage: IClearPackage = async () => {
  desktopApi?.clearUpdate?.();
};

export const manualInstallPackage: IManualInstallPackage = async (params) =>
  new Promise((resolve, reject) => {
    if (!desktopApi) {
      reject(new Error('Desktop update API is unavailable.'));
      return;
    }
    updateErrorTasks.push(reject);
    desktopApi.manualInstallPackage(params);
    setTimeout(() => {
      resolve();
    }, 3500);
  });
