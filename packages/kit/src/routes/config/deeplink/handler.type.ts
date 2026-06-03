import type { IDesktopOpenUrlEventData } from '@unionkey/desktop/app/app';

export type IRegisterHandler = (
  handler: (data: IDesktopOpenUrlEventData) => void,
) => void;
