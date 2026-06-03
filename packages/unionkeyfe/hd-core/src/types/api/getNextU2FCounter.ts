import { NextU2FCounter } from '@unionkeyfe/hd-transport';
import type { CommonParams, Response } from '../params';

export declare function getNextU2FCounter(
  connectId?: string,
  params?: CommonParams
): Response<NextU2FCounter>;
