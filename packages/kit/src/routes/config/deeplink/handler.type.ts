import type { IDesktopOpenUrlEventData } from '@unionkeyhq/desktop/app/app';

export type IRegisterHandler = (
  handler: (data: IDesktopOpenUrlEventData) => void,
) => void;
